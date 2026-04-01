import { describe, expect, it } from "@effect/vitest";
import { Effect, Schema } from "effect";

import {
  createExecutor,
  makeTestConfig,
  memoryPlugin,
  tool,
  FormElicitation,
  UrlElicitation,
  ElicitationResponse,
  type MemoryToolContext,
} from "./index";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const GetItemInput = Schema.Struct({ itemId: Schema.Number });
const Item = Schema.Struct({ id: Schema.Number, name: Schema.String });
const EmptyInput = Schema.Struct({});
const LoginResult = Schema.Struct({ user: Schema.String, status: Schema.String });
const ConnectResult = Schema.Struct({ connected: Schema.Boolean, code: Schema.String });

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SDK Executor", () => {
  it.effect("creates an executor with no plugins", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(makeTestConfig());
      expect(executor.scope.name).toBe("test");
      expect(yield* executor.tools.list()).toHaveLength(0);
    }),
  );

  it.effect("memory plugin registers tools and they are discoverable", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({
              namespace: "inventory",
              tools: [
                tool({
                  name: "listItems",
                  description: "List all items",
                  inputSchema: EmptyInput,
                  outputSchema: Schema.Array(Item),
                  handler: () => [
                    { id: 1, name: "Widget" },
                    { id: 2, name: "Gadget" },
                  ],
                }),
                tool({
                  name: "getItem",
                  description: "Get an item by ID",
                  inputSchema: GetItemInput,
                  outputSchema: Item,
                  handler: ({ itemId }: { itemId: number }) => ({ id: itemId, name: "Widget" }),
                }),
              ],
            }),
          ] as const,
        }),
      );

      const tools = yield* executor.tools.list();
      expect(tools).toHaveLength(2);
      expect(tools.map((t) => t.name)).toContain("listItems");
      expect(tools.map((t) => t.name)).toContain("getItem");
    }),
  );

  it.effect("invokes a tool with typed args", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({
              namespace: "inventory",
              tools: [
                tool({
                  name: "getItem",
                  inputSchema: GetItemInput,
                  outputSchema: Item,
                  handler: ({ itemId }: { itemId: number }) => ({ id: itemId, name: "Widget" }),
                }),
              ],
            }),
          ] as const,
        }),
      );

      const result = yield* executor.tools.invoke("inventory.getItem", { itemId: 42 });
      expect(result.data).toEqual({ id: 42, name: "Widget" });
      expect(result.error).toBeNull();
    }),
  );

  it.effect("validates input against schema", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({
              namespace: "inventory",
              tools: [
                tool({
                  name: "getItem",
                  inputSchema: GetItemInput,
                  handler: ({ itemId }: { itemId: number }) => ({ id: itemId }),
                }),
              ],
            }),
          ] as const,
        }),
      );

      const result = yield* Effect.either(
        executor.tools.invoke("inventory.getItem", { itemId: "not-a-number" }),
      );
      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect((result.left as { _tag: string })._tag).toBe("ToolInvocationError");
      }
    }),
  );

  it.effect("tool invocation fails for unknown tool", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(makeTestConfig());
      const result = yield* Effect.either(executor.tools.invoke("nonexistent", {}));
      expect(result._tag).toBe("Left");
    }),
  );

  it.effect("filters tools by query", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({
              namespace: "store",
              tools: [
                tool({
                  name: "listItems",
                  description: "List all items",
                  inputSchema: EmptyInput,
                  handler: () => [],
                }),
                tool({
                  name: "createOrder",
                  description: "Create an order",
                  inputSchema: EmptyInput,
                  handler: () => ({}),
                }),
              ],
            }),
          ] as const,
        }),
      );

      const itemTools = yield* executor.tools.list({ query: "item" });
      expect(itemTools).toHaveLength(1);
      expect(itemTools[0]!.name).toBe("listItems");

      const orderTools = yield* executor.tools.list({ query: "order" });
      expect(orderTools).toHaveLength(1);
      expect(orderTools[0]!.name).toBe("createOrder");
    }),
  );

  it.effect("plugin extension is typed and accessible", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({ namespace: "runtime", tools: [] }),
          ] as const,
        }),
      );

      expect(executor.memory).toBeDefined();
      expect(typeof executor.memory.addTools).toBe("function");

      yield* executor.memory.addTools([
        tool({
          name: "dynamicTool",
          description: "Added at runtime",
          inputSchema: EmptyInput,
          handler: () => "dynamic result",
        }),
      ]);

      const tools = yield* executor.tools.list();
      expect(tools).toHaveLength(1);
      expect(tools[0]!.name).toBe("dynamicTool");

      const result = yield* executor.tools.invoke("runtime.dynamicTool", {});
      expect(result.data).toBe("dynamic result");
    }),
  );

  it.effect("stores and lists secrets", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(makeTestConfig());

      const secret = yield* executor.secrets.store({
        name: "API Key",
        value: "sk_test_123",
        purpose: "auth",
      });
      expect(secret.name).toBe("API Key");

      const listed = yield* executor.secrets.list();
      expect(listed).toHaveLength(1);
      expect(listed[0]!.name).toBe("API Key");
    }),
  );

  it.effect("form elicitation: tool collects user input mid-invocation", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({
              namespace: "auth",
              tools: [
                tool({
                  name: "login",
                  inputSchema: EmptyInput,
                  outputSchema: LoginResult,
                  handler: (_, ctx: MemoryToolContext) =>
                    Effect.gen(function* () {
                      const creds = yield* ctx.elicit(
                        new FormElicitation({
                          message: "Enter credentials",
                          requestedSchema: {
                            type: "object",
                            properties: {
                              username: { type: "string" },
                              password: { type: "string" },
                            },
                          },
                        }),
                      );
                      return {
                        user: creds.username as string,
                        status: "logged_in",
                      };
                    }),
                }),
              ],
            }),
          ] as const,
        }),
      );

      const result = yield* executor.tools.invoke("auth.login", {}, {
        onElicitation: () =>
          Effect.succeed(
            new ElicitationResponse({
              action: "accept",
              content: { username: "alice", password: "secret" },
            }),
          ),
      });

      expect(result.data).toEqual({ user: "alice", status: "logged_in" });
    }),
  );

  it.effect("elicitation declined returns error", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({
              namespace: "auth",
              tools: [
                tool({
                  name: "login",
                  inputSchema: EmptyInput,
                  handler: (_, ctx: MemoryToolContext) =>
                    ctx.elicit(
                      new FormElicitation({
                        message: "Enter credentials",
                        requestedSchema: {},
                      }),
                    ),
                }),
              ],
            }),
          ] as const,
        }),
      );

      const result = yield* Effect.either(
        executor.tools.invoke("auth.login", {}, {
          onElicitation: () =>
            Effect.succeed(new ElicitationResponse({ action: "decline" })),
        }),
      );

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect((result.left as { _tag: string })._tag).toBe("ElicitationDeclinedError");
      }
    }),
  );

  it.effect("elicitation with no handler auto-declines", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({
              namespace: "auth",
              tools: [
                tool({
                  name: "login",
                  inputSchema: EmptyInput,
                  handler: (_, ctx: MemoryToolContext) =>
                    ctx.elicit(
                      new FormElicitation({
                        message: "Need input",
                        requestedSchema: {},
                      }),
                    ),
                }),
              ],
            }),
          ] as const,
        }),
      );

      const result = yield* Effect.either(executor.tools.invoke("auth.login", {}));
      expect(result._tag).toBe("Left");
    }),
  );

  it.effect("url elicitation: tool requests URL visit", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({
              namespace: "oauth",
              tools: [
                tool({
                  name: "connect",
                  inputSchema: EmptyInput,
                  outputSchema: ConnectResult,
                  handler: (_, ctx: MemoryToolContext) =>
                    Effect.gen(function* () {
                      const result = yield* ctx.elicit(
                        new UrlElicitation({
                          message: "Please authorize the app",
                          url: "https://oauth.example.com/authorize?state=abc",
                          elicitationId: "oauth-abc",
                        }),
                      );
                      return { connected: true, code: result.code as string };
                    }),
                }),
              ],
            }),
          ] as const,
        }),
      );

      const result = yield* executor.tools.invoke("oauth.connect", {}, {
        onElicitation: (ctx) => {
          expect(ctx.request._tag).toBe("UrlElicitation");
          return Effect.succeed(
            new ElicitationResponse({
              action: "accept",
              content: { code: "auth-code-123" },
            }),
          );
        },
      });

      expect(result.data).toEqual({ connected: true, code: "auth-code-123" });
    }),
  );

  it.effect("close cleans up plugin resources", () =>
    Effect.gen(function* () {
      const executor = yield* createExecutor(
        makeTestConfig({
          plugins: [
            memoryPlugin({
              namespace: "temp",
              tools: [
                tool({
                  name: "ephemeral",
                  inputSchema: EmptyInput,
                  handler: () => "here",
                }),
              ],
            }),
          ] as const,
        }),
      );

      expect(yield* executor.tools.list()).toHaveLength(1);
      yield* executor.close();
      expect(yield* executor.tools.list()).toHaveLength(0);
    }),
  );
});
