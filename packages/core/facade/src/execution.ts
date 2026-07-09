// @slikts/executor/execution — execution engine and code executor.

export {
  createExecutionEngine,
  type ExecutionEngine,
  type ExecutionEngineConfig,
  type ExecutionResult,
  type PausedExecution,
  type ResumeResponse,
} from "@executor-js/execution";

export { makeQuickJsExecutor } from "@executor-js/runtime-quickjs";
