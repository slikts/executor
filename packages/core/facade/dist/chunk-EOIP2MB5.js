import {
  toJSONSchema
} from "./chunk-NUUHIX6O.js";
import {
  AuthTemplateSlug,
  ConnectionName,
  ElicitationId,
  FetchHttpClient_exports,
  FormElicitation,
  HttpClientRequest_exports,
  HttpClient_exports,
  IntegrationAlreadyExistsError,
  IntegrationSlug,
  ToolName,
  ToolResult,
  UrlElicitation,
  authToolFailure,
  classifyHttpStatus,
  definePlugin,
  mergeAuthTemplates,
  tool
} from "./chunk-PWAKBQOM.js";
import {
  Cause_exports,
  Data_exports,
  Duration_exports,
  Effect_exports,
  Exit_exports,
  Option_exports,
  Predicate_exports,
  Result_exports,
  Schema_exports,
  Stream_exports
} from "./chunk-XRXVQF6Q.js";

// ../../plugins/mcp/src/sdk/plugin.ts
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";

// ../sdk/src/http-auth/auth-method.ts
var TOKEN_VARIABLE = "token";
var AuthCarrier = Schema_exports.Literals(["header", "query"]);
var AuthPlacement = Schema_exports.Struct({
  carrier: AuthCarrier,
  /** Header name (e.g. `Authorization`) or query-param name (e.g. `token`). */
  name: Schema_exports.String,
  /** Literal prepended to the credential value, e.g. `Bearer `. */
  prefix: Schema_exports.optional(Schema_exports.String),
  /** The credential input this placement renders from. Absent ⇒ `token`. */
  variable: Schema_exports.optional(Schema_exports.String),
  /** Render this exact value instead of a credential. */
  literal: Schema_exports.optional(Schema_exports.String)
});
var ApiKeyAuthMethod = Schema_exports.Struct({
  slug: Schema_exports.String,
  kind: Schema_exports.Literal("apikey"),
  /** Display label; derived from the first placement when absent. */
  label: Schema_exports.optional(Schema_exports.String),
  placements: Schema_exports.Array(AuthPlacement)
});
var NoneAuthMethod = Schema_exports.Struct({
  slug: Schema_exports.String,
  kind: Schema_exports.Literal("none")
});
var renderPlacementValue = (placement, values) => {
  if (placement.literal !== void 0) return placement.literal;
  const value = values[placement.variable ?? TOKEN_VARIABLE];
  if (value == null) return null;
  return placement.prefix ? `${placement.prefix}${value}` : value;
};
var renderAuthPlacements = (placements, values) => {
  const headers = {};
  const queryParams = {};
  for (const placement of placements) {
    const rendered = renderPlacementValue(placement, values);
    if (rendered === null) continue;
    if (placement.carrier === "header") headers[placement.name] = rendered;
    else queryParams[placement.name] = rendered;
  }
  return { headers, queryParams };
};
var requiredPlacementVariables = (placements) => {
  const names = /* @__PURE__ */ new Set();
  for (const placement of placements) {
    if (placement.literal !== void 0) continue;
    names.add(placement.variable ?? TOKEN_VARIABLE);
  }
  return [...names];
};
var normalizeAuthMethodSlugs = (methods, defaultSlugFor) => {
  const taken = /* @__PURE__ */ new Set();
  return methods.map((method) => {
    const requested = method.slug?.trim() || defaultSlugFor(method);
    let slug = requested;
    for (let n = 2; taken.has(slug); n += 1) slug = `${requested}_${n}`;
    taken.add(slug);
    return { ...method, slug };
  });
};
var apiKeyMethodLabel = (method) => {
  if (method.label !== void 0 && method.label.trim().length > 0) return method.label;
  const first = method.placements.find(
    (placement) => placement.name.trim().length > 0
  );
  return first ? `API key (${first.name})` : `API key (${method.slug})`;
};
var describePlacement = (placement) => ({
  carrier: placement.carrier,
  name: placement.name,
  prefix: placement.prefix ?? "",
  ...placement.variable !== void 0 ? { variable: placement.variable } : {},
  ...placement.literal !== void 0 ? { literal: placement.literal } : {}
});
var describeApiKeyAuthMethod = (method) => ({
  id: method.slug,
  label: apiKeyMethodLabel(method),
  kind: "apikey",
  template: method.slug,
  placements: method.placements.map(describePlacement)
});
var describeNoneAuthMethod = (slug) => ({
  id: slug,
  label: "No authentication",
  kind: "none",
  template: slug
});

// ../sdk/src/http-auth/authoring.ts
var VariablePart = Schema_exports.Struct({
  type: Schema_exports.Literal("variable"),
  name: Schema_exports.String
});
var isVariablePart = (part) => typeof part !== "string";
var AuthTemplateValue = Schema_exports.Union([
  Schema_exports.String,
  Schema_exports.Array(Schema_exports.Union([Schema_exports.String, VariablePart])).check(
    Schema_exports.makeFilter((parts) => {
      const variableIndexes = parts.flatMap((part, index) => isVariablePart(part) ? [index] : []);
      if (variableIndexes.length > 1 || variableIndexes.length === 1 && variableIndexes[0] !== parts.length - 1) {
        return "a template value renders at most ONE variable, as the FINAL part \u2014 split extra variables/suffixes into separate header or query entries";
      }
      return void 0;
    })
  )
]);
var ApiKeyAuthTemplate = Schema_exports.Struct({
  slug: Schema_exports.optional(Schema_exports.String),
  type: Schema_exports.Literal("apiKey"),
  label: Schema_exports.optional(Schema_exports.String),
  headers: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, AuthTemplateValue)),
  queryParams: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, AuthTemplateValue))
});
var placementFromValue = (carrier, name, value) => {
  if (typeof value === "string") return { carrier, name, literal: value };
  const variablePart = value.find(isVariablePart);
  if (variablePart === void 0) {
    return { carrier, name, literal: value.filter((p) => typeof p === "string").join("") };
  }
  const prefix = value.filter((part) => typeof part === "string").join("");
  return {
    carrier,
    name,
    ...prefix ? { prefix } : {},
    ...variablePart.name !== TOKEN_VARIABLE ? { variable: variablePart.name } : {}
  };
};
var apiKeyMethodFromAuthTemplate = (template) => {
  const placements = [];
  for (const [name, value] of Object.entries(template.headers ?? {})) {
    placements.push(placementFromValue("header", name, value));
  }
  for (const [name, value] of Object.entries(template.queryParams ?? {})) {
    placements.push(placementFromValue("query", name, value));
  }
  return {
    ...template.slug !== void 0 ? { slug: template.slug } : {},
    kind: "apikey",
    ...template.label !== void 0 ? { label: template.label } : {},
    placements
  };
};
var isApiKeyAuthTemplate = (input) => input.type === "apiKey";

// ../sdk/src/http-auth/legacy.ts
var LegacyVariablePart = Schema_exports.Struct({
  type: Schema_exports.Literal("variable"),
  name: Schema_exports.String
});
var LegacyTemplateValue = Schema_exports.Union([
  Schema_exports.String,
  Schema_exports.Array(Schema_exports.Union([Schema_exports.String, LegacyVariablePart]))
]);
var LegacyApiKeyTemplate = Schema_exports.Struct({
  slug: Schema_exports.String,
  type: Schema_exports.Literal("apiKey"),
  headers: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, LegacyTemplateValue)),
  queryParams: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, LegacyTemplateValue))
});
var decodeLegacyApiKeyTemplate = Schema_exports.decodeUnknownOption(LegacyApiKeyTemplate);

// ../../plugins/mcp/src/sdk/connection.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { CfWorkerJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/cfworker";

// ../../plugins/mcp/src/sdk/errors.ts
var McpConnectionError = class extends Schema_exports.TaggedErrorClass()(
  "McpConnectionError",
  {
    transport: Schema_exports.String,
    message: Schema_exports.String,
    /** HTTP status the handshake observed (e.g. 401 on an auth wall), when the
     *  transport surfaced one. Structural, so the liveness classifier and the
     *  auto-transport fallback never string-match the message. */
    httpStatus: Schema_exports.optional(Schema_exports.Number)
  },
  { httpApiStatus: 400 }
) {
};
var McpToolDiscoveryError = class extends Schema_exports.TaggedErrorClass()(
  "McpToolDiscoveryError",
  {
    stage: Schema_exports.Literals(["connect", "list_tools"]),
    message: Schema_exports.String,
    /** HTTP status from the underlying connect failure, when known. */
    httpStatus: Schema_exports.optional(Schema_exports.Number)
  },
  { httpApiStatus: 400 }
) {
};
var McpInvocationError = class extends Data_exports.TaggedError("McpInvocationError") {
};
var McpOAuthReauthorizationRequired = class extends Data_exports.TaggedError(
  "McpOAuthReauthorizationRequired"
) {
};
var McpOAuthError = class extends Schema_exports.TaggedErrorClass()(
  "McpOAuthError",
  {
    message: Schema_exports.String
  },
  { httpApiStatus: 400 }
) {
};

// ../../plugins/mcp/src/sdk/http-status.ts
import { StreamableHTTPError } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
var SsePostErrorCause = Schema_exports.Struct({ message: Schema_exports.String });
var decodeSsePostErrorCause = Schema_exports.decodeUnknownOption(SsePostErrorCause);
var statusFromSsePostError = (cause) => Option_exports.match(decodeSsePostErrorCause(cause), {
  onNone: () => void 0,
  onSome: ({ message }) => {
    const match = /^Error POSTing to endpoint \(HTTP ([1-5][0-9]{2})\):/.exec(message);
    if (!match) return void 0;
    return Number(match[1]);
  }
});
var statusFromStreamableHttpError = (cause) => {
  if (!(cause instanceof StreamableHTTPError)) return void 0;
  const code = cause.code;
  return code !== void 0 && code >= 100 && code <= 599 ? code : void 0;
};
var httpStatusFromCause = (cause) => statusFromStreamableHttpError(cause) ?? statusFromSsePostError(cause);

// ../../plugins/mcp/src/sdk/connection.ts
var buildEndpointUrl = (endpoint, queryParams) => {
  const url = new URL(endpoint);
  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.set(key, value);
  }
  return url;
};
var HTTP_METHODS = /* @__PURE__ */ new Set([
  "DELETE",
  "GET",
  "HEAD",
  "OPTIONS",
  "PATCH",
  "POST",
  "PUT"
]);
var httpMethodFrom = (method) => {
  const normalized = (method ?? "GET").toUpperCase();
  return HTTP_METHODS.has(normalized) ? normalized : "POST";
};
var headersFrom = (headers) => headers ? new Headers(headers) : new Headers();
var recordFromHeaders = (headers) => Object.fromEntries(headers.entries());
var applyBody = async (request, headers, body) => {
  if (body == null) return request;
  const contentType = headers.get("content-type") ?? void 0;
  if (typeof body === "string") return HttpClientRequest_exports.bodyText(request, body, contentType);
  if (body instanceof URLSearchParams) {
    return HttpClientRequest_exports.bodyText(
      request,
      body.toString(),
      contentType ?? "application/x-www-form-urlencoded;charset=UTF-8"
    );
  }
  if (body instanceof Uint8Array)
    return HttpClientRequest_exports.bodyUint8Array(request, body, contentType);
  if (body instanceof ArrayBuffer) {
    return HttpClientRequest_exports.bodyUint8Array(request, new Uint8Array(body), contentType);
  }
  const bytes = new Uint8Array(await new Response(body).arrayBuffer());
  return HttpClientRequest_exports.bodyUint8Array(request, bytes, contentType);
};
var abortError = (signal) => {
  if (signal.reason !== void 0) return signal.reason;
  const error = new Error("The operation was aborted");
  error.name = "AbortError";
  return error;
};
var fetchFromHttpClientLayer = (httpClientLayer) => {
  const execute = async (url, init) => {
    const headers = headersFrom(init?.headers);
    const requestWithoutBody = HttpClientRequest_exports.make(httpMethodFrom(init?.method))(url, {
      headers: recordFromHeaders(headers)
    });
    const request = await applyBody(requestWithoutBody, headers, init?.body);
    const effect = Effect_exports.gen(function* () {
      const client = yield* HttpClient_exports.HttpClient;
      const response = yield* client.execute(request);
      const responseHeaders = new Headers();
      for (const [key, value] of Object.entries(response.headers)) {
        if (value !== void 0) responseHeaders.set(key, value);
      }
      const body = response.status === 204 || response.status === 205 || response.status === 304 ? null : Stream_exports.toReadableStream(response.stream);
      return new Response(body, {
        status: response.status,
        headers: responseHeaders
      });
    }).pipe(Effect_exports.provide(httpClientLayer));
    const promise = Effect_exports.runPromise(effect);
    if (!init?.signal) return promise;
    if (init.signal.aborted) return Promise.reject(abortError(init.signal));
    const aborted = new Promise((_, reject) => {
      init.signal?.addEventListener("abort", () => reject(abortError(init.signal)), {
        once: true
      });
    });
    return Promise.race([promise, aborted]);
  };
  return execute;
};
var createClient = () => new Client(
  { name: "executor-mcp", version: "0.1.0" },
  {
    capabilities: { elicitation: { form: {}, url: {} } },
    jsonSchemaValidator: new CfWorkerJsonSchemaValidator()
  }
);
var connectionFromClient = (client) => ({
  client,
  close: () => client.close()
});
var connectionFailure = (transport, message, cause) => {
  if (Predicate_exports.isTagged(cause, "McpOAuthReauthorizationRequired")) {
    return new McpOAuthReauthorizationRequired({ message: "MCP OAuth re-authorization required" });
  }
  const status = httpStatusFromCause(cause);
  return new McpConnectionError({
    transport,
    message: status === void 0 ? message : `${message} (HTTP ${status})`,
    ...status === void 0 ? {} : { httpStatus: status }
  });
};
var connectClient = (input) => Effect_exports.gen(function* () {
  const client = createClient();
  const transportInstance = input.createTransport();
  yield* Effect_exports.tryPromise({
    try: () => client.connect(transportInstance),
    catch: (cause) => connectionFailure(input.transport, `Failed connecting via ${input.transport}`, cause)
  }).pipe(
    Effect_exports.withSpan("plugin.mcp.connection.handshake", {
      attributes: { "plugin.mcp.transport": input.transport }
    })
  );
  return connectionFromClient(client);
});
var createMcpConnector = (input) => {
  if (input.transport === "stdio") {
    const command = input.command.trim();
    if (!command) {
      return Effect_exports.fail(
        new McpConnectionError({
          transport: "stdio",
          message: "MCP stdio transport requires a command"
        })
      );
    }
    return Effect_exports.gen(function* () {
      const { createStdioTransport } = yield* Effect_exports.tryPromise({
        try: () => import("./stdio-connector-AMG3IGMD.js"),
        catch: () => new McpConnectionError({
          transport: "stdio",
          message: "Failed to load stdio transport module"
        })
      });
      return yield* connectClient({
        transport: "stdio",
        createTransport: () => createStdioTransport({
          command,
          args: input.args,
          env: input.env,
          cwd: input.cwd?.trim().length ? input.cwd.trim() : void 0
        })
      });
    });
  }
  const headers = input.headers ?? {};
  const remoteTransport = input.remoteTransport ?? "auto";
  const requestInit = Object.keys(headers).length > 0 ? { headers } : void 0;
  const fetch = input.httpClientLayer ? fetchFromHttpClientLayer(input.httpClientLayer) : void 0;
  const endpoint = buildEndpointUrl(input.endpoint, input.queryParams ?? {});
  const connectStreamableHttp = connectClient({
    transport: "streamable-http",
    createTransport: () => new StreamableHTTPClientTransport(endpoint, {
      requestInit,
      authProvider: input.authProvider,
      fetch
    })
  });
  const connectSse = connectClient({
    transport: "sse",
    createTransport: () => new SSEClientTransport(endpoint, {
      requestInit,
      authProvider: input.authProvider,
      fetch
    })
  });
  if (remoteTransport === "streamable-http") return connectStreamableHttp;
  if (remoteTransport === "sse") return connectSse;
  return connectStreamableHttp.pipe(
    Effect_exports.catch((error) => {
      if (Predicate_exports.isTagged(error, "McpOAuthReauthorizationRequired")) return Effect_exports.fail(error);
      if (error.httpStatus === 401 || error.httpStatus === 403) return Effect_exports.fail(error);
      return connectSse;
    })
  );
};

// ../../plugins/mcp/src/sdk/types.ts
var McpRemoteTransport = Schema_exports.Literals(["streamable-http", "sse", "auto"]);
var McpTransport = Schema_exports.Literals(["streamable-http", "sse", "stdio", "auto"]);
var McpOAuthMethod = Schema_exports.Struct({
  slug: Schema_exports.String,
  kind: Schema_exports.Literal("oauth2")
});
var McpStdioEnvMethod = Schema_exports.Struct({
  slug: Schema_exports.String,
  kind: Schema_exports.Literal("stdio_env"),
  vars: Schema_exports.Array(Schema_exports.String)
});
var McpAuthMethod = Schema_exports.Union([
  NoneAuthMethod,
  ApiKeyAuthMethod,
  McpOAuthMethod,
  McpStdioEnvMethod
]);
var McpAuthShorthand = Schema_exports.Union([
  Schema_exports.Struct({ kind: Schema_exports.Literal("none") }),
  Schema_exports.Struct({
    kind: Schema_exports.Literal("header"),
    headerName: Schema_exports.String,
    prefix: Schema_exports.optional(Schema_exports.String)
  }),
  Schema_exports.Struct({ kind: Schema_exports.Literal("oauth2") })
]);
var mcpAuthMethodFromShorthand = (auth) => {
  if (auth.kind === "header") {
    return {
      slug: "header",
      kind: "apikey",
      placements: [
        {
          carrier: "header",
          name: auth.headerName,
          ...auth.prefix !== void 0 ? { prefix: auth.prefix } : {}
        }
      ]
    };
  }
  return { slug: auth.kind, kind: auth.kind };
};
var McpAuthMethodInput = Schema_exports.Union([
  Schema_exports.Struct({ slug: Schema_exports.optional(Schema_exports.String), kind: Schema_exports.Literal("none") }),
  Schema_exports.Struct({ slug: Schema_exports.optional(Schema_exports.String), kind: Schema_exports.Literal("oauth2") }),
  // Credential methods are authored request-shaped — the ONE apikey input
  // dialect: `{ type: "apiKey", headers: { Authorization: ["Bearer ",
  // variable("token")] }, queryParams: { … } }`. Stored configs and the
  // catalog read as canonical placements; `apiKeyAuthTemplateFromMethod`
  // serializes them back for read-modify-write flows.
  ApiKeyAuthTemplate
]);
var defaultMcpAuthSlug = (method) => {
  if (method.kind !== "apikey") return method.kind;
  if (method.placements.length === 1) {
    return method.placements[0].carrier === "header" ? "header" : "query";
  }
  return "apikey";
};
var expandMcpAuthMethodInputs = (methods) => methods.map(
  (method) => isApiKeyAuthTemplate(method) ? apiKeyMethodFromAuthTemplate(method) : method
);
var normalizeMcpAuthMethods = (methods) => normalizeAuthMethodSlugs(
  expandMcpAuthMethodInputs(methods),
  defaultMcpAuthSlug
);
var StringMap = Schema_exports.Record(Schema_exports.String, Schema_exports.String);
var McpRemoteIntegrationConfig = Schema_exports.Struct({
  transport: Schema_exports.Literal("remote"),
  /** The MCP server endpoint URL */
  endpoint: Schema_exports.String,
  /** Transport preference for this remote server */
  remoteTransport: McpRemoteTransport.pipe(
    Schema_exports.optionalKey,
    Schema_exports.withConstructorDefault(Effect_exports.succeed("auto"))
  ),
  /** Static query params appended to the endpoint URL (non-credential) */
  queryParams: Schema_exports.optional(StringMap),
  /** Static headers sent on every request (non-credential) */
  headers: Schema_exports.optional(StringMap),
  /** Declared auth methods — how a connection's values are rendered onto
   *  requests. A connection's `template` picks one by slug. */
  authenticationTemplate: Schema_exports.Array(McpAuthMethod)
});
var McpStdioIntegrationConfig = Schema_exports.Struct({
  transport: Schema_exports.Literal("stdio"),
  /** The command to run */
  command: Schema_exports.String,
  /** Arguments to the command */
  args: Schema_exports.optional(Schema_exports.Array(Schema_exports.String)),
  /** Static, non-credential environment variables injected verbatim into the
   *  subprocess. Secret env (API keys / tokens) is NOT stored here — it is
   *  declared as a `stdio_env` method in `authenticationTemplate` and its
   *  values live on the connection. Optional + legacy: pre-revamp stdio
   *  integrations stored their (then-plaintext) env here, so it stays
   *  decodable. */
  env: Schema_exports.optional(StringMap),
  /** Working directory */
  cwd: Schema_exports.optional(Schema_exports.String),
  /** Declared auth methods — a single `stdio_env` method naming the secret env
   *  vars, or `none`. A connection's `template` picks one by slug, exactly as
   *  for remote servers. Optional so pre-revamp stdio configs (which had no
   *  methods) still decode; absence is treated as no declared secret env. */
  authenticationTemplate: Schema_exports.optional(Schema_exports.Array(McpAuthMethod))
});
var McpIntegrationConfig = Schema_exports.Union([
  McpRemoteIntegrationConfig,
  McpStdioIntegrationConfig
]);
var decodeIntegrationConfig = Schema_exports.decodeUnknownOption(McpIntegrationConfig);
var parseMcpIntegrationConfig = (config) => Option_exports.getOrNull(decodeIntegrationConfig(config));
var McpToolAnnotations = Schema_exports.Struct({
  title: Schema_exports.optional(Schema_exports.String),
  readOnlyHint: Schema_exports.optional(Schema_exports.Boolean),
  destructiveHint: Schema_exports.optional(Schema_exports.Boolean),
  idempotentHint: Schema_exports.optional(Schema_exports.Boolean),
  openWorldHint: Schema_exports.optional(Schema_exports.Boolean)
});
var McpToolBinding = Schema_exports.Struct({
  /** Sanitized, address-safe tool name (the `<tool>` address segment). */
  toolId: Schema_exports.String,
  /** The real MCP tool name as advertised by the server. */
  toolName: Schema_exports.String,
  description: Schema_exports.NullOr(Schema_exports.String),
  inputSchema: Schema_exports.optional(Schema_exports.Unknown),
  outputSchema: Schema_exports.optional(Schema_exports.Unknown),
  annotations: Schema_exports.optional(McpToolAnnotations)
});

// ../../plugins/mcp/src/sdk/manifest.ts
var ListedTool = Schema_exports.Struct({
  name: Schema_exports.String,
  description: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  inputSchema: Schema_exports.optional(Schema_exports.Unknown),
  parameters: Schema_exports.optional(Schema_exports.Unknown),
  outputSchema: Schema_exports.optional(Schema_exports.Unknown),
  annotations: Schema_exports.optional(McpToolAnnotations)
});
var ListToolsResult = Schema_exports.Struct({
  tools: Schema_exports.Array(ListedTool)
});
var ListToolsPage = Schema_exports.Struct({
  tools: Schema_exports.Array(Schema_exports.Unknown),
  nextCursor: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String))
});
var ServerInfo = Schema_exports.Struct({
  name: Schema_exports.optional(Schema_exports.String),
  version: Schema_exports.optional(Schema_exports.String)
});
var decodeListToolsResult = Schema_exports.decodeUnknownOption(ListToolsResult);
var decodeListToolsPageOption = Schema_exports.decodeUnknownOption(ListToolsPage);
var decodeServerInfo = Schema_exports.decodeUnknownOption(ServerInfo);
var decodeListToolsPage = (value) => decodeListToolsPageOption(value);
var sanitize = (value) => {
  const s = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return s || "tool";
};
var uniqueId = (value, seen) => {
  const base = sanitize(value);
  const n = (seen.get(base) ?? 0) + 1;
  seen.set(base, n);
  return n === 1 ? base : `${base}_${n}`;
};
var extractManifestFromListToolsResult = (listToolsResult, metadata) => {
  const seen = /* @__PURE__ */ new Map();
  const listed = decodeListToolsResult(listToolsResult).pipe(
    Option_exports.map((result) => result.tools),
    Option_exports.getOrElse(() => [])
  );
  const server = decodeServerInfo(metadata?.serverInfo).pipe(
    Option_exports.map(
      (info) => ({
        name: info.name ?? null,
        version: info.version ?? null,
        instructions: metadata?.instructions ?? null
      })
    ),
    Option_exports.getOrNull
  );
  const tools = listed.flatMap((tool2) => {
    const toolName = tool2.name.trim();
    if (!toolName) return [];
    return [
      {
        toolId: uniqueId(toolName, seen),
        toolName,
        description: tool2.description ?? null,
        inputSchema: tool2.inputSchema ?? tool2.parameters,
        outputSchema: tool2.outputSchema,
        annotations: tool2.annotations
      }
    ];
  });
  return { server, tools };
};
var slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
var hostnameOf = (url) => {
  if (!URL.canParse(url)) return null;
  return new URL(url).hostname;
};
var basenameOf = (path) => path.trim().split(/[\\/]/).pop() ?? path.trim();
var deriveMcpNamespace = (input) => {
  if (input.name?.trim()) return slugify(input.name) || "mcp";
  const fromEndpoint = input.endpoint?.trim() ? hostnameOf(input.endpoint) : null;
  if (fromEndpoint) return slugify(fromEndpoint) || "mcp";
  if (input.command?.trim()) return slugify(basenameOf(input.command)) || "mcp";
  return "mcp";
};

// ../../plugins/mcp/src/sdk/discover.ts
var MAX_LIST_TOOLS_PAGES = 100;
var DEFAULT_DISCOVER_TIMEOUT = Duration_exports.seconds(15);
var listAllTools = (connection) => Effect_exports.gen(function* () {
  const tools = [];
  let cursor = void 0;
  for (let page = 0; page < MAX_LIST_TOOLS_PAGES; page++) {
    const params = cursor === void 0 ? void 0 : { cursor };
    const listResult = yield* Effect_exports.tryPromise({
      try: () => connection.client.listTools(params),
      catch: () => new McpToolDiscoveryError({
        stage: "list_tools",
        message: "Failed listing MCP tools"
      })
    });
    const decoded = decodeListToolsPage(listResult);
    if (Option_exports.isNone(decoded)) {
      return yield* new McpToolDiscoveryError({
        stage: "list_tools",
        message: "MCP listTools response did not match the expected schema"
      });
    }
    tools.push(...decoded.value.tools);
    const nextCursor = decoded.value.nextCursor;
    if (nextCursor == null || nextCursor === "") break;
    cursor = nextCursor;
  }
  return extractManifestFromListToolsResult(
    { tools },
    {
      serverInfo: connection.client.getServerVersion?.(),
      instructions: connection.client.getInstructions?.()
    }
  );
});
var discoverTools = (connector, timeoutMs = Duration_exports.toMillis(DEFAULT_DISCOVER_TIMEOUT)) => Effect_exports.gen(function* () {
  const connection = yield* connector.pipe(
    Effect_exports.mapError((failure) => {
      const httpStatus = Predicate_exports.isTagged(failure, "McpConnectionError") ? failure.httpStatus : void 0;
      return new McpToolDiscoveryError({
        stage: "connect",
        message: `Failed connecting to MCP server: ${failure.message}`,
        ...httpStatus !== void 0 ? { httpStatus } : {}
      });
    })
  );
  const manifest = yield* listAllTools(connection).pipe(
    Effect_exports.onExit(() => closeConnection(connection))
  );
  return manifest;
}).pipe(
  Effect_exports.timeoutOrElse({
    duration: Duration_exports.millis(timeoutMs),
    orElse: () => Effect_exports.fail(
      new McpToolDiscoveryError({
        stage: "connect",
        message: `MCP discovery timed out after ${timeoutMs}ms`
      })
    )
  })
);
var closeConnection = (connection) => Effect_exports.ignore(
  Effect_exports.tryPromise({
    try: () => connection.close(),
    catch: () => new McpToolDiscoveryError({
      stage: "list_tools",
      message: "Failed closing MCP connection"
    })
  })
);

// ../../plugins/mcp/src/sdk/invoke.ts
import {
  ElicitRequestSchema,
  ErrorCode,
  McpError,
  ToolListChangedNotificationSchema
} from "@modelcontextprotocol/sdk/types.js";
var ArgsRecord = Schema_exports.Record(Schema_exports.String, Schema_exports.Unknown);
var decodeArgsRecord = Schema_exports.decodeUnknownOption(ArgsRecord);
var argsRecord = (value) => Option_exports.getOrElse(decodeArgsRecord(value), () => ({}));
var escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var isUnknownToolMessage = (message, toolName) => {
  const name = escapeRegExp(toolName);
  return new RegExp(
    `(?:unknown tool:?\\s*"?${name}"?|tool\\s+"?${name}"?\\s+(?:not found|is not available|does not exist))`,
    "i"
  ).test(message);
};
var isUnknownToolCause = (cause, toolName) => (
  // oxlint-disable-next-line executor/no-instanceof-tagged-error -- boundary: MCP SDK surfaces JSON-RPC protocol errors as this Error subclass
  cause instanceof McpError && (cause.code === ErrorCode.InvalidParams || cause.code === ErrorCode.MethodNotFound) && // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: instanceof narrows to the SDK's McpError, whose message carries the only unknown-tool discriminator the protocol provides
  isUnknownToolMessage(cause.message, toolName)
);
var McpElicitParams = Schema_exports.Union([
  Schema_exports.Struct({
    mode: Schema_exports.Literal("url"),
    message: Schema_exports.String,
    url: Schema_exports.String,
    elicitationId: Schema_exports.optional(Schema_exports.String),
    id: Schema_exports.optional(Schema_exports.String)
  }),
  Schema_exports.Struct({
    mode: Schema_exports.optional(Schema_exports.Literal("form")),
    message: Schema_exports.String,
    requestedSchema: Schema_exports.Record(Schema_exports.String, Schema_exports.Unknown)
  })
]);
var decodeElicitParams = Schema_exports.decodeUnknownSync(McpElicitParams);
var toElicitationRequest = (params) => params.mode === "url" ? UrlElicitation.make({
  message: params.message,
  url: params.url,
  elicitationId: ElicitationId.make(params.elicitationId ?? params.id ?? "")
}) : FormElicitation.make({
  message: params.message,
  requestedSchema: params.requestedSchema
});
var installElicitationHandler = (client, elicit) => {
  client.setRequestHandler(ElicitRequestSchema, async (request) => {
    const params = decodeElicitParams(request.params);
    const req = toElicitationRequest(params);
    const exit = await Effect_exports.runPromiseExit(elicit(req));
    if (Exit_exports.isSuccess(exit)) {
      const response = exit.value;
      return {
        action: response.action,
        ...response.action === "accept" && response.content ? { content: response.content } : {}
      };
    }
    const failure = exit.cause.reasons.find(Cause_exports.isFailReason);
    if (failure) {
      const err = failure.error;
      if (Predicate_exports.isTagged(err, "ElicitationDeclinedError")) {
        const action = Predicate_exports.hasProperty(err, "action") && err.action === "cancel" ? "cancel" : "decline";
        return { action };
      }
    }
    throw Cause_exports.squash(exit.cause);
  });
};
var installToolListChangedHandler = (client, onToolListChanged) => {
  if (!onToolListChanged) return;
  client.setNotificationHandler(ToolListChangedNotificationSchema, () => {
    onToolListChanged();
  });
};
var useConnection = (connection, toolName, args, elicit, onToolListChanged) => Effect_exports.gen(function* () {
  installElicitationHandler(connection.client, elicit);
  installToolListChangedHandler(connection.client, onToolListChanged);
  return yield* Effect_exports.tryPromise({
    try: () => connection.client.callTool({ name: toolName, arguments: args }),
    catch: (cause) => {
      if (Predicate_exports.isTagged(cause, "McpOAuthReauthorizationRequired")) {
        return new McpOAuthReauthorizationRequired({
          message: "MCP OAuth re-authorization required"
        });
      }
      const status = httpStatusFromCause(cause);
      return new McpInvocationError({
        toolName,
        message: `MCP tool call failed for ${toolName}`,
        ...status === void 0 ? {} : { status },
        ...isUnknownToolCause(cause, toolName) ? { unknownTool: true } : {}
      });
    }
  }).pipe(
    Effect_exports.withSpan("plugin.mcp.client.call_tool", {
      attributes: { "mcp.tool.name": toolName }
    })
  );
});
var invokeMcpTool = (input) => Effect_exports.gen(function* () {
  const args = argsRecord(input.args);
  const connection = yield* Effect_exports.acquireRelease(
    input.connector.pipe(
      Effect_exports.withSpan("plugin.mcp.connection.acquire", {
        attributes: { "plugin.mcp.transport": input.transport }
      })
    ),
    (conn) => Effect_exports.ignore(
      Effect_exports.tryPromise({
        try: () => conn.close(),
        catch: () => new McpConnectionError({
          transport: input.transport,
          message: "Failed to close MCP connection"
        })
      })
    )
  );
  return yield* useConnection(
    connection,
    input.toolName,
    args,
    input.elicit,
    input.onToolListChanged
  );
}).pipe(
  Effect_exports.scoped,
  Effect_exports.withSpan("plugin.mcp.invoke", {
    attributes: {
      "mcp.tool.name": input.toolName,
      "plugin.mcp.tool_id": input.toolId,
      "plugin.mcp.transport": input.transport
    }
  })
);

// ../../plugins/mcp/src/sdk/presets.ts
var mcpPresets = [
  {
    id: "emulate-mcp",
    name: "Emulate MCP",
    summary: "Deterministic MCP fixtures for validating native text and image content.",
    url: "https://emulators.dev/mcp/query/mcp?token=demo-token",
    endpoint: "https://emulators.dev/mcp/query/mcp?token=demo-token",
    icon: "https://emulators.dev/favicon.ico"
  },
  {
    id: "deepwiki",
    name: "DeepWiki",
    summary: "Search and read documentation from any GitHub repo.",
    url: "https://mcp.deepwiki.com/mcp",
    endpoint: "https://mcp.deepwiki.com/mcp",
    icon: "https://integrations.sh/logo/deepwiki.com",
    featured: true
  },
  {
    id: "slack",
    name: "Slack",
    summary: "Search messages, read canvases, and write Slack updates via MCP.",
    url: "https://mcp.slack.com/mcp",
    endpoint: "https://mcp.slack.com/mcp",
    icon: "https://integrations.sh/logo/slack.com",
    featured: true
  },
  {
    id: "context7",
    name: "Context7",
    summary: "Up-to-date docs and code examples for any library.",
    url: "https://mcp.context7.com/mcp",
    endpoint: "https://mcp.context7.com/mcp",
    icon: "https://integrations.sh/logo/context7.com",
    featured: true
  },
  {
    id: "browserbase",
    name: "Browserbase",
    summary: "Cloud browser sessions for web scraping and automation.",
    url: "https://mcp.browserbase.com/mcp",
    endpoint: "https://mcp.browserbase.com/mcp",
    icon: "https://integrations.sh/logo/browserbase.com",
    featured: true
  },
  {
    id: "firecrawl",
    name: "Firecrawl",
    summary: "Crawl and scrape websites into structured data.",
    url: "https://mcp.firecrawl.dev/mcp",
    endpoint: "https://mcp.firecrawl.dev/mcp",
    icon: "https://integrations.sh/logo/firecrawl.dev",
    featured: true
  },
  {
    id: "neon",
    name: "Neon",
    summary: "Serverless Postgres \u2014 branches, queries, and management.",
    url: "https://mcp.neon.tech/mcp",
    endpoint: "https://mcp.neon.tech/mcp",
    icon: "https://integrations.sh/logo/neon.tech",
    featured: true
  },
  {
    id: "axiom",
    name: "Axiom",
    summary: "Query, analyze, and monitor your logs and event data.",
    url: "https://mcp.axiom.co/mcp",
    endpoint: "https://mcp.axiom.co/mcp",
    icon: "https://integrations.sh/logo/axiom.co",
    featured: true
  },
  {
    id: "stripe",
    name: "Stripe",
    summary: "Manage payments, subscriptions, and billing via MCP.",
    url: "https://mcp.stripe.com",
    endpoint: "https://mcp.stripe.com",
    icon: "https://integrations.sh/logo/stripe.com",
    featured: true
  },
  {
    id: "linear",
    name: "Linear",
    summary: "Issues, projects, teams, and cycles via MCP.",
    url: "https://mcp.linear.app/mcp",
    endpoint: "https://mcp.linear.app/mcp",
    icon: "https://integrations.sh/logo/linear.app",
    featured: true
  },
  {
    id: "notion",
    name: "Notion",
    summary: "Databases, pages, blocks, and search via MCP.",
    url: "https://mcp.notion.com/mcp",
    endpoint: "https://mcp.notion.com/mcp",
    icon: "https://integrations.sh/logo/notion.com",
    featured: true
  },
  {
    id: "sentry",
    name: "Sentry",
    summary: "Error monitoring, issues, and performance data.",
    url: "https://mcp.sentry.dev/mcp",
    endpoint: "https://mcp.sentry.dev/mcp",
    icon: "https://svgl.app/library/sentry.svg"
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    summary: "Workers, KV, D1, R2, and DNS management via MCP.",
    url: "https://mcp.cloudflare.com/mcp",
    endpoint: "https://mcp.cloudflare.com/mcp",
    icon: "https://integrations.sh/logo/cloudflare.com"
  },
  {
    id: "chrome-devtools",
    name: "Chrome DevTools",
    summary: "Debug a live Chrome browser session via local stdio.",
    icon: "https://www.google.com/chrome/static/images/favicons/favicon-32x32.png",
    featured: true,
    transport: "stdio",
    command: "npx",
    args: ["-y", "chrome-devtools-mcp@latest"]
  }
];

// ../../plugins/mcp/src/sdk/probe-shape.ts
var INITIALIZE_BODY = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "executor-probe", version: "0" }
  }
});
var readHeader = (headers, name) => {
  const direct = headers[name];
  if (direct !== void 0) return direct;
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === lower) return v;
  }
  return null;
};
var ProbeTransportError = class extends Data_exports.TaggedError("ProbeTransportError") {
};
var decodeJsonString = Schema_exports.decodeUnknownOption(Schema_exports.fromJsonString(Schema_exports.Unknown));
var asObject = (body) => {
  if (!body) return null;
  const parsed = decodeJsonString(body);
  if (Option_exports.isNone(parsed)) return null;
  const value = parsed.value;
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value;
};
var isJsonRpcEnvelope = (body) => {
  const obj = asObject(body);
  if (!obj) return false;
  if (obj.jsonrpc !== "2.0") return false;
  return "result" in obj || "error" in obj || "method" in obj;
};
var isOAuthErrorBody = (body) => {
  const obj = asObject(body);
  if (!obj) return false;
  if (Array.isArray(obj.errors)) return false;
  return typeof obj.error === "string";
};
var ProtectedResourceMetadata = Schema_exports.Struct({
  resource: Schema_exports.String,
  authorization_servers: Schema_exports.Array(Schema_exports.String)
});
var decodeProtectedResourceMetadata = Schema_exports.decodeUnknownOption(
  Schema_exports.fromJsonString(ProtectedResourceMetadata)
);
var protectedResourceMetadataUrl = (endpoint) => {
  const path = endpoint.pathname === "/" ? "" : endpoint.pathname;
  return `${endpoint.origin}/.well-known/oauth-protected-resource${path}`;
};
var resourceMatchesEndpoint = (resource, endpoint) => {
  if (!URL.canParse(resource)) return false;
  const parsed = new URL(resource);
  if (parsed.origin !== endpoint.origin) return false;
  const resourcePath = parsed.pathname.replace(/\/+$/, "");
  const endpointPath = endpoint.pathname.replace(/\/+$/, "");
  return endpointPath === resourcePath || endpointPath.startsWith(`${resourcePath}/`);
};
var probeProtectedResourceMetadata = (client, endpoint, timeoutMs) => Effect_exports.gen(function* () {
  const response = yield* client.execute(
    HttpClientRequest_exports.get(protectedResourceMetadataUrl(endpoint)).pipe(
      HttpClientRequest_exports.setHeader("accept", "application/json")
    )
  ).pipe(Effect_exports.timeout(Duration_exports.millis(timeoutMs)));
  if (response.status < 200 || response.status >= 300) return false;
  const body = yield* response.text.pipe(
    Effect_exports.timeout(Duration_exports.millis(timeoutMs)),
    Effect_exports.catch(() => Effect_exports.succeed(""))
  );
  const metadata = decodeProtectedResourceMetadata(body);
  if (Option_exports.isNone(metadata)) return false;
  if (metadata.value.authorization_servers.length === 0) return false;
  return resourceMatchesEndpoint(metadata.value.resource, endpoint);
}).pipe(Effect_exports.catch(() => Effect_exports.succeed(false)));
var ErrorMessageShape = Schema_exports.Struct({ message: Schema_exports.String });
var decodeErrorMessageShape = Schema_exports.decodeUnknownOption(ErrorMessageShape);
var reasonFromBoundaryCause = (cause) => {
  const messageShape = decodeErrorMessageShape(cause);
  if (Option_exports.isSome(messageShape)) return messageShape.value.message;
  if (typeof cause === "string") return cause;
  if (typeof cause === "number" || typeof cause === "boolean" || typeof cause === "bigint") {
    return `${cause}`;
  }
  if (typeof cause === "symbol") return cause.description ?? "symbol";
  if (cause === null) return "null";
  if (typeof cause === "undefined") return "undefined";
  return "fetch failed";
};
var probeMcpEndpointShape = (endpoint, options = {}) => Effect_exports.gen(function* () {
  const timeoutMs = options.timeoutMs ?? 8e3;
  const outcome = yield* Effect_exports.gen(function* () {
    const client = yield* HttpClient_exports.HttpClient;
    const readBody = (response) => response.text.pipe(
      Effect_exports.timeout(Duration_exports.millis(timeoutMs)),
      Effect_exports.catch(() => Effect_exports.succeed(""))
    );
    const classify = (response, method) => Effect_exports.gen(function* () {
      const contentType = readHeader(response.headers, "content-type") ?? "";
      const isSse = /^\s*text\/event-stream\b/i.test(contentType);
      if (response.status === 401) {
        const wwwAuth = readHeader(response.headers, "www-authenticate");
        if (!wwwAuth || !/^\s*bearer\b/i.test(wwwAuth)) {
          if (yield* probeProtectedResourceMetadata(client, url, timeoutMs)) {
            return { kind: "mcp", requiresAuth: true };
          }
          return {
            kind: "not-mcp",
            category: "auth-required",
            reason: "401 without Bearer WWW-Authenticate \u2014 not an MCP auth challenge"
          };
        }
        if (/(?:^|[\s,])resource_metadata\s*=/i.test(wwwAuth)) {
          return { kind: "mcp", requiresAuth: true };
        }
        if (/(?:^|[\s,])error\s*=/i.test(wwwAuth)) {
          return { kind: "mcp", requiresAuth: true };
        }
        if (isSse) return { kind: "mcp", requiresAuth: true };
        const body = yield* readBody(response);
        if (!isJsonRpcEnvelope(body) && !isOAuthErrorBody(body)) {
          if (yield* probeProtectedResourceMetadata(client, url, timeoutMs)) {
            return { kind: "mcp", requiresAuth: true };
          }
          return {
            kind: "not-mcp",
            category: "auth-required",
            reason: "401 + Bearer without resource_metadata, JSON-RPC body, or OAuth error body"
          };
        }
        return { kind: "mcp", requiresAuth: true };
      }
      if (response.status >= 200 && response.status < 300) {
        if (method === "GET") {
          if (!isSse) {
            return {
              kind: "not-mcp",
              category: "wrong-shape",
              reason: "GET response is not an SSE stream"
            };
          }
          return { kind: "mcp", requiresAuth: false };
        }
        if (isSse) return { kind: "mcp", requiresAuth: false };
        const body = yield* readBody(response);
        if (!isJsonRpcEnvelope(body)) {
          return {
            kind: "not-mcp",
            category: "wrong-shape",
            reason: "2xx POST body is not a JSON-RPC envelope"
          };
        }
        return { kind: "mcp", requiresAuth: false };
      }
      return null;
    });
    const url = new URL(endpoint);
    for (const [key, value] of Object.entries(options.queryParams ?? {})) {
      url.searchParams.set(key, value);
    }
    let postRequest = HttpClientRequest_exports.post(url.toString()).pipe(
      HttpClientRequest_exports.setHeader("content-type", "application/json"),
      HttpClientRequest_exports.setHeader("accept", "application/json, text/event-stream"),
      HttpClientRequest_exports.bodyText(INITIALIZE_BODY, "application/json")
    );
    for (const [name, value] of Object.entries(options.headers ?? {})) {
      postRequest = HttpClientRequest_exports.setHeader(postRequest, name, value);
    }
    const postResponse = yield* client.execute(postRequest).pipe(Effect_exports.timeout(Duration_exports.millis(timeoutMs)));
    const postResult = yield* classify(postResponse, "POST");
    if (postResult) return postResult;
    if ([404, 405, 406, 415].includes(postResponse.status)) {
      let getRequest = HttpClientRequest_exports.get(url.toString()).pipe(
        HttpClientRequest_exports.setHeader("accept", "text/event-stream")
      );
      for (const [name, value] of Object.entries(options.headers ?? {})) {
        getRequest = HttpClientRequest_exports.setHeader(getRequest, name, value);
      }
      const getResponse = yield* client.execute(getRequest).pipe(Effect_exports.timeout(Duration_exports.millis(timeoutMs)));
      const getResult = yield* classify(getResponse, "GET");
      if (getResult) return getResult;
    }
    return {
      kind: "not-mcp",
      category: "wrong-shape",
      reason: `unexpected status ${postResponse.status} for initialize`
    };
  }).pipe(
    Effect_exports.provide(options.httpClientLayer ?? FetchHttpClient_exports.layer),
    Effect_exports.mapError(
      (cause) => new ProbeTransportError({
        reason: reasonFromBoundaryCause(cause),
        cause
      })
    ),
    Effect_exports.catch(
      (cause) => Effect_exports.succeed({
        kind: "unreachable",
        reason: cause.reason
      })
    )
  );
  return outcome;
}).pipe(Effect_exports.withSpan("mcp.plugin.probe_shape"));

// ../../plugins/mcp/src/sdk/plugin.ts
var MCP_PLUGIN_ID = "mcp";
var mcpLivenessFailureStatus = (failure) => {
  if (failure.httpStatus !== void 0) {
    const classified = classifyHttpStatus(failure.httpStatus);
    return classified === "expired" ? "expired" : "degraded";
  }
  const lower = failure.message.toLowerCase();
  const authWalled = lower.includes("oauth re-authorization") || lower.includes("unauthorized") || lower.includes("forbidden");
  return authWalled ? "expired" : "degraded";
};
var legacyOAuthClientSlugCandidate = (value) => {
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : null;
};
var legacyOAuthClientSlugCandidates = (slug, integration) => {
  const candidates = /* @__PURE__ */ new Set();
  const fromSlug = legacyOAuthClientSlugCandidate(slug);
  if (fromSlug) candidates.add(fromSlug);
  const fromDescription = integration == null ? null : legacyOAuthClientSlugCandidate(integration.description);
  if (fromDescription) candidates.add(fromDescription);
  return candidates;
};
var oauthClientKey = (owner, slug) => `${owner}:${String(slug)}`;
var legacyMcpClientMatches = (client, candidates, config) => {
  if (!candidates.has(String(client.slug))) return false;
  if (!config || config.transport !== "remote" || !config.authenticationTemplate.some((method) => method.kind === "oauth2")) {
    return false;
  }
  return client.grant === "authorization_code" && (client.resource ?? null) === config.endpoint;
};
var McpStampSchema = Schema_exports.Struct({
  toolName: Schema_exports.String,
  upstream: Schema_exports.optional(
    Schema_exports.Struct({
      title: Schema_exports.optional(Schema_exports.String),
      readOnlyHint: Schema_exports.optional(Schema_exports.Boolean),
      destructiveHint: Schema_exports.optional(Schema_exports.Boolean),
      idempotentHint: Schema_exports.optional(Schema_exports.Boolean),
      openWorldHint: Schema_exports.optional(Schema_exports.Boolean)
    })
  )
});
var AnnotationsWithStamp = Schema_exports.Struct({ mcp: McpStampSchema });
var decodeStamp = Schema_exports.decodeUnknownOption(AnnotationsWithStamp);
var readStamp = (annotations) => Option_exports.match(decodeStamp(annotations), {
  onNone: () => null,
  onSome: (decoded) => decoded.mcp
});
var McpRemoteServerInputSchema = Schema_exports.Struct({
  transport: Schema_exports.optional(Schema_exports.Literal("remote")),
  name: Schema_exports.String,
  /** Agent-visible catalog description. Defaults to the display name. */
  description: Schema_exports.optional(Schema_exports.String),
  endpoint: Schema_exports.String,
  remoteTransport: Schema_exports.optional(McpRemoteTransport),
  headers: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, Schema_exports.String)),
  queryParams: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, Schema_exports.String)),
  slug: Schema_exports.optional(Schema_exports.String),
  /** Declared auth methods a connection can be applied through. */
  authenticationTemplate: Schema_exports.optional(Schema_exports.Array(McpAuthMethodInput)),
  /** Single-method shorthand (legacy callers). Ignored when
   *  `authenticationTemplate` is present. Defaults to none. */
  auth: Schema_exports.optional(McpAuthShorthand)
});
var McpStdioServerInputSchema = Schema_exports.Struct({
  transport: Schema_exports.Literal("stdio"),
  name: Schema_exports.String,
  description: Schema_exports.optional(Schema_exports.String),
  command: Schema_exports.String,
  args: Schema_exports.optional(Schema_exports.Array(Schema_exports.String)),
  /** DECLARE the secret env vars this server needs, by NAME. Their values are
   *  supplied as the connection's secret credentials, not here — so the UI
   *  defines what env vars exist and the connect step provides the secrets. */
  envVars: Schema_exports.optional(Schema_exports.Array(Schema_exports.String)),
  /** Provide secret env values directly (programmatic / agent one-shot): the
   *  add then auto-creates the connection holding them. The UI uses `envVars`
   *  instead and leaves the values to the connect step. */
  env: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, Schema_exports.String)),
  cwd: Schema_exports.optional(Schema_exports.String),
  slug: Schema_exports.optional(Schema_exports.String)
});
var McpAddServerInputSchema = Schema_exports.Union([
  McpRemoteServerInputSchema,
  McpStdioServerInputSchema
]);
var McpAddServerOutputSchema = Schema_exports.Struct({
  slug: Schema_exports.String
});
var McpConfigureAuthInputSchema = Schema_exports.Struct({
  authenticationTemplate: Schema_exports.Array(McpAuthMethodInput),
  mode: Schema_exports.optional(Schema_exports.Literals(["merge", "replace"]))
});
var McpProbeEndpointInputSchema = Schema_exports.Struct({
  endpoint: Schema_exports.String,
  headers: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, Schema_exports.String)),
  queryParams: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, Schema_exports.String))
});
var McpProbeEndpointOutputSchema = Schema_exports.Struct({
  connected: Schema_exports.Boolean,
  requiresAuthentication: Schema_exports.Boolean,
  requiresOAuth: Schema_exports.Boolean,
  supportsDynamicRegistration: Schema_exports.Boolean,
  name: Schema_exports.String,
  slug: Schema_exports.String,
  toolCount: Schema_exports.NullOr(Schema_exports.Number),
  serverName: Schema_exports.NullOr(Schema_exports.String),
  /** The server's `instructions` from initialize — prefill for the add form's
   *  description. Only available when the probe connected unauthenticated. */
  instructions: Schema_exports.NullOr(Schema_exports.String)
});
var McpGetServerInputSchema = Schema_exports.Struct({
  slug: Schema_exports.String
});
var McpGetServerOutputSchema = Schema_exports.Struct({
  integration: Schema_exports.NullOr(Schema_exports.Unknown)
});
var schemaToStaticToolSchema = (schema) => Schema_exports.toStandardSchemaV1(Schema_exports.toStandardJSONSchemaV1(schema));
var McpAddServerInputStandardSchema = schemaToStaticToolSchema(McpAddServerInputSchema);
var McpAddServerOutputStandardSchema = schemaToStaticToolSchema(McpAddServerOutputSchema);
var McpProbeEndpointInputStandardSchema = schemaToStaticToolSchema(McpProbeEndpointInputSchema);
var McpProbeEndpointOutputStandardSchema = schemaToStaticToolSchema(McpProbeEndpointOutputSchema);
var McpGetServerInputStandardSchema = schemaToStaticToolSchema(McpGetServerInputSchema);
var McpGetServerOutputStandardSchema = schemaToStaticToolSchema(McpGetServerOutputSchema);
var mcpToolFailure = (code, message, details) => ToolResult.fail({
  code,
  message,
  ...details === void 0 ? {} : { details }
});
var mcpInvocationAuthFailure = (input) => authToolFailure({
  code: "connection_rejected",
  message: input.status === 403 ? `MCP server rejected connection "${input.connection}" with HTTP 403. The credential may lack access or required scope; re-authenticate or update the connection before retrying this tool.` : `MCP server rejected connection "${input.connection}" with HTTP 401. Re-authenticate or update the connection before retrying this tool.`,
  integration: { id: input.integration },
  credential: { kind: "upstream", label: input.connection },
  status: input.status,
  upstream: { status: input.status }
});
var mcpInvocationOAuthReauthFailure = (input) => authToolFailure({
  code: "oauth_reauth_required",
  message: `OAuth connection "${input.connection}" requires reauthorization before retrying this MCP tool.`,
  integration: { id: input.integration },
  credential: { kind: "oauth", label: input.connection }
});
var slugFrom = (slug) => IntegrationSlug.make(slug);
var normalizeSlug = (input) => input.slug ?? deriveMcpNamespace({
  name: input.name,
  endpoint: input.transport === "stdio" ? void 0 : input.endpoint,
  command: input.transport === "stdio" ? input.command : void 0
});
var STDIO_ENV_TEMPLATE = "env";
var stdioEnvVarNames = (input) => {
  const names = new Set(input.envVars ?? []);
  for (const key of Object.keys(input.env ?? {})) names.add(key);
  return [...names];
};
var toIntegrationConfig = (input) => {
  if (input.transport === "stdio") {
    const vars = stdioEnvVarNames(input);
    return {
      transport: "stdio",
      command: input.command,
      args: input.args ? [...input.args] : void 0,
      cwd: input.cwd,
      authenticationTemplate: vars.length > 0 ? [{ slug: STDIO_ENV_TEMPLATE, kind: "stdio_env", vars }] : [{ slug: "none", kind: "none" }]
    };
  }
  return {
    transport: "remote",
    endpoint: input.endpoint,
    remoteTransport: input.remoteTransport ?? "auto",
    queryParams: input.queryParams,
    headers: input.headers,
    authenticationTemplate: input.authenticationTemplate ? normalizeMcpAuthMethods(input.authenticationTemplate) : [mcpAuthMethodFromShorthand(input.auth ?? { kind: "none" })]
  };
};
var McpCallToolResultJsonSchema = toJSONSchema(CallToolResultSchema);
var mcpCallToolResultOutputSchema = (structuredContentSchema) => {
  const defaultStructuredContentSchema = McpCallToolResultJsonSchema.properties?.structuredContent ?? {};
  return {
    ...McpCallToolResultJsonSchema,
    properties: {
      ...McpCallToolResultJsonSchema.properties,
      structuredContent: structuredContentSchema === void 0 ? defaultStructuredContentSchema : structuredContentSchema,
      isError: { const: false }
    },
    required: structuredContentSchema === void 0 ? ["content"] : ["content", "structuredContent"]
  };
};
var toToolDef = (entry) => {
  const destructive = entry.annotations?.destructiveHint === true;
  const stamp = {
    toolName: entry.toolName,
    ...entry.annotations ? { upstream: entry.annotations } : {}
  };
  const annotations = {
    requiresApproval: destructive,
    ...destructive ? { approvalDescription: entry.annotations?.title ?? entry.toolName } : {},
    mcp: stamp
  };
  return {
    name: ToolName.make(entry.toolId),
    description: entry.description ?? `MCP tool: ${entry.toolName}`,
    inputSchema: entry.inputSchema,
    outputSchema: mcpCallToolResultOutputSchema(entry.outputSchema),
    annotations
  };
};
var McpTextContent = Schema_exports.Struct({ type: Schema_exports.Literal("text"), text: Schema_exports.String });
var McpToolCallEnvelope = Schema_exports.Struct({
  isError: Schema_exports.optional(Schema_exports.Boolean),
  content: Schema_exports.optional(Schema_exports.Array(Schema_exports.Unknown))
});
var decodeMcpTextContent = Schema_exports.decodeUnknownOption(McpTextContent);
var decodeMcpToolCallEnvelope = Schema_exports.decodeUnknownOption(McpToolCallEnvelope);
var extractMcpErrorMessage = (content) => {
  if (Array.isArray(content)) {
    for (const item of content) {
      const decoded = Option_exports.getOrUndefined(decodeMcpTextContent(item));
      if (decoded !== void 0 && decoded.text.length > 0) return decoded.text;
    }
  }
  return "MCP tool returned an error";
};
var unknownToolFailure = (toolName, credential) => ToolResult.fail({
  code: "mcp_tool_unknown",
  message: `The MCP server no longer provides tool "${toolName}". Its tool catalog changed; list tools again for the current set.`,
  details: {
    integration: String(credential.integration),
    connection: String(credential.connection)
  }
});
var urlMatchesToken = (url, token) => {
  const re = new RegExp(`(?:^|[^a-z0-9])${token}(?:$|[^a-z0-9])`, "i");
  return re.test(url.hostname) || re.test(url.pathname);
};
var userFacingProbeMessage = (shape) => shape.kind === "unreachable" ? "Couldn't reach this URL. Check the address, your network, and that the server is running." : "This URL doesn't appear to host an MCP server. Double-check the address, including the path.";
var makeOAuthProvider = (accessToken) => ({
  get redirectUrl() {
    return "http://localhost/oauth/callback";
  },
  get clientMetadata() {
    return {
      redirect_uris: ["http://localhost/oauth/callback"],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      client_name: "Executor"
    };
  },
  clientInformation: () => void 0,
  saveClientInformation: () => void 0,
  tokens: () => ({ access_token: accessToken, token_type: "Bearer" }),
  saveTokens: () => void 0,
  redirectToAuthorization: async () => {
    throw new McpOAuthReauthorizationRequired({
      message: "MCP OAuth re-authorization required"
    });
  },
  saveCodeVerifier: () => void 0,
  codeVerifier: () => {
    throw new Error("No active PKCE verifier");
  },
  saveDiscoveryState: () => void 0,
  discoveryState: () => void 0
});
var selectAuthMethod = (config, templateSlug) => {
  const methods = config.authenticationTemplate ?? [];
  if (templateSlug !== null) {
    const match = methods.find((method) => method.slug === templateSlug);
    if (match) return match;
  }
  return methods.length === 1 ? methods[0] : void 0;
};
var buildConnectorInput = (config, values, templateSlug, allowStdio, httpClientLayer) => {
  if (config.transport === "stdio") {
    if (!allowStdio) {
      return Effect_exports.fail(
        new McpConnectionError({
          transport: "stdio",
          message: "MCP stdio transport is disabled. Enable it by passing `dangerouslyAllowStdioMCP: true` to mcpPlugin() \u2014 only safe for trusted local contexts."
        })
      );
    }
    const method = selectAuthMethod(config, templateSlug);
    const env = { ...config.env ?? {} };
    if (method?.kind === "stdio_env") {
      for (const variable2 of method.vars) {
        const value = values[variable2];
        if (value != null) env[variable2] = value;
      }
    }
    return Effect_exports.succeed({
      transport: "stdio",
      command: config.command,
      args: config.args,
      env: Object.keys(env).length > 0 ? env : void 0,
      cwd: config.cwd
    });
  }
  const headers = { ...config.headers ?? {} };
  const queryParams = { ...config.queryParams ?? {} };
  let authProvider;
  const auth = selectAuthMethod(config, templateSlug);
  if (auth?.kind === "apikey") {
    const rendered = renderAuthPlacements(auth.placements, values);
    Object.assign(headers, rendered.headers);
    Object.assign(queryParams, rendered.queryParams);
  } else if (auth?.kind === "oauth2") {
    const token = values[TOKEN_VARIABLE];
    if (token != null) authProvider = makeOAuthProvider(token);
  }
  return Effect_exports.succeed({
    transport: "remote",
    endpoint: config.endpoint,
    remoteTransport: config.remoteTransport ?? "auto",
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : void 0,
    headers: Object.keys(headers).length > 0 ? headers : void 0,
    authProvider,
    httpClientLayer
  });
};
var describeStdioEnvAuthMethod = (method) => ({
  id: method.slug,
  label: "Environment variables",
  kind: "apikey",
  template: method.slug,
  placements: method.vars.map((name) => ({ carrier: "env", name, prefix: "", variable: name }))
});
var describeMcpAuthMethods = (record) => {
  const config = parseMcpIntegrationConfig(record.config);
  if (!config) return [];
  const methods = config.authenticationTemplate ?? [];
  return methods.map((method) => {
    if (method.kind === "stdio_env") return describeStdioEnvAuthMethod(method);
    if (method.kind === "apikey") return describeApiKeyAuthMethod(method);
    if (method.kind === "oauth2") {
      return {
        id: method.slug,
        label: "OAuth",
        kind: "oauth",
        template: method.slug,
        // Only remote configs carry an endpoint; stdio never reaches here with
        // oauth2.
        oauth: {
          discoveryUrl: config.transport === "remote" ? config.endpoint : void 0,
          supportsDynamicRegistration: true
        }
      };
    }
    return describeNoneAuthMethod(method.slug);
  });
};
var describeMcpIntegrationDisplay = (record) => {
  const config = parseMcpIntegrationConfig(record.config);
  if (!config || config.transport === "stdio") return {};
  return { url: config.endpoint };
};
var mcpPlugin = definePlugin((options) => {
  const allowStdio = options?.dangerouslyAllowStdioMCP ?? false;
  const presetEntries = (allowStdio ? mcpPresets : mcpPresets.filter((preset) => !("transport" in preset && preset.transport === "stdio"))).map((preset) => ({
    id: preset.id,
    name: preset.name,
    summary: preset.summary,
    ..."url" in preset && preset.url ? { url: preset.url } : {},
    ..."endpoint" in preset && preset.endpoint ? { endpoint: preset.endpoint } : {},
    ...preset.icon ? { icon: preset.icon } : {},
    ...preset.featured ? { featured: preset.featured } : {},
    transport: "transport" in preset && preset.transport === "stdio" ? "stdio" : "remote",
    ..."command" in preset ? { command: preset.command } : {},
    ..."args" in preset && preset.args ? { args: [...preset.args] } : {},
    ..."env" in preset && preset.env ? { env: preset.env } : {}
  }));
  return {
    id: MCP_PLUGIN_ID,
    packageName: "@executor-js/plugin-mcp",
    // MCP servers own their tool catalogs and change them server-side with no
    // executor-visible signal — opt into core's freshness TTL re-listing.
    remoteToolCatalog: true,
    integrationPresets: presetEntries,
    // Surfaced to the client bundle via the Vite plugin. The MCP `./client`
    // factory reads `allowStdio` and gates the stdio tab + presets.
    clientConfig: { allowStdio },
    storage: () => ({}),
    extension: (ctx) => {
      const httpClientLayer = options?.httpClientLayer ?? ctx.httpClientLayer;
      const probeEndpoint = (input) => Effect_exports.gen(function* () {
        const endpoint = typeof input === "string" ? input : input.endpoint;
        const trimmed = endpoint.trim();
        if (!trimmed) {
          return yield* new McpConnectionError({
            transport: "remote",
            message: "Endpoint URL is required"
          });
        }
        const name = yield* Effect_exports.try({
          try: () => new URL(trimmed).hostname,
          catch: () => "mcp"
        }).pipe(Effect_exports.orElseSucceed(() => "mcp"));
        const slug = deriveMcpNamespace({ endpoint: trimmed });
        const probeHeaders = typeof input === "string" ? void 0 : input.headers;
        const probeQueryParams = typeof input === "string" ? void 0 : input.queryParams;
        const connector = createMcpConnector({
          transport: "remote",
          endpoint: trimmed,
          headers: probeHeaders,
          queryParams: probeQueryParams,
          httpClientLayer
        });
        const result = yield* discoverTools(connector).pipe(
          Effect_exports.map((m) => ({ ok: true, manifest: m })),
          Effect_exports.catch(() => Effect_exports.succeed({ ok: false, manifest: null })),
          Effect_exports.withSpan("mcp.plugin.discover_tools")
        );
        if (result.ok && result.manifest) {
          return {
            connected: true,
            requiresAuthentication: false,
            requiresOAuth: false,
            supportsDynamicRegistration: false,
            name: result.manifest.server?.name ?? name,
            slug,
            toolCount: result.manifest.tools.length,
            serverName: result.manifest.server?.name ?? null,
            instructions: result.manifest.server?.instructions ?? null
          };
        }
        const shape = yield* probeMcpEndpointShape(trimmed, {
          httpClientLayer,
          headers: probeHeaders,
          queryParams: probeQueryParams
        });
        if (shape.kind === "unreachable") {
          return yield* new McpConnectionError({
            transport: "remote",
            message: userFacingProbeMessage(shape)
          });
        }
        if (shape.kind === "not-mcp") {
          if (shape.category === "wrong-shape") {
            return yield* new McpConnectionError({
              transport: "remote",
              message: userFacingProbeMessage(shape)
            });
          }
          return {
            connected: false,
            requiresAuthentication: true,
            requiresOAuth: false,
            supportsDynamicRegistration: false,
            name,
            slug,
            toolCount: null,
            serverName: null,
            instructions: null
          };
        }
        const probeResult = yield* ctx.oauth.probe({ url: trimmed }).pipe(
          Effect_exports.map((oauth) => ({ ok: true, oauth })),
          Effect_exports.catch(() => Effect_exports.succeed({ ok: false, oauth: null })),
          Effect_exports.withSpan("mcp.plugin.probe_oauth")
        );
        if (probeResult.ok) {
          return {
            connected: false,
            requiresAuthentication: true,
            requiresOAuth: true,
            supportsDynamicRegistration: probeResult.oauth.registrationEndpoint != null,
            name,
            slug,
            toolCount: null,
            serverName: null,
            instructions: null
          };
        }
        if (shape.requiresAuth) {
          return {
            connected: false,
            requiresAuthentication: true,
            requiresOAuth: false,
            supportsDynamicRegistration: false,
            name,
            slug,
            toolCount: null,
            serverName: null,
            instructions: null
          };
        }
        return yield* new McpConnectionError({
          transport: "remote",
          message: "This endpoint looks like MCP, but Executor couldn't discover tools from it. Check the URL and try again."
        });
      }).pipe(
        Effect_exports.withSpan("mcp.plugin.probe_endpoint", {
          attributes: { "mcp.endpoint": typeof input === "string" ? input : input.endpoint }
        })
      );
      const addServer = (input) => Effect_exports.gen(function* () {
        const slug = normalizeSlug(input);
        const config = toIntegrationConfig(input);
        const existing = yield* ctx.core.integrations.get(slugFrom(slug));
        if (existing) {
          return yield* new IntegrationAlreadyExistsError({ slug: slugFrom(slug) });
        }
        yield* ctx.core.integrations.register({
          slug: slugFrom(slug),
          name: input.name,
          description: input.description?.trim() || input.name,
          config,
          canRemove: true,
          canRefresh: true
        }).pipe(
          Effect_exports.withSpan("mcp.plugin.register_integration", {
            attributes: { "mcp.integration.slug": slug }
          })
        );
        if (input.transport === "stdio") {
          const hasValues = input.env != null && Object.keys(input.env).length > 0;
          const declaresSecrets = stdioEnvVarNames(input).length > 0;
          if (hasValues || !declaresSecrets) {
            yield* ctx.connections.create({
              owner: "org",
              name: ConnectionName.make("default"),
              integration: slugFrom(slug),
              template: AuthTemplateSlug.make(hasValues ? STDIO_ENV_TEMPLATE : "none"),
              values: hasValues ? { ...input.env } : {}
            }).pipe(
              // These can't arise right after a successful register with
              // valid inputs, but the channel must stay within
              // McpExtensionFailure; surface them as a connection error
              // rather than swallow a real failure.
              Effect_exports.catchTags({
                IntegrationNotFoundError: (cause) => Effect_exports.fail(
                  new McpConnectionError({ transport: "stdio", message: cause.message })
                ),
                CredentialProviderNotRegisteredError: (cause) => Effect_exports.fail(
                  new McpConnectionError({ transport: "stdio", message: cause.message })
                ),
                InvalidConnectionInputError: (cause) => Effect_exports.fail(
                  new McpConnectionError({ transport: "stdio", message: cause.message })
                )
              }),
              Effect_exports.withSpan("mcp.plugin.bootstrap_stdio_connection", {
                attributes: { "mcp.integration.slug": slug }
              })
            );
          }
        }
        return { slug };
      }).pipe(
        Effect_exports.withSpan("mcp.plugin.add_server", {
          attributes: {
            "mcp.server.transport": input.transport ?? "remote",
            "mcp.server.name": input.name
          }
        })
      );
      const reconcileStdioConnections = () => Effect_exports.gen(function* () {
        const integrations = yield* ctx.core.integrations.list();
        for (const integration of integrations) {
          if (integration.kind !== MCP_PLUGIN_ID) continue;
          yield* Effect_exports.gen(function* () {
            const record = yield* ctx.core.integrations.get(integration.slug);
            const config = record ? parseMcpIntegrationConfig(record.config) : null;
            if (!config || config.transport !== "stdio") return;
            if (config.authenticationTemplate !== void 0) return;
            const connections = yield* ctx.connections.list({
              integration: integration.slug
            });
            if (connections.length > 0) return;
            const inlineEnv = config.env ?? {};
            const envVars = Object.keys(inlineEnv);
            const hasEnv = envVars.length > 0;
            yield* ctx.connections.create({
              owner: "org",
              name: ConnectionName.make("default"),
              integration: integration.slug,
              template: AuthTemplateSlug.make(hasEnv ? STDIO_ENV_TEMPLATE : "none"),
              values: hasEnv ? { ...inlineEnv } : {}
            });
            const nextConfig = {
              transport: "stdio",
              command: config.command,
              args: config.args,
              cwd: config.cwd,
              authenticationTemplate: hasEnv ? [{ slug: STDIO_ENV_TEMPLATE, kind: "stdio_env", vars: envVars }] : [{ slug: "none", kind: "none" }]
            };
            yield* ctx.core.integrations.update(integration.slug, { config: nextConfig });
          }).pipe(
            Effect_exports.catch(
              (cause) => Effect_exports.logWarning(
                `mcp: failed healing stdio connection for "${integration.slug}"`,
                cause
              )
            ),
            Effect_exports.withSpan("mcp.plugin.reconcile_stdio_connection", {
              attributes: { "mcp.integration.slug": String(integration.slug) }
            })
          );
        }
      }).pipe(Effect_exports.withSpan("mcp.plugin.reconcile_stdio_connections"));
      const removeServer = (slug) => Effect_exports.gen(function* () {
        const integration = slugFrom(slug);
        const record = yield* ctx.core.integrations.get(integration);
        const config = record ? parseMcpIntegrationConfig(record.config) : null;
        const legacyCandidates = legacyOAuthClientSlugCandidates(slug, record);
        const connections = yield* ctx.connections.list({ integration });
        const allConnections = yield* ctx.connections.list();
        const oauthClientSummaries = yield* ctx.oauth.listClients();
        const usedElsewhere = new Set(
          allConnections.filter((connection) => String(connection.integration) !== String(integration)).flatMap(
            (connection) => connection.oauthClient == null ? [] : [
              oauthClientKey(
                connection.oauthClientOwner ?? connection.owner,
                connection.oauthClient
              )
            ]
          )
        );
        const oauthClientsByKey = new Map(
          oauthClientSummaries.map((client) => [
            oauthClientKey(client.owner, client.slug),
            client
          ])
        );
        const clientsToRemove = /* @__PURE__ */ new Map();
        for (const connection of connections) {
          if (connection.oauthClient == null) continue;
          const owner = connection.oauthClientOwner ?? connection.owner;
          const key = oauthClientKey(owner, connection.oauthClient);
          const client = oauthClientsByKey.get(key);
          if (client?.origin.kind !== "dynamic_client_registration") continue;
          clientsToRemove.set(key, {
            owner,
            slug: connection.oauthClient
          });
        }
        for (const client of oauthClientSummaries) {
          const key = oauthClientKey(client.owner, client.slug);
          if (usedElsewhere.has(key)) continue;
          if (client.origin.kind === "dynamic_client_registration" && (client.origin.integration == null || String(client.origin.integration) === slug)) {
            clientsToRemove.set(key, { owner: client.owner, slug: client.slug });
            continue;
          }
          if (legacyMcpClientMatches(client, legacyCandidates, config)) {
            clientsToRemove.set(key, { owner: client.owner, slug: client.slug });
          }
        }
        yield* ctx.core.integrations.remove(integration).pipe(Effect_exports.catchTag("IntegrationRemovalNotAllowedError", () => Effect_exports.void));
        yield* Effect_exports.forEach(
          clientsToRemove.values(),
          (client) => ctx.oauth.removeClient(client.owner, client.slug),
          { discard: true }
        );
      }).pipe(
        Effect_exports.withSpan("mcp.plugin.remove_server", {
          attributes: { "mcp.integration.slug": slug }
        })
      );
      const getServer = (slug) => ctx.core.integrations.get(slugFrom(slug)).pipe(
        Effect_exports.withSpan("mcp.plugin.get_server", {
          attributes: { "mcp.integration.slug": slug }
        })
      );
      const configureServer = (slug, config) => ctx.core.integrations.update(slugFrom(slug), { config }).pipe(
        Effect_exports.withSpan("mcp.plugin.configure_server", {
          attributes: { "mcp.integration.slug": slug }
        })
      );
      const configureAuth = (slug, input) => Effect_exports.gen(function* () {
        const record = yield* ctx.core.integrations.get(slugFrom(slug));
        const current = record ? parseMcpIntegrationConfig(record.config) : null;
        if (!current || current.transport === "stdio") {
          return [];
        }
        const merged = input.mode === "replace" ? normalizeMcpAuthMethods(input.authenticationTemplate) : mergeAuthTemplates(
          current.authenticationTemplate,
          expandMcpAuthMethodInputs(
            input.authenticationTemplate
          )
        );
        yield* ctx.core.integrations.update(slugFrom(slug), {
          config: { ...current, authenticationTemplate: merged }
        });
        return merged;
      }).pipe(
        Effect_exports.withSpan("mcp.plugin.configure_auth", {
          attributes: { "mcp.integration.slug": slug }
        })
      );
      return {
        probeEndpoint,
        addServer,
        removeServer,
        reconcileStdioConnections,
        getServer,
        configureServer,
        configureAuth
      };
    },
    // -----------------------------------------------------------------------
    // Per-connection tool production. Dial the server using the connection's
    // resolved value (rendered through the integration's auth template) and
    // list its tools (following `nextCursor` pagination). The real MCP tool
    // name + upstream annotations are stamped into each ToolDef's annotations
    // so invokeTool can recover them. Discovery failures (auth not ready,
    // server down) yield an `incomplete` empty result rather than failing —
    // the connection still lands, and core keeps any previously persisted
    // catalog instead of wiping it over a transient outage.
    // -----------------------------------------------------------------------
    resolveTools: ({ config, connection, template, getValues, httpClientLayer }) => Effect_exports.gen(function* () {
      const parsed = parseMcpIntegrationConfig(config);
      if (!parsed) return { tools: [], incomplete: true };
      const values = yield* getValues().pipe(
        Effect_exports.orElseSucceed(() => ({}))
      );
      const built = yield* buildConnectorInput(
        parsed,
        values,
        template === null ? null : String(template),
        allowStdio,
        httpClientLayer
      ).pipe(
        Effect_exports.map((ci) => createMcpConnector(ci)),
        Effect_exports.result
      );
      const manifest = Result_exports.isSuccess(built) ? yield* discoverTools(built.success).pipe(
        Effect_exports.map((m) => ({ ok: true, manifest: m })),
        Effect_exports.catch(() => Effect_exports.succeed({ ok: false, manifest: null })),
        Effect_exports.withSpan("mcp.plugin.discover_tools", {
          attributes: { "mcp.connection.name": String(connection.name) }
        })
      ) : { ok: false, manifest: null };
      if (!manifest.ok || !manifest.manifest) {
        return { tools: [], incomplete: true };
      }
      return { tools: manifest.manifest.tools.map(toToolDef) };
    }).pipe(
      Effect_exports.withSpan("mcp.plugin.resolve_tools", {
        attributes: { "mcp.connection.name": String(connection.name) }
      })
    ),
    invokeTool: ({ ctx, toolRow, credential, args, elicit }) => Effect_exports.gen(function* () {
      const parsed = parseMcpIntegrationConfig(credential.config);
      if (!parsed) {
        return yield* new McpConnectionError({
          transport: "auto",
          message: `MCP integration "${toolRow.integration}" has no usable config`
        });
      }
      const stamp = readStamp(toolRow.annotations);
      if (!stamp) {
        return yield* new McpToolDiscoveryError({
          stage: "list_tools",
          message: `Tool "${toolRow.name}" is missing its MCP binding \u2014 refresh the connection`
        });
      }
      const transport = parsed.transport === "stdio" ? "stdio" : parsed.remoteTransport ?? "auto";
      if (parsed.transport === "remote") {
        const method = selectAuthMethod(parsed, String(credential.template));
        if (method?.kind === "apikey") {
          const missing = requiredPlacementVariables(method.placements).filter(
            (variable2) => credential.values[variable2] == null
          );
          if (missing.length > 0) {
            return authToolFailure({
              code: "connection_value_missing",
              message: `Connection has no resolvable credential value for input(s): ${missing.join(", ")}. Re-create the connection with the required value(s).`,
              integration: { id: String(credential.integration) },
              credential: { kind: "upstream", label: String(credential.connection) }
            });
          }
        }
      }
      const connector = yield* buildConnectorInput(
        parsed,
        credential.values,
        String(credential.template),
        allowStdio,
        options?.httpClientLayer ?? ctx.httpClientLayer
      ).pipe(Effect_exports.map((ci) => createMcpConnector(ci)));
      const connectionRef = {
        owner: credential.owner,
        integration: credential.integration,
        name: credential.connection
      };
      let toolListChanged = false;
      const raw = yield* invokeMcpTool({
        toolId: String(toolRow.name),
        toolName: stamp.toolName,
        args,
        transport,
        connector,
        elicit,
        onToolListChanged: () => {
          toolListChanged = true;
        }
      }).pipe(
        Effect_exports.onExit(
          () => toolListChanged ? ctx.connections.markToolsStale(connectionRef).pipe(Effect_exports.ignore) : Effect_exports.void
        )
      );
      const envelope = Option_exports.getOrUndefined(decodeMcpToolCallEnvelope(raw));
      if (envelope?.isError === true) {
        const errorMessage = extractMcpErrorMessage(envelope.content);
        if (isUnknownToolMessage(errorMessage, stamp.toolName)) {
          return yield* ctx.connections.markToolsStale(connectionRef).pipe(Effect_exports.ignore, Effect_exports.as(unknownToolFailure(String(toolRow.name), credential)));
        }
        return ToolResult.fail({
          code: "mcp_tool_error",
          message: errorMessage,
          details: { content: envelope.content }
        });
      }
      return ToolResult.ok(raw);
    }).pipe(
      Effect_exports.catchTag(
        "McpOAuthReauthorizationRequired",
        () => Effect_exports.succeed(
          mcpInvocationOAuthReauthFailure({
            integration: String(credential.integration),
            connection: String(credential.connection)
          })
        )
      ),
      Effect_exports.catchTag("McpConnectionError", (error) => {
        if (error.httpStatus === 401 || error.httpStatus === 403) {
          return Effect_exports.succeed(
            mcpInvocationAuthFailure({
              status: error.httpStatus,
              integration: String(credential.integration),
              connection: String(credential.connection)
            })
          );
        }
        return Effect_exports.succeed(
          authToolFailure({
            code: "connection_rejected",
            message: error.message,
            integration: { id: String(credential.integration) },
            credential: { kind: "upstream", label: String(credential.connection) }
          })
        );
      }),
      Effect_exports.catchTag("McpInvocationError", (error) => {
        if (error.status === 401 || error.status === 403) {
          return Effect_exports.succeed(
            mcpInvocationAuthFailure({
              status: error.status,
              integration: String(credential.integration),
              connection: String(credential.connection)
            })
          );
        }
        if (error.unknownTool === true) {
          return ctx.connections.markToolsStale({
            owner: credential.owner,
            integration: credential.integration,
            name: credential.connection
          }).pipe(Effect_exports.ignore, Effect_exports.as(unknownToolFailure(String(toolRow.name), credential)));
        }
        return Effect_exports.fail(error);
      }),
      Effect_exports.withSpan("mcp.plugin.invoke_tool", {
        attributes: {
          "mcp.tool.name": String(toolRow.name),
          "mcp.integration.slug": String(toolRow.integration)
        }
      })
    ),
    detect: ({ ctx, url }) => Effect_exports.gen(function* () {
      const httpClientLayer = options?.httpClientLayer ?? ctx.httpClientLayer;
      const trimmed = url.trim();
      if (!trimmed) return null;
      const parsed = yield* Effect_exports.try({
        try: () => new URL(trimmed),
        catch: (cause) => cause
      }).pipe(Effect_exports.option);
      if (Option_exports.isNone(parsed)) return null;
      const name = parsed.value.hostname || "mcp";
      const slug = deriveMcpNamespace({ endpoint: trimmed });
      const connector = createMcpConnector({
        transport: "remote",
        endpoint: trimmed,
        httpClientLayer
      });
      const connected = yield* discoverTools(connector).pipe(
        Effect_exports.map(() => true),
        Effect_exports.catch(() => Effect_exports.succeed(false)),
        Effect_exports.withSpan("mcp.plugin.discover_tools")
      );
      if (connected) {
        return {
          kind: MCP_PLUGIN_ID,
          confidence: "high",
          endpoint: trimmed,
          name,
          slug
        };
      }
      const shape = yield* probeMcpEndpointShape(trimmed, { httpClientLayer });
      if (shape.kind === "mcp") {
        return {
          kind: MCP_PLUGIN_ID,
          confidence: "high",
          endpoint: trimmed,
          name,
          slug
        };
      }
      if (urlMatchesToken(parsed.value, "mcp")) {
        return {
          kind: MCP_PLUGIN_ID,
          confidence: "low",
          endpoint: trimmed,
          name,
          slug
        };
      }
      return null;
    }).pipe(
      Effect_exports.catch(() => Effect_exports.succeed(null)),
      Effect_exports.withSpan("mcp.plugin.detect", {
        attributes: { "mcp.endpoint": url }
      })
    ),
    // Honour upstream destructiveHint from MCP ToolAnnotations using the stamp
    // persisted in each tool row's annotations.
    resolveAnnotations: ({ toolRows }) => Effect_exports.sync(() => {
      const out = {};
      for (const row of toolRows) {
        const stamp = readStamp(row.annotations);
        const ann = stamp?.upstream;
        if (ann?.destructiveHint === true) {
          out[String(row.name)] = {
            requiresApproval: true,
            approvalDescription: ann.title ?? stamp?.toolName ?? String(row.name)
          };
        } else {
          out[String(row.name)] = { requiresApproval: false };
        }
      }
      return out;
    }),
    // Liveness-only health check. MCP has no usable identity source (no
    // id_token/userinfo, no standard whoami), so this answers "is this
    // credential still alive?" by dialing the server and listing tools (the same
    // path resolveTools uses); identity stays the user-supplied connection label.
    // Only checkHealth is implemented (no candidates/describe/set), so the
    // operation/identity editor stays hidden while the status dot + "Check now"
    // light up.
    checkHealth: ({ ctx, credential }) => Effect_exports.gen(function* () {
      const parsed = parseMcpIntegrationConfig(credential.config);
      if (!parsed) {
        return { status: "unknown", checkedAt: Date.now() };
      }
      const connector = yield* buildConnectorInput(
        parsed,
        credential.values,
        credential.template === null ? null : String(credential.template),
        allowStdio,
        options?.httpClientLayer ?? ctx.httpClientLayer
      ).pipe(Effect_exports.map((ci) => createMcpConnector(ci)));
      return yield* discoverTools(connector).pipe(
        Effect_exports.map(
          () => ({ status: "healthy", checkedAt: Date.now() })
        ),
        Effect_exports.catchTag(
          "McpToolDiscoveryError",
          (error) => Effect_exports.succeed({
            status: mcpLivenessFailureStatus(error),
            checkedAt: Date.now(),
            ...error.httpStatus !== void 0 ? { httpStatus: error.httpStatus } : {},
            detail: error.message
          })
        )
      );
    }).pipe(
      // buildConnectorInput rejects (e.g. stdio disabled / missing config).
      Effect_exports.catchTag(
        "McpConnectionError",
        (error) => Effect_exports.succeed({
          status: mcpLivenessFailureStatus(error),
          checkedAt: Date.now(),
          ...error.httpStatus !== void 0 ? { httpStatus: error.httpStatus } : {},
          detail: error.message
        })
      ),
      Effect_exports.withSpan("mcp.plugin.check_health")
    ),
    describeAuthMethods: describeMcpAuthMethods,
    describeIntegrationDisplay: describeMcpIntegrationDisplay,
    integrationConfigure: {
      type: "mcp",
      configure: ({ ctx, integration, config }) => Effect_exports.gen(function* () {
        const next = parseMcpIntegrationConfig(config);
        if (!next) return;
        yield* ctx.core.integrations.update(integration, { config: next });
      })
    },
    staticIntegrations: (self) => [
      {
        id: "mcp",
        kind: "executor",
        name: "MCP",
        tools: [
          tool({
            name: "probeEndpoint",
            description: "Probe a remote MCP endpoint before adding it. If the result requires OAuth, run the core OAuth handoff (`oauth.probe`, `oauth.start`) to mint a connection; otherwise create a connection with `connections.create` carrying the API key or header value.",
            inputSchema: McpProbeEndpointInputStandardSchema,
            outputSchema: McpProbeEndpointOutputStandardSchema,
            execute: (input) => self.probeEndpoint(input).pipe(
              Effect_exports.map(ToolResult.ok),
              Effect_exports.catchTag(
                "McpConnectionError",
                ({ message, transport }) => Effect_exports.succeed(mcpToolFailure("mcp_connection_failed", message, { transport }))
              )
            )
          }),
          tool({
            name: "getServer",
            description: "Inspect a registered MCP integration, including transport, endpoint/command, and auth template. Use this before creating a connection (`connections.create` / `oauth.start`).",
            inputSchema: McpGetServerInputStandardSchema,
            outputSchema: McpGetServerOutputStandardSchema,
            execute: (input) => {
              const args = input;
              return Effect_exports.map(
                self.getServer(args.slug),
                (integration) => ToolResult.ok({ integration })
              );
            }
          }),
          tool({
            name: "addServer",
            description: "Register an MCP server in the catalog as an integration. Returns its `slug`. Then create a connection against it: for header/API-key auth call `connections.create` with the value; for OAuth-protected servers run `oauth.probe` + `oauth.start`. Tools are produced per-connection at connection create / refresh.",
            annotations: {
              requiresApproval: true,
              approvalDescription: "Add an MCP server"
            },
            inputSchema: McpAddServerInputStandardSchema,
            outputSchema: McpAddServerOutputStandardSchema,
            execute: (rawInput) => {
              const input = rawInput;
              return self.addServer(input).pipe(
                Effect_exports.map(ToolResult.ok),
                Effect_exports.catchTag(
                  "IntegrationAlreadyExistsError",
                  ({ slug }) => Effect_exports.succeed(
                    mcpToolFailure(
                      "integration_already_exists",
                      `Integration ${slug} already exists; update it instead of re-adding.`
                    )
                  )
                )
              );
            }
          })
        ]
      }
    ]
  };
});

export {
  McpConnectionError,
  McpToolDiscoveryError,
  McpAuthMethod,
  McpAuthShorthand,
  McpAuthMethodInput,
  McpIntegrationConfig,
  parseMcpIntegrationConfig,
  mcpPlugin
};
