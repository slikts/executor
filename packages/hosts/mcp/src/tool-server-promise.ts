import { Effect } from "effect";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { ExecutionEngine as EffectExecutionEngine } from "@executor-js/execution";
import type { ExecutionEngine, ResumeResponse } from "@executor-js/execution/promise";
import type { Skill } from "@executor-js/execution";

import { createExecutorMcpServer as createEffectExecutorMcpServer } from "./tool-server";

export interface ExecutorMcpServerConfig {
  readonly engine: ExecutionEngine;
  readonly description?: string;
  readonly debug?: boolean;
  readonly elicitationMode?: { readonly mode: "model" } | { readonly mode: "native" };
  readonly additionalSkills?: () => readonly Skill[] | Promise<readonly Skill[]>;
}

const fromPromise = <A>(thunk: () => Promise<A>): Effect.Effect<A> => Effect.promise(thunk);

const toEffectEngine = (engine: ExecutionEngine): EffectExecutionEngine => ({
  execute: (code, options) =>
    fromPromise(() =>
      engine.execute(code, {
        onElicitation: (context) => Effect.runPromise(options.onElicitation(context)),
      }),
    ),
  executeWithPause: (code, options) => fromPromise(() => engine.executeWithPause(code, options)),
  resume: (executionId, response: ResumeResponse) =>
    fromPromise(() => engine.resume(executionId, response)),
  getPausedExecution: (executionId) => fromPromise(() => engine.getPausedExecution(executionId)),
  pausedExecutionCount: () => fromPromise(() => engine.pausedExecutionCount()),
  hasPausedExecutions: () => fromPromise(() => engine.hasPausedExecutions()),
  getDescription: fromPromise(() => engine.getDescription()),
});

export const createExecutorMcpServer = (config: ExecutorMcpServerConfig): Promise<McpServer> =>
  Effect.runPromise(
    createEffectExecutorMcpServer({
      ...config,
      engine: toEffectEngine(config.engine),
      ...(config.additionalSkills
        ? {
            additionalSkills: () =>
              Effect.promise(() => Promise.resolve(config.additionalSkills!())),
          }
        : {}),
    }),
  );
