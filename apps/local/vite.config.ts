import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const rootPackage = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
) as { version: string; homepage?: string; repository?: string | { url?: string } };

const cliPackage = JSON.parse(
  readFileSync(new URL("../cli/package.json", import.meta.url), "utf8"),
) as { version?: string };

const repositoryUrl =
  typeof rootPackage.repository === "string"
    ? rootPackage.repository
    : rootPackage.repository?.url;

const EXECUTOR_VERSION = cliPackage.version ?? rootPackage.version;
const EXECUTOR_GITHUB_URL = (rootPackage.homepage ?? repositoryUrl ?? "https://github.com/RhysSullivan/executor")
  .replace(/^git\+/, "")
  .replace(/\.git$/, "");

/**
 * Vite plugin that forwards API and MCP requests to the Effect handlers
 * during development — replaces the TanStack Start request middleware.
 */
function executorApiPlugin(): Plugin {
  let handlers: import("./src/server/main").ServerHandlers | null = null;

  return {
    name: "executor-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
          const rawUrl = req.url ?? "/";
          const isApi = rawUrl.startsWith("/api/") || rawUrl === "/api";
          const isMcp = rawUrl.startsWith("/mcp");

          if (!isApi && !isMcp) return next();

          // Strip /api prefix — Effect handlers define routes without it
          const url = isApi ? (rawUrl.slice("/api".length) || "/") : rawUrl;

          try {
            if (!handlers) {
              const { getServerHandlers } = await import("./src/server/main");
              handlers = await getServerHandlers();
            }

            // Convert Node request → Web Request
            const origin = `http://${req.headers.host ?? "localhost"}`;
            const headers = new Headers();
            for (const [key, value] of Object.entries(req.headers)) {
              if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
            }

            const hasBody = req.method !== "GET" && req.method !== "HEAD";
            const webRequest = new Request(new URL(url, origin), {
              method: req.method,
              headers,
              body: hasBody ? (req as unknown as BodyInit) : undefined,
              duplex: hasBody ? "half" : undefined,
            } as RequestInit);

            const response = isMcp
              ? await handlers.mcp.handleRequest(webRequest)
              : await handlers.api.handler(webRequest);

            res.statusCode = response.status;
            response.headers.forEach((v, k) => res.setHeader(k, v));

            if (response.body) {
              const reader = response.body.getReader();
              const pump = async () => {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  res.write(value);
                }
                res.end();
              };
              await pump();
            } else {
              res.end();
            }
          } catch (err) {
            console.error("[executor-api]", err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.end("Internal Server Error");
            }
          }
        });
    },
  };
}

export default defineConfig({
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(EXECUTOR_VERSION),
    "import.meta.env.VITE_GITHUB_URL": JSON.stringify(EXECUTOR_GITHUB_URL),
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    tsconfigPaths: true,
  },
  server: {
    port: parseInt(process.env.PORT ?? "5173", 10),
    host: "127.0.0.1",
  },
  ssr: {
    external: true,
  },
  optimizeDeps: {
    rolldownOptions: {
      external: [/^@napi-rs\//],
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      spa: { enabled: true },
    }),
    ...react(),
    executorApiPlugin(),
  ],
});
