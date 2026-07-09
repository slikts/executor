import "./chunk-4VNS5WPM.js";

// ../../plugins/mcp/src/sdk/stdio-connector.ts
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
var createStdioTransport = (config) => new StdioClientTransport({
  command: config.command,
  args: config.args ? [...config.args] : void 0,
  env: config.env ? { ...process.env, ...config.env } : void 0,
  cwd: config.cwd
});
export {
  createStdioTransport
};
