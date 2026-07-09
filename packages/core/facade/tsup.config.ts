import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    mcp: "src/mcp.ts",
    execution: "src/execution.ts",
    config: "src/config.ts",
    "plugin-mcp": "src/plugin-mcp.ts",
  },
  format: ["esm"],
  dts: { resolve: true },
  sourcemap: false,
  clean: true,
  // Bundle everything including effect (version-specific unstable subpaths)
  external: [/^@modelcontextprotocol\//, /^quickjs-emscripten/, /^@jitl\//],
  noExternal: [/^@executor-js\//, /^@cfworker\//, /^zod/, /^effect/, /^@effect\//],
});
