import { Effect, JSONSchema, Schema } from "effect";

import { ToolId } from "../ids";
import { ToolInvocationError } from "../errors";
import {
  ToolInvocationResult,
  type ToolRegistration,
  type InvokeOptions,
} from "../tools";
import {
  ElicitationDeclinedError,
  type ElicitationRequest,
} from "../elicitation";
import { definePlugin, type PluginContext } from "../plugin";

// ---------------------------------------------------------------------------
// In-memory tool definition — typed via Schema
// ---------------------------------------------------------------------------

/**
 * A tool that uses Effect Schema for typed input/output.
 *
 * - `inputSchema` defines and validates the args the tool receives
 * - `outputSchema` optionally describes the output shape
 * - `handler` receives the parsed/typed args
 */
export interface MemoryToolDefinition<
  TInput = unknown,
  TOutput = unknown,
> {
  readonly name: string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly inputSchema: Schema.Schema<TInput>;
  readonly outputSchema?: Schema.Schema<TOutput>;
  readonly handler: MemoryToolHandler<TInput>;
}

/**
 * A handler is either:
 * - A plain function: `(args: TInput) => TOutput`
 * - An Effect function (can use elicitation): `(args: TInput, ctx) => Effect<TOutput, ...>`
 */
export type MemoryToolHandler<TInput> =
  | ((args: TInput) => unknown)
  | ((
      args: TInput,
      ctx: MemoryToolContext,
    ) => Effect.Effect<unknown, ElicitationDeclinedError>);

export interface MemoryToolContext {
  /** Request input from the user. Returns user data or fails if declined. */
  readonly elicit: (
    request: ElicitationRequest,
  ) => Effect.Effect<Record<string, unknown>, ElicitationDeclinedError>;
}

// ---------------------------------------------------------------------------
// Plugin extension
// ---------------------------------------------------------------------------

export interface MemoryPluginExtension {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly addTools: (
    tools: readonly MemoryToolDefinition<any, any>[],
  ) => Effect.Effect<void>;
}

// ---------------------------------------------------------------------------
// Registration builder
// ---------------------------------------------------------------------------

const toRegistration = (
  namespace: string,
  def: MemoryToolDefinition,
): ToolRegistration => {
  const id = ToolId.make(`${namespace}.${def.name}`);
  const decode = Schema.decodeUnknownSync(def.inputSchema);
  const isEffectHandler = def.handler.length >= 2;

  return {
    id,
    name: def.name,
    description: def.description,
    tags: def.tags ? [...def.tags] : undefined,
    inputSchema: JSONSchema.make(def.inputSchema),
    outputSchema: def.outputSchema
      ? JSONSchema.make(def.outputSchema)
      : undefined,
    mayElicit: isEffectHandler,
    invoke: (args, options?: InvokeOptions) => {
      // Validate + decode input
      const parsed = Effect.try({
        try: () => decode(args),
        catch: (err) =>
          new ToolInvocationError({
            toolId: id,
            message: `Invalid input: ${err instanceof Error ? err.message : String(err)}`,
            cause: err,
          }),
      });

      if (!isEffectHandler) {
        // Plain handler
        return parsed.pipe(
          Effect.flatMap((input) =>
            Effect.try({
              try: () =>
                new ToolInvocationResult({
                  data: (def.handler as (args: unknown) => unknown)(input),
                  error: null,
                }),
              catch: (err) =>
                new ToolInvocationError({
                  toolId: id,
                  message:
                    err instanceof Error ? err.message : String(err),
                  cause: err,
                }),
            }),
          ),
        );
      }

      // Effect handler — build context with elicit
      const ctx: MemoryToolContext = {
        elicit: (request) =>
          Effect.gen(function* () {
            const handler = options?.onElicitation;
            if (!handler) {
              return yield* new ElicitationDeclinedError({
                toolId: id,
                action: "decline",
              });
            }
            const response = yield* handler({
              toolId: id,
              args,
              request,
            });
            if (response.action !== "accept") {
              return yield* new ElicitationDeclinedError({
                toolId: id,
                action: response.action as "decline" | "cancel",
              });
            }
            return response.content ?? {};
          }),
      };

      const effectHandler = def.handler as (
        args: unknown,
        ctx: MemoryToolContext,
      ) => Effect.Effect<unknown, ElicitationDeclinedError>;

      return parsed.pipe(
        Effect.flatMap((input) => effectHandler(input, ctx)),
        Effect.map(
          (data) => new ToolInvocationResult({ data, error: null }),
        ),
      );
    },
  };
};

// ---------------------------------------------------------------------------
// Tool definition helper — infers TInput from the schema
// ---------------------------------------------------------------------------

export function tool<TInput, TOutput>(
  def: MemoryToolDefinition<TInput, TOutput>,
): MemoryToolDefinition<TInput, TOutput> {
  return def;
}

// ---------------------------------------------------------------------------
// Plugin factory
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const memoryPlugin = (config: {
  readonly namespace?: string;
  readonly tools: readonly MemoryToolDefinition<any, any>[];
}) => {
  const ns = config.namespace ?? "memory";
  return definePlugin<"memory", MemoryPluginExtension>({
    key: "memory",
    init: (ctx: PluginContext) =>
      Effect.gen(function* () {
        const registrations = config.tools.map((t) => toRegistration(ns, t));
        yield* ctx.tools.register(registrations);

        return {
          extension: {
            addTools: (newTools: readonly MemoryToolDefinition[]) =>
              ctx.tools.register(
                newTools.map((t) => toRegistration(ns, t)),
              ),
          },
          close: () =>
            ctx.tools.unregister(registrations.map((r) => r.id)),
        };
      }),
  });
};
