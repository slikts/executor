import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { createExecutor as createPromiseExecutor } from "@executor-js/sdk/promise";
import { mcpPlugin as makeMcpPlugin } from "@executor-js/plugin-mcp/promise";
import { createExecutionEngine as createPromiseExecutionEngine } from "@executor-js/execution/promise";
import { makeQuickJsExecutor as makeQuickJsCodeExecutor } from "@executor-js/runtime-quickjs";
import { createExecutorMcpServer as createPromiseExecutorMcpServer } from "@executor-js/host-mcp/tool-server-promise";

export interface PromiseCredentialProvider {
  readonly key: string;
  readonly writable: boolean;
  readonly get: (id: string) => Promise<string | null>;
  readonly has?: (id: string) => Promise<boolean>;
  readonly set?: (id: string, value: string) => Promise<void>;
  readonly delete?: (id: string) => Promise<void>;
  readonly list?: () => Promise<readonly { readonly id: string; readonly name: string }[]>;
}

export interface Executor {
  readonly mcp: {
    readonly addServer: (input: unknown) => Promise<unknown>;
  };
  readonly connections: {
    readonly create: (input: {
      readonly owner: "org" | "user";
      readonly name: string;
      readonly integration: string;
      readonly template: string;
      readonly values: Readonly<Record<string, string>>;
    }) => Promise<unknown>;
  };
  readonly close: () => Promise<void>;
}

export interface ExecutorConfig {
  readonly tenant?: string;
  readonly subject?: string;
  readonly plugins?: readonly unknown[];
  /** Enable the built-in core-tools plugin (agent-facing static tools). */
  readonly coreTools?: {
    readonly webBaseUrl?: string;
    readonly orgSlug?: string;
    readonly includeProviders?: boolean;
  };
  readonly providers?: readonly PromiseCredentialProvider[];
  readonly onElicitation: "accept-all";
}

export interface ExecutionEngine {
  readonly execute: (code: string, options: unknown) => Promise<unknown>;
  readonly executeWithPause: (code: string, options?: unknown) => Promise<unknown>;
  readonly resume: (executionId: string, response: unknown) => Promise<unknown>;
  readonly getPausedExecution: (executionId: string) => Promise<unknown>;
  readonly pausedExecutionCount: () => Promise<number>;
  readonly hasPausedExecutions: () => Promise<boolean>;
  readonly getDescription: () => Promise<string>;
}

export interface ExecutionEngineConfig {
  readonly executor: Executor;
  readonly codeExecutor: unknown;
}

export interface ExecutorMcpServerConfig {
  readonly engine: ExecutionEngine;
  readonly description?: string;
  readonly debug?: boolean;
  readonly elicitationMode?: { readonly mode: "model" } | { readonly mode: "native" };
  readonly additionalSkills?: () => readonly unknown[] | Promise<readonly unknown[]>;
}

export const createExecutor = (config: ExecutorConfig): Promise<Executor> =>
  createPromiseExecutor(
    config as Parameters<typeof createPromiseExecutor>[0],
  ) as unknown as Promise<Executor>;

export const mcpPlugin = (config: { readonly dangerouslyAllowStdioMCP?: boolean }): unknown =>
  makeMcpPlugin(config);

export const makeQuickJsExecutor = (): unknown => makeQuickJsCodeExecutor();

export const createExecutionEngine = (config: ExecutionEngineConfig): ExecutionEngine =>
  createPromiseExecutionEngine(
    config as unknown as Parameters<typeof createPromiseExecutionEngine>[0],
  ) as ExecutionEngine;

export const createExecutorMcpServer = (config: ExecutorMcpServerConfig): Promise<McpServer> =>
  createPromiseExecutorMcpServer(config as Parameters<typeof createPromiseExecutorMcpServer>[0]);

