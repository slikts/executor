import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createServerHandlers } from "@executor/server";

const handlersPromise = createServerHandlers();

// Build a Web Request from a Node IncomingMessage
const toWebRequest = async (
  req: import("http").IncomingMessage,
): Promise<Request> => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }

  const host = req.headers.host ?? "localhost";
  const url = `http://${host}${req.url}`;

  return new Request(url, {
    method: req.method,
    headers,
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? (await new Promise<Buffer>((resolve) => {
            const chunks: Buffer[] = [];
            req.on("data", (c: Buffer) => chunks.push(c));
            req.on("end", () => resolve(Buffer.concat(chunks)));
          }) as unknown as BodyInit)
        : undefined,
    duplex: "half" as const,
  });
};

// Pipe a Web Response back to a Node ServerResponse, streaming if needed
const sendWebResponse = async (
  webRes: Response,
  nodeRes: import("http").ServerResponse,
) => {
  nodeRes.statusCode = webRes.status;
  webRes.headers.forEach((value, key) => nodeRes.setHeader(key, value));

  if (!webRes.body) {
    nodeRes.end();
    return;
  }

  const reader = webRes.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      nodeRes.write(value);
    }
  } finally {
    nodeRes.end();
  }
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "executor-api",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? "/";

          const isApi =
            url.startsWith("/v1/") ||
            url.startsWith("/docs") ||
            url === "/openapi.json";
          const isMcp = url.startsWith("/mcp");

          if (!isApi && !isMcp) return next();

          const handlers = await handlersPromise;
          const request = await toWebRequest(req);

          const response = isMcp
            ? await handlers.mcp.handleRequest(request)
            : await handlers.api.handler(request);

          await sendWebResponse(response, res);
        });
      },
    },
  ],
});
