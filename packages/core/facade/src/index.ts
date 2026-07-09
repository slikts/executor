// @slikts/executor — facade for external SDK consumption.
// Re-exports the core executor SDK surface.

export {
  createExecutor,
  collectTables,
  defineExecutorConfig,
  Tenant,
  Subject,
  type Executor,
  type ExecutorConfig,
  type AnyPlugin,
  type Plugin,
  type PluginSpec,
} from "@executor-js/sdk";
