import {
  toJSONSchema
} from "./chunk-C6PYLKD6.js";
import {
  AuthTemplateSlug,
  ConnectionAddress,
  ConnectionName,
  ConnectionNotFoundError,
  CredentialProviderNotRegisteredError,
  ElicitationId,
  FormElicitation,
  HealthCheckCandidate,
  HealthCheckResult,
  HealthCheckSpec,
  IntegrationAlreadyExistsError,
  IntegrationDetectionResult,
  IntegrationNotFoundError,
  IntegrationRemovalNotAllowedError,
  IntegrationSlug,
  InternalError,
  InvalidConnectionInputError,
  OAuthClientSlug,
  OAuthCompleteError,
  OAuthProbeError,
  OAuthRegisterDynamicError,
  OAuthSessionNotFoundError,
  OAuthStartError,
  OAuthState,
  Owner,
  PolicyId,
  ProviderItemId,
  ProviderKey,
  StorageError,
  ToolAddress,
  ToolName,
  ToolNotFoundError,
  ToolPolicyActionSchema,
  ToolResult,
  ToolSchemaView,
  UrlElicitation,
  authToolFailure,
  classifyHttpStatus,
  definePlugin,
  mergeAuthTemplates,
  tool
} from "./chunk-QEPUABPQ.js";
import "./chunk-4VNS5WPM.js";

// ../../plugins/mcp/src/sdk/plugin.ts
import { Effect as Effect6, Option as Option7, Result, Schema as Schema10 } from "effect";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";

// ../sdk/src/http-auth/auth-method.ts
import { Schema } from "effect";
var TOKEN_VARIABLE = "token";
var AuthCarrier = Schema.Literals(["header", "query"]);
var AuthPlacement = Schema.Struct({
  carrier: AuthCarrier,
  /** Header name (e.g. `Authorization`) or query-param name (e.g. `token`). */
  name: Schema.String,
  /** Literal prepended to the credential value, e.g. `Bearer `. */
  prefix: Schema.optional(Schema.String),
  /** The credential input this placement renders from. Absent ⇒ `token`. */
  variable: Schema.optional(Schema.String),
  /** Render this exact value instead of a credential. */
  literal: Schema.optional(Schema.String)
});
var ApiKeyAuthMethod = Schema.Struct({
  slug: Schema.String,
  kind: Schema.Literal("apikey"),
  /** Display label; derived from the first placement when absent. */
  label: Schema.optional(Schema.String),
  placements: Schema.Array(AuthPlacement)
});
var NoneAuthMethod = Schema.Struct({
  slug: Schema.String,
  kind: Schema.Literal("none")
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
import { Schema as Schema2 } from "effect";
var VariablePart = Schema2.Struct({
  type: Schema2.Literal("variable"),
  name: Schema2.String
});
var isVariablePart = (part) => typeof part !== "string";
var AuthTemplateValue = Schema2.Union([
  Schema2.String,
  Schema2.Array(Schema2.Union([Schema2.String, VariablePart])).check(
    Schema2.makeFilter((parts) => {
      const variableIndexes = parts.flatMap((part, index) => isVariablePart(part) ? [index] : []);
      if (variableIndexes.length > 1 || variableIndexes.length === 1 && variableIndexes[0] !== parts.length - 1) {
        return "a template value renders at most ONE variable, as the FINAL part \u2014 split extra variables/suffixes into separate header or query entries";
      }
      return void 0;
    })
  )
]);
var ApiKeyAuthTemplate = Schema2.Struct({
  slug: Schema2.optional(Schema2.String),
  type: Schema2.Literal("apiKey"),
  label: Schema2.optional(Schema2.String),
  headers: Schema2.optional(Schema2.Record(Schema2.String, AuthTemplateValue)),
  queryParams: Schema2.optional(Schema2.Record(Schema2.String, AuthTemplateValue))
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
import { Schema as Schema3 } from "effect";
var LegacyVariablePart = Schema3.Struct({
  type: Schema3.Literal("variable"),
  name: Schema3.String
});
var LegacyTemplateValue = Schema3.Union([
  Schema3.String,
  Schema3.Array(Schema3.Union([Schema3.String, LegacyVariablePart]))
]);
var LegacyApiKeyTemplate = Schema3.Struct({
  slug: Schema3.String,
  type: Schema3.Literal("apiKey"),
  headers: Schema3.optional(Schema3.Record(Schema3.String, LegacyTemplateValue)),
  queryParams: Schema3.optional(Schema3.Record(Schema3.String, LegacyTemplateValue))
});
var decodeLegacyApiKeyTemplate = Schema3.decodeUnknownOption(LegacyApiKeyTemplate);

// ../../plugins/mcp/src/sdk/connection.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { CfWorkerJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/cfworker";
import { Effect, Predicate, Stream } from "effect";
import { HttpClient, HttpClientRequest } from "effect/unstable/http";

// ../../plugins/mcp/src/sdk/errors.ts
import { Data, Schema as Schema4 } from "effect";
var McpConnectionError = class extends Schema4.TaggedErrorClass()(
  "McpConnectionError",
  {
    transport: Schema4.String,
    message: Schema4.String,
    /** HTTP status the handshake observed (e.g. 401 on an auth wall), when the
     *  transport surfaced one. Structural, so the liveness classifier and the
     *  auto-transport fallback never string-match the message. */
    httpStatus: Schema4.optional(Schema4.Number)
  },
  { httpApiStatus: 400 }
) {
};
var McpToolDiscoveryError = class extends Schema4.TaggedErrorClass()(
  "McpToolDiscoveryError",
  {
    stage: Schema4.Literals(["connect", "list_tools"]),
    message: Schema4.String,
    /** HTTP status from the underlying connect failure, when known. */
    httpStatus: Schema4.optional(Schema4.Number)
  },
  { httpApiStatus: 400 }
) {
};
var McpInvocationError = class extends Data.TaggedError("McpInvocationError") {
};
var McpOAuthReauthorizationRequired = class extends Data.TaggedError(
  "McpOAuthReauthorizationRequired"
) {
};
var McpOAuthError = class extends Schema4.TaggedErrorClass()(
  "McpOAuthError",
  {
    message: Schema4.String
  },
  { httpApiStatus: 400 }
) {
};

// ../../plugins/mcp/src/sdk/http-status.ts
import { Option, Schema as Schema5 } from "effect";
import { StreamableHTTPError } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
var SsePostErrorCause = Schema5.Struct({ message: Schema5.String });
var decodeSsePostErrorCause = Schema5.decodeUnknownOption(SsePostErrorCause);
var statusFromSsePostError = (cause) => Option.match(decodeSsePostErrorCause(cause), {
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
  if (typeof body === "string") return HttpClientRequest.bodyText(request, body, contentType);
  if (body instanceof URLSearchParams) {
    return HttpClientRequest.bodyText(
      request,
      body.toString(),
      contentType ?? "application/x-www-form-urlencoded;charset=UTF-8"
    );
  }
  if (body instanceof Uint8Array)
    return HttpClientRequest.bodyUint8Array(request, body, contentType);
  if (body instanceof ArrayBuffer) {
    return HttpClientRequest.bodyUint8Array(request, new Uint8Array(body), contentType);
  }
  const bytes = new Uint8Array(await new Response(body).arrayBuffer());
  return HttpClientRequest.bodyUint8Array(request, bytes, contentType);
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
    const requestWithoutBody = HttpClientRequest.make(httpMethodFrom(init?.method))(url, {
      headers: recordFromHeaders(headers)
    });
    const request = await applyBody(requestWithoutBody, headers, init?.body);
    const effect = Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;
      const response = yield* client.execute(request);
      const responseHeaders = new Headers();
      for (const [key, value] of Object.entries(response.headers)) {
        if (value !== void 0) responseHeaders.set(key, value);
      }
      const body = response.status === 204 || response.status === 205 || response.status === 304 ? null : Stream.toReadableStream(response.stream);
      return new Response(body, {
        status: response.status,
        headers: responseHeaders
      });
    }).pipe(Effect.provide(httpClientLayer));
    const promise = Effect.runPromise(effect);
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
  if (Predicate.isTagged(cause, "McpOAuthReauthorizationRequired")) {
    return new McpOAuthReauthorizationRequired({ message: "MCP OAuth re-authorization required" });
  }
  const status = httpStatusFromCause(cause);
  return new McpConnectionError({
    transport,
    message: status === void 0 ? message : `${message} (HTTP ${status})`,
    ...status === void 0 ? {} : { httpStatus: status }
  });
};
var connectClient = (input) => Effect.gen(function* () {
  const client = createClient();
  const transportInstance = input.createTransport();
  yield* Effect.tryPromise({
    try: () => client.connect(transportInstance),
    catch: (cause) => connectionFailure(input.transport, `Failed connecting via ${input.transport}`, cause)
  }).pipe(
    Effect.withSpan("plugin.mcp.connection.handshake", {
      attributes: { "plugin.mcp.transport": input.transport }
    })
  );
  return connectionFromClient(client);
});
var createMcpConnector = (input) => {
  if (input.transport === "stdio") {
    const command = input.command.trim();
    if (!command) {
      return Effect.fail(
        new McpConnectionError({
          transport: "stdio",
          message: "MCP stdio transport requires a command"
        })
      );
    }
    return Effect.gen(function* () {
      const { createStdioTransport } = yield* Effect.tryPromise({
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
    Effect.catch((error) => {
      if (Predicate.isTagged(error, "McpOAuthReauthorizationRequired")) return Effect.fail(error);
      if (error.httpStatus === 401 || error.httpStatus === 403) return Effect.fail(error);
      return connectSse;
    })
  );
};

// ../../plugins/mcp/src/sdk/discover.ts
import { Duration, Effect as Effect3, Option as Option4, Predicate as Predicate2 } from "effect";

// ../../plugins/mcp/src/sdk/manifest.ts
import { Option as Option3, Schema as Schema7 } from "effect";

// ../../plugins/mcp/src/sdk/types.ts
import { Effect as Effect2, Option as Option2, Schema as Schema6 } from "effect";
var McpRemoteTransport = Schema6.Literals(["streamable-http", "sse", "auto"]);
var McpTransport = Schema6.Literals(["streamable-http", "sse", "stdio", "auto"]);
var McpOAuthMethod = Schema6.Struct({
  slug: Schema6.String,
  kind: Schema6.Literal("oauth2")
});
var McpStdioEnvMethod = Schema6.Struct({
  slug: Schema6.String,
  kind: Schema6.Literal("stdio_env"),
  vars: Schema6.Array(Schema6.String)
});
var McpAuthMethod = Schema6.Union([
  NoneAuthMethod,
  ApiKeyAuthMethod,
  McpOAuthMethod,
  McpStdioEnvMethod
]);
var McpAuthShorthand = Schema6.Union([
  Schema6.Struct({ kind: Schema6.Literal("none") }),
  Schema6.Struct({
    kind: Schema6.Literal("header"),
    headerName: Schema6.String,
    prefix: Schema6.optional(Schema6.String)
  }),
  Schema6.Struct({ kind: Schema6.Literal("oauth2") })
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
var McpAuthMethodInput = Schema6.Union([
  Schema6.Struct({ slug: Schema6.optional(Schema6.String), kind: Schema6.Literal("none") }),
  Schema6.Struct({ slug: Schema6.optional(Schema6.String), kind: Schema6.Literal("oauth2") }),
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
var StringMap = Schema6.Record(Schema6.String, Schema6.String);
var McpRemoteIntegrationConfig = Schema6.Struct({
  transport: Schema6.Literal("remote"),
  /** The MCP server endpoint URL */
  endpoint: Schema6.String,
  /** Transport preference for this remote server */
  remoteTransport: McpRemoteTransport.pipe(
    Schema6.optionalKey,
    Schema6.withConstructorDefault(Effect2.succeed("auto"))
  ),
  /** Static query params appended to the endpoint URL (non-credential) */
  queryParams: Schema6.optional(StringMap),
  /** Static headers sent on every request (non-credential) */
  headers: Schema6.optional(StringMap),
  /** Declared auth methods — how a connection's values are rendered onto
   *  requests. A connection's `template` picks one by slug. */
  authenticationTemplate: Schema6.Array(McpAuthMethod)
});
var McpStdioIntegrationConfig = Schema6.Struct({
  transport: Schema6.Literal("stdio"),
  /** The command to run */
  command: Schema6.String,
  /** Arguments to the command */
  args: Schema6.optional(Schema6.Array(Schema6.String)),
  /** Static, non-credential environment variables injected verbatim into the
   *  subprocess. Secret env (API keys / tokens) is NOT stored here — it is
   *  declared as a `stdio_env` method in `authenticationTemplate` and its
   *  values live on the connection. Optional + legacy: pre-revamp stdio
   *  integrations stored their (then-plaintext) env here, so it stays
   *  decodable. */
  env: Schema6.optional(StringMap),
  /** Working directory */
  cwd: Schema6.optional(Schema6.String),
  /** Declared auth methods — a single `stdio_env` method naming the secret env
   *  vars, or `none`. A connection's `template` picks one by slug, exactly as
   *  for remote servers. Optional so pre-revamp stdio configs (which had no
   *  methods) still decode; absence is treated as no declared secret env. */
  authenticationTemplate: Schema6.optional(Schema6.Array(McpAuthMethod))
});
var McpIntegrationConfig = Schema6.Union([
  McpRemoteIntegrationConfig,
  McpStdioIntegrationConfig
]);
var decodeIntegrationConfig = Schema6.decodeUnknownOption(McpIntegrationConfig);
var parseMcpIntegrationConfig = (config) => Option2.getOrNull(decodeIntegrationConfig(config));
var McpToolAnnotations = Schema6.Struct({
  title: Schema6.optional(Schema6.String),
  readOnlyHint: Schema6.optional(Schema6.Boolean),
  destructiveHint: Schema6.optional(Schema6.Boolean),
  idempotentHint: Schema6.optional(Schema6.Boolean),
  openWorldHint: Schema6.optional(Schema6.Boolean)
});
var McpToolBinding = Schema6.Struct({
  /** Sanitized, address-safe tool name (the `<tool>` address segment). */
  toolId: Schema6.String,
  /** The real MCP tool name as advertised by the server. */
  toolName: Schema6.String,
  description: Schema6.NullOr(Schema6.String),
  inputSchema: Schema6.optional(Schema6.Unknown),
  outputSchema: Schema6.optional(Schema6.Unknown),
  annotations: Schema6.optional(McpToolAnnotations)
});

// ../../plugins/mcp/src/sdk/manifest.ts
var ListedTool = Schema7.Struct({
  name: Schema7.String,
  description: Schema7.optional(Schema7.NullOr(Schema7.String)),
  inputSchema: Schema7.optional(Schema7.Unknown),
  parameters: Schema7.optional(Schema7.Unknown),
  outputSchema: Schema7.optional(Schema7.Unknown),
  annotations: Schema7.optional(McpToolAnnotations)
});
var ListToolsResult = Schema7.Struct({
  tools: Schema7.Array(ListedTool)
});
var ListToolsPage = Schema7.Struct({
  tools: Schema7.Array(Schema7.Unknown),
  nextCursor: Schema7.optional(Schema7.NullOr(Schema7.String))
});
var ServerInfo = Schema7.Struct({
  name: Schema7.optional(Schema7.String),
  version: Schema7.optional(Schema7.String)
});
var decodeListToolsResult = Schema7.decodeUnknownOption(ListToolsResult);
var decodeListToolsPageOption = Schema7.decodeUnknownOption(ListToolsPage);
var decodeServerInfo = Schema7.decodeUnknownOption(ServerInfo);
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
    Option3.map((result) => result.tools),
    Option3.getOrElse(() => [])
  );
  const server = decodeServerInfo(metadata?.serverInfo).pipe(
    Option3.map(
      (info) => ({
        name: info.name ?? null,
        version: info.version ?? null,
        instructions: metadata?.instructions ?? null
      })
    ),
    Option3.getOrNull
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
var basenameOf = (path2) => path2.trim().split(/[\\/]/).pop() ?? path2.trim();
var deriveMcpNamespace = (input) => {
  if (input.name?.trim()) return slugify(input.name) || "mcp";
  const fromEndpoint = input.endpoint?.trim() ? hostnameOf(input.endpoint) : null;
  if (fromEndpoint) return slugify(fromEndpoint) || "mcp";
  if (input.command?.trim()) return slugify(basenameOf(input.command)) || "mcp";
  return "mcp";
};

// ../../plugins/mcp/src/sdk/discover.ts
var MAX_LIST_TOOLS_PAGES = 100;
var DEFAULT_DISCOVER_TIMEOUT = Duration.seconds(15);
var listAllTools = (connection) => Effect3.gen(function* () {
  const tools = [];
  let cursor = void 0;
  for (let page = 0; page < MAX_LIST_TOOLS_PAGES; page++) {
    const params = cursor === void 0 ? void 0 : { cursor };
    const listResult = yield* Effect3.tryPromise({
      try: () => connection.client.listTools(params),
      catch: () => new McpToolDiscoveryError({
        stage: "list_tools",
        message: "Failed listing MCP tools"
      })
    });
    const decoded = decodeListToolsPage(listResult);
    if (Option4.isNone(decoded)) {
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
var discoverTools = (connector, timeoutMs = Duration.toMillis(DEFAULT_DISCOVER_TIMEOUT)) => Effect3.gen(function* () {
  const connection = yield* connector.pipe(
    Effect3.mapError((failure) => {
      const httpStatus = Predicate2.isTagged(failure, "McpConnectionError") ? failure.httpStatus : void 0;
      return new McpToolDiscoveryError({
        stage: "connect",
        message: `Failed connecting to MCP server: ${failure.message}`,
        ...httpStatus !== void 0 ? { httpStatus } : {}
      });
    })
  );
  const manifest = yield* listAllTools(connection).pipe(
    Effect3.onExit(() => closeConnection(connection))
  );
  return manifest;
}).pipe(
  Effect3.timeoutOrElse({
    duration: Duration.millis(timeoutMs),
    orElse: () => Effect3.fail(
      new McpToolDiscoveryError({
        stage: "connect",
        message: `MCP discovery timed out after ${timeoutMs}ms`
      })
    )
  })
);
var closeConnection = (connection) => Effect3.ignore(
  Effect3.tryPromise({
    try: () => connection.close(),
    catch: () => new McpToolDiscoveryError({
      stage: "list_tools",
      message: "Failed closing MCP connection"
    })
  })
);

// ../../plugins/mcp/src/sdk/invoke.ts
import { Cause, Effect as Effect4, Exit, Option as Option5, Predicate as Predicate3, Schema as Schema8 } from "effect";
import {
  ElicitRequestSchema,
  ErrorCode,
  McpError,
  ToolListChangedNotificationSchema
} from "@modelcontextprotocol/sdk/types.js";
var ArgsRecord = Schema8.Record(Schema8.String, Schema8.Unknown);
var decodeArgsRecord = Schema8.decodeUnknownOption(ArgsRecord);
var argsRecord = (value) => Option5.getOrElse(decodeArgsRecord(value), () => ({}));
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
var McpElicitParams = Schema8.Union([
  Schema8.Struct({
    mode: Schema8.Literal("url"),
    message: Schema8.String,
    url: Schema8.String,
    elicitationId: Schema8.optional(Schema8.String),
    id: Schema8.optional(Schema8.String)
  }),
  Schema8.Struct({
    mode: Schema8.optional(Schema8.Literal("form")),
    message: Schema8.String,
    requestedSchema: Schema8.Record(Schema8.String, Schema8.Unknown)
  })
]);
var decodeElicitParams = Schema8.decodeUnknownSync(McpElicitParams);
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
    const exit = await Effect4.runPromiseExit(elicit(req));
    if (Exit.isSuccess(exit)) {
      const response = exit.value;
      return {
        action: response.action,
        ...response.action === "accept" && response.content ? { content: response.content } : {}
      };
    }
    const failure = exit.cause.reasons.find(Cause.isFailReason);
    if (failure) {
      const err = failure.error;
      if (Predicate3.isTagged(err, "ElicitationDeclinedError")) {
        const action = Predicate3.hasProperty(err, "action") && err.action === "cancel" ? "cancel" : "decline";
        return { action };
      }
    }
    throw Cause.squash(exit.cause);
  });
};
var installToolListChangedHandler = (client, onToolListChanged) => {
  if (!onToolListChanged) return;
  client.setNotificationHandler(ToolListChangedNotificationSchema, () => {
    onToolListChanged();
  });
};
var useConnection = (connection, toolName, args, elicit, onToolListChanged) => Effect4.gen(function* () {
  installElicitationHandler(connection.client, elicit);
  installToolListChangedHandler(connection.client, onToolListChanged);
  return yield* Effect4.tryPromise({
    try: () => connection.client.callTool({ name: toolName, arguments: args }),
    catch: (cause) => {
      if (Predicate3.isTagged(cause, "McpOAuthReauthorizationRequired")) {
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
    Effect4.withSpan("plugin.mcp.client.call_tool", {
      attributes: { "mcp.tool.name": toolName }
    })
  );
});
var invokeMcpTool = (input) => Effect4.gen(function* () {
  const args = argsRecord(input.args);
  const connection = yield* Effect4.acquireRelease(
    input.connector.pipe(
      Effect4.withSpan("plugin.mcp.connection.acquire", {
        attributes: { "plugin.mcp.transport": input.transport }
      })
    ),
    (conn) => Effect4.ignore(
      Effect4.tryPromise({
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
  Effect4.scoped,
  Effect4.withSpan("plugin.mcp.invoke", {
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
import { Data as Data2, Duration as Duration2, Effect as Effect5, Option as Option6, Schema as Schema9 } from "effect";
import { FetchHttpClient, HttpClient as HttpClient2, HttpClientRequest as HttpClientRequest2 } from "effect/unstable/http";
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
var ProbeTransportError = class extends Data2.TaggedError("ProbeTransportError") {
};
var decodeJsonString = Schema9.decodeUnknownOption(Schema9.fromJsonString(Schema9.Unknown));
var asObject = (body) => {
  if (!body) return null;
  const parsed = decodeJsonString(body);
  if (Option6.isNone(parsed)) return null;
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
var ProtectedResourceMetadata = Schema9.Struct({
  resource: Schema9.String,
  authorization_servers: Schema9.Array(Schema9.String)
});
var decodeProtectedResourceMetadata = Schema9.decodeUnknownOption(
  Schema9.fromJsonString(ProtectedResourceMetadata)
);
var protectedResourceMetadataUrl = (endpoint) => {
  const path2 = endpoint.pathname === "/" ? "" : endpoint.pathname;
  return `${endpoint.origin}/.well-known/oauth-protected-resource${path2}`;
};
var resourceMatchesEndpoint = (resource, endpoint) => {
  if (!URL.canParse(resource)) return false;
  const parsed = new URL(resource);
  if (parsed.origin !== endpoint.origin) return false;
  const resourcePath = parsed.pathname.replace(/\/+$/, "");
  const endpointPath = endpoint.pathname.replace(/\/+$/, "");
  return endpointPath === resourcePath || endpointPath.startsWith(`${resourcePath}/`);
};
var probeProtectedResourceMetadata = (client, endpoint, timeoutMs) => Effect5.gen(function* () {
  const response = yield* client.execute(
    HttpClientRequest2.get(protectedResourceMetadataUrl(endpoint)).pipe(
      HttpClientRequest2.setHeader("accept", "application/json")
    )
  ).pipe(Effect5.timeout(Duration2.millis(timeoutMs)));
  if (response.status < 200 || response.status >= 300) return false;
  const body = yield* response.text.pipe(
    Effect5.timeout(Duration2.millis(timeoutMs)),
    Effect5.catch(() => Effect5.succeed(""))
  );
  const metadata = decodeProtectedResourceMetadata(body);
  if (Option6.isNone(metadata)) return false;
  if (metadata.value.authorization_servers.length === 0) return false;
  return resourceMatchesEndpoint(metadata.value.resource, endpoint);
}).pipe(Effect5.catch(() => Effect5.succeed(false)));
var ErrorMessageShape = Schema9.Struct({ message: Schema9.String });
var decodeErrorMessageShape = Schema9.decodeUnknownOption(ErrorMessageShape);
var reasonFromBoundaryCause = (cause) => {
  const messageShape = decodeErrorMessageShape(cause);
  if (Option6.isSome(messageShape)) return messageShape.value.message;
  if (typeof cause === "string") return cause;
  if (typeof cause === "number" || typeof cause === "boolean" || typeof cause === "bigint") {
    return `${cause}`;
  }
  if (typeof cause === "symbol") return cause.description ?? "symbol";
  if (cause === null) return "null";
  if (typeof cause === "undefined") return "undefined";
  return "fetch failed";
};
var probeMcpEndpointShape = (endpoint, options = {}) => Effect5.gen(function* () {
  const timeoutMs = options.timeoutMs ?? 8e3;
  const outcome = yield* Effect5.gen(function* () {
    const client = yield* HttpClient2.HttpClient;
    const readBody = (response) => response.text.pipe(
      Effect5.timeout(Duration2.millis(timeoutMs)),
      Effect5.catch(() => Effect5.succeed(""))
    );
    const classify = (response, method) => Effect5.gen(function* () {
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
    let postRequest = HttpClientRequest2.post(url.toString()).pipe(
      HttpClientRequest2.setHeader("content-type", "application/json"),
      HttpClientRequest2.setHeader("accept", "application/json, text/event-stream"),
      HttpClientRequest2.bodyText(INITIALIZE_BODY, "application/json")
    );
    for (const [name, value] of Object.entries(options.headers ?? {})) {
      postRequest = HttpClientRequest2.setHeader(postRequest, name, value);
    }
    const postResponse = yield* client.execute(postRequest).pipe(Effect5.timeout(Duration2.millis(timeoutMs)));
    const postResult = yield* classify(postResponse, "POST");
    if (postResult) return postResult;
    if ([404, 405, 406, 415].includes(postResponse.status)) {
      let getRequest = HttpClientRequest2.get(url.toString()).pipe(
        HttpClientRequest2.setHeader("accept", "text/event-stream")
      );
      for (const [name, value] of Object.entries(options.headers ?? {})) {
        getRequest = HttpClientRequest2.setHeader(getRequest, name, value);
      }
      const getResponse = yield* client.execute(getRequest).pipe(Effect5.timeout(Duration2.millis(timeoutMs)));
      const getResult = yield* classify(getResponse, "GET");
      if (getResult) return getResult;
    }
    return {
      kind: "not-mcp",
      category: "wrong-shape",
      reason: `unexpected status ${postResponse.status} for initialize`
    };
  }).pipe(
    Effect5.provide(options.httpClientLayer ?? FetchHttpClient.layer),
    Effect5.mapError(
      (cause) => new ProbeTransportError({
        reason: reasonFromBoundaryCause(cause),
        cause
      })
    ),
    Effect5.catch(
      (cause) => Effect5.succeed({
        kind: "unreachable",
        reason: cause.reason
      })
    )
  );
  return outcome;
}).pipe(Effect5.withSpan("mcp.plugin.probe_shape"));

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
var McpStampSchema = Schema10.Struct({
  toolName: Schema10.String,
  upstream: Schema10.optional(
    Schema10.Struct({
      title: Schema10.optional(Schema10.String),
      readOnlyHint: Schema10.optional(Schema10.Boolean),
      destructiveHint: Schema10.optional(Schema10.Boolean),
      idempotentHint: Schema10.optional(Schema10.Boolean),
      openWorldHint: Schema10.optional(Schema10.Boolean)
    })
  )
});
var AnnotationsWithStamp = Schema10.Struct({ mcp: McpStampSchema });
var decodeStamp = Schema10.decodeUnknownOption(AnnotationsWithStamp);
var readStamp = (annotations) => Option7.match(decodeStamp(annotations), {
  onNone: () => null,
  onSome: (decoded) => decoded.mcp
});
var McpRemoteServerInputSchema = Schema10.Struct({
  transport: Schema10.optional(Schema10.Literal("remote")),
  name: Schema10.String,
  /** Agent-visible catalog description. Defaults to the display name. */
  description: Schema10.optional(Schema10.String),
  endpoint: Schema10.String,
  remoteTransport: Schema10.optional(McpRemoteTransport),
  headers: Schema10.optional(Schema10.Record(Schema10.String, Schema10.String)),
  queryParams: Schema10.optional(Schema10.Record(Schema10.String, Schema10.String)),
  slug: Schema10.optional(Schema10.String),
  /** Declared auth methods a connection can be applied through. */
  authenticationTemplate: Schema10.optional(Schema10.Array(McpAuthMethodInput)),
  /** Single-method shorthand (legacy callers). Ignored when
   *  `authenticationTemplate` is present. Defaults to none. */
  auth: Schema10.optional(McpAuthShorthand)
});
var McpStdioServerInputSchema = Schema10.Struct({
  transport: Schema10.Literal("stdio"),
  name: Schema10.String,
  description: Schema10.optional(Schema10.String),
  command: Schema10.String,
  args: Schema10.optional(Schema10.Array(Schema10.String)),
  /** DECLARE the secret env vars this server needs, by NAME. Their values are
   *  supplied as the connection's secret credentials, not here — so the UI
   *  defines what env vars exist and the connect step provides the secrets. */
  envVars: Schema10.optional(Schema10.Array(Schema10.String)),
  /** Provide secret env values directly (programmatic / agent one-shot): the
   *  add then auto-creates the connection holding them. The UI uses `envVars`
   *  instead and leaves the values to the connect step. */
  env: Schema10.optional(Schema10.Record(Schema10.String, Schema10.String)),
  cwd: Schema10.optional(Schema10.String),
  slug: Schema10.optional(Schema10.String)
});
var McpAddServerInputSchema = Schema10.Union([
  McpRemoteServerInputSchema,
  McpStdioServerInputSchema
]);
var McpAddServerOutputSchema = Schema10.Struct({
  slug: Schema10.String
});
var McpConfigureAuthInputSchema = Schema10.Struct({
  authenticationTemplate: Schema10.Array(McpAuthMethodInput),
  mode: Schema10.optional(Schema10.Literals(["merge", "replace"]))
});
var McpProbeEndpointInputSchema = Schema10.Struct({
  endpoint: Schema10.String,
  headers: Schema10.optional(Schema10.Record(Schema10.String, Schema10.String)),
  queryParams: Schema10.optional(Schema10.Record(Schema10.String, Schema10.String))
});
var McpProbeEndpointOutputSchema = Schema10.Struct({
  connected: Schema10.Boolean,
  requiresAuthentication: Schema10.Boolean,
  requiresOAuth: Schema10.Boolean,
  supportsDynamicRegistration: Schema10.Boolean,
  name: Schema10.String,
  slug: Schema10.String,
  toolCount: Schema10.NullOr(Schema10.Number),
  serverName: Schema10.NullOr(Schema10.String),
  /** The server's `instructions` from initialize — prefill for the add form's
   *  description. Only available when the probe connected unauthenticated. */
  instructions: Schema10.NullOr(Schema10.String)
});
var McpGetServerInputSchema = Schema10.Struct({
  slug: Schema10.String
});
var McpGetServerOutputSchema = Schema10.Struct({
  integration: Schema10.NullOr(Schema10.Unknown)
});
var schemaToStaticToolSchema = (schema) => Schema10.toStandardSchemaV1(Schema10.toStandardJSONSchemaV1(schema));
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
var McpTextContent = Schema10.Struct({ type: Schema10.Literal("text"), text: Schema10.String });
var McpToolCallEnvelope = Schema10.Struct({
  isError: Schema10.optional(Schema10.Boolean),
  content: Schema10.optional(Schema10.Array(Schema10.Unknown))
});
var decodeMcpTextContent = Schema10.decodeUnknownOption(McpTextContent);
var decodeMcpToolCallEnvelope = Schema10.decodeUnknownOption(McpToolCallEnvelope);
var extractMcpErrorMessage = (content) => {
  if (Array.isArray(content)) {
    for (const item of content) {
      const decoded = Option7.getOrUndefined(decodeMcpTextContent(item));
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
      return Effect6.fail(
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
    return Effect6.succeed({
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
  return Effect6.succeed({
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
      const probeEndpoint = (input) => Effect6.gen(function* () {
        const endpoint = typeof input === "string" ? input : input.endpoint;
        const trimmed = endpoint.trim();
        if (!trimmed) {
          return yield* new McpConnectionError({
            transport: "remote",
            message: "Endpoint URL is required"
          });
        }
        const name = yield* Effect6.try({
          try: () => new URL(trimmed).hostname,
          catch: () => "mcp"
        }).pipe(Effect6.orElseSucceed(() => "mcp"));
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
          Effect6.map((m) => ({ ok: true, manifest: m })),
          Effect6.catch(() => Effect6.succeed({ ok: false, manifest: null })),
          Effect6.withSpan("mcp.plugin.discover_tools")
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
          Effect6.map((oauth) => ({ ok: true, oauth })),
          Effect6.catch(() => Effect6.succeed({ ok: false, oauth: null })),
          Effect6.withSpan("mcp.plugin.probe_oauth")
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
        Effect6.withSpan("mcp.plugin.probe_endpoint", {
          attributes: { "mcp.endpoint": typeof input === "string" ? input : input.endpoint }
        })
      );
      const addServer = (input) => Effect6.gen(function* () {
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
          Effect6.withSpan("mcp.plugin.register_integration", {
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
              Effect6.catchTags({
                IntegrationNotFoundError: (cause) => Effect6.fail(
                  new McpConnectionError({ transport: "stdio", message: cause.message })
                ),
                CredentialProviderNotRegisteredError: (cause) => Effect6.fail(
                  new McpConnectionError({ transport: "stdio", message: cause.message })
                ),
                InvalidConnectionInputError: (cause) => Effect6.fail(
                  new McpConnectionError({ transport: "stdio", message: cause.message })
                )
              }),
              Effect6.withSpan("mcp.plugin.bootstrap_stdio_connection", {
                attributes: { "mcp.integration.slug": slug }
              })
            );
          }
        }
        return { slug };
      }).pipe(
        Effect6.withSpan("mcp.plugin.add_server", {
          attributes: {
            "mcp.server.transport": input.transport ?? "remote",
            "mcp.server.name": input.name
          }
        })
      );
      const reconcileStdioConnections = () => Effect6.gen(function* () {
        const integrations = yield* ctx.core.integrations.list();
        for (const integration of integrations) {
          if (integration.kind !== MCP_PLUGIN_ID) continue;
          yield* Effect6.gen(function* () {
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
            Effect6.catch(
              (cause) => Effect6.logWarning(
                `mcp: failed healing stdio connection for "${integration.slug}"`,
                cause
              )
            ),
            Effect6.withSpan("mcp.plugin.reconcile_stdio_connection", {
              attributes: { "mcp.integration.slug": String(integration.slug) }
            })
          );
        }
      }).pipe(Effect6.withSpan("mcp.plugin.reconcile_stdio_connections"));
      const removeServer = (slug) => Effect6.gen(function* () {
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
        yield* ctx.core.integrations.remove(integration).pipe(Effect6.catchTag("IntegrationRemovalNotAllowedError", () => Effect6.void));
        yield* Effect6.forEach(
          clientsToRemove.values(),
          (client) => ctx.oauth.removeClient(client.owner, client.slug),
          { discard: true }
        );
      }).pipe(
        Effect6.withSpan("mcp.plugin.remove_server", {
          attributes: { "mcp.integration.slug": slug }
        })
      );
      const getServer = (slug) => ctx.core.integrations.get(slugFrom(slug)).pipe(
        Effect6.withSpan("mcp.plugin.get_server", {
          attributes: { "mcp.integration.slug": slug }
        })
      );
      const configureServer = (slug, config) => ctx.core.integrations.update(slugFrom(slug), { config }).pipe(
        Effect6.withSpan("mcp.plugin.configure_server", {
          attributes: { "mcp.integration.slug": slug }
        })
      );
      const configureAuth = (slug, input) => Effect6.gen(function* () {
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
        Effect6.withSpan("mcp.plugin.configure_auth", {
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
    resolveTools: ({ config, connection, template, getValues, httpClientLayer }) => Effect6.gen(function* () {
      const parsed = parseMcpIntegrationConfig(config);
      if (!parsed) return { tools: [], incomplete: true };
      const values = yield* getValues().pipe(
        Effect6.orElseSucceed(() => ({}))
      );
      const built = yield* buildConnectorInput(
        parsed,
        values,
        template === null ? null : String(template),
        allowStdio,
        httpClientLayer
      ).pipe(
        Effect6.map((ci) => createMcpConnector(ci)),
        Effect6.result
      );
      const manifest = Result.isSuccess(built) ? yield* discoverTools(built.success).pipe(
        Effect6.map((m) => ({ ok: true, manifest: m })),
        Effect6.catch(() => Effect6.succeed({ ok: false, manifest: null })),
        Effect6.withSpan("mcp.plugin.discover_tools", {
          attributes: { "mcp.connection.name": String(connection.name) }
        })
      ) : { ok: false, manifest: null };
      if (!manifest.ok || !manifest.manifest) {
        return { tools: [], incomplete: true };
      }
      return { tools: manifest.manifest.tools.map(toToolDef) };
    }).pipe(
      Effect6.withSpan("mcp.plugin.resolve_tools", {
        attributes: { "mcp.connection.name": String(connection.name) }
      })
    ),
    invokeTool: ({ ctx, toolRow, credential, args, elicit }) => Effect6.gen(function* () {
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
      ).pipe(Effect6.map((ci) => createMcpConnector(ci)));
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
        Effect6.onExit(
          () => toolListChanged ? ctx.connections.markToolsStale(connectionRef).pipe(Effect6.ignore) : Effect6.void
        )
      );
      const envelope = Option7.getOrUndefined(decodeMcpToolCallEnvelope(raw));
      if (envelope?.isError === true) {
        const errorMessage = extractMcpErrorMessage(envelope.content);
        if (isUnknownToolMessage(errorMessage, stamp.toolName)) {
          return yield* ctx.connections.markToolsStale(connectionRef).pipe(Effect6.ignore, Effect6.as(unknownToolFailure(String(toolRow.name), credential)));
        }
        return ToolResult.fail({
          code: "mcp_tool_error",
          message: errorMessage,
          details: { content: envelope.content }
        });
      }
      return ToolResult.ok(raw);
    }).pipe(
      Effect6.catchTag(
        "McpOAuthReauthorizationRequired",
        () => Effect6.succeed(
          mcpInvocationOAuthReauthFailure({
            integration: String(credential.integration),
            connection: String(credential.connection)
          })
        )
      ),
      Effect6.catchTag("McpConnectionError", (error) => {
        if (error.httpStatus === 401 || error.httpStatus === 403) {
          return Effect6.succeed(
            mcpInvocationAuthFailure({
              status: error.httpStatus,
              integration: String(credential.integration),
              connection: String(credential.connection)
            })
          );
        }
        return Effect6.succeed(
          authToolFailure({
            code: "connection_rejected",
            message: error.message,
            integration: { id: String(credential.integration) },
            credential: { kind: "upstream", label: String(credential.connection) }
          })
        );
      }),
      Effect6.catchTag("McpInvocationError", (error) => {
        if (error.status === 401 || error.status === 403) {
          return Effect6.succeed(
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
          }).pipe(Effect6.ignore, Effect6.as(unknownToolFailure(String(toolRow.name), credential)));
        }
        return Effect6.fail(error);
      }),
      Effect6.withSpan("mcp.plugin.invoke_tool", {
        attributes: {
          "mcp.tool.name": String(toolRow.name),
          "mcp.integration.slug": String(toolRow.integration)
        }
      })
    ),
    detect: ({ ctx, url }) => Effect6.gen(function* () {
      const httpClientLayer = options?.httpClientLayer ?? ctx.httpClientLayer;
      const trimmed = url.trim();
      if (!trimmed) return null;
      const parsed = yield* Effect6.try({
        try: () => new URL(trimmed),
        catch: (cause) => cause
      }).pipe(Effect6.option);
      if (Option7.isNone(parsed)) return null;
      const name = parsed.value.hostname || "mcp";
      const slug = deriveMcpNamespace({ endpoint: trimmed });
      const connector = createMcpConnector({
        transport: "remote",
        endpoint: trimmed,
        httpClientLayer
      });
      const connected = yield* discoverTools(connector).pipe(
        Effect6.map(() => true),
        Effect6.catch(() => Effect6.succeed(false)),
        Effect6.withSpan("mcp.plugin.discover_tools")
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
      Effect6.catch(() => Effect6.succeed(null)),
      Effect6.withSpan("mcp.plugin.detect", {
        attributes: { "mcp.endpoint": url }
      })
    ),
    // Honour upstream destructiveHint from MCP ToolAnnotations using the stamp
    // persisted in each tool row's annotations.
    resolveAnnotations: ({ toolRows }) => Effect6.sync(() => {
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
    checkHealth: ({ ctx, credential }) => Effect6.gen(function* () {
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
      ).pipe(Effect6.map((ci) => createMcpConnector(ci)));
      return yield* discoverTools(connector).pipe(
        Effect6.map(
          () => ({ status: "healthy", checkedAt: Date.now() })
        ),
        Effect6.catchTag(
          "McpToolDiscoveryError",
          (error) => Effect6.succeed({
            status: mcpLivenessFailureStatus(error),
            checkedAt: Date.now(),
            ...error.httpStatus !== void 0 ? { httpStatus: error.httpStatus } : {},
            detail: error.message
          })
        )
      );
    }).pipe(
      // buildConnectorInput rejects (e.g. stdio disabled / missing config).
      Effect6.catchTag(
        "McpConnectionError",
        (error) => Effect6.succeed({
          status: mcpLivenessFailureStatus(error),
          checkedAt: Date.now(),
          ...error.httpStatus !== void 0 ? { httpStatus: error.httpStatus } : {},
          detail: error.message
        })
      ),
      Effect6.withSpan("mcp.plugin.check_health")
    ),
    describeAuthMethods: describeMcpAuthMethods,
    describeIntegrationDisplay: describeMcpIntegrationDisplay,
    integrationConfigure: {
      type: "mcp",
      configure: ({ ctx, integration, config }) => Effect6.gen(function* () {
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
              Effect6.map(ToolResult.ok),
              Effect6.catchTag(
                "McpConnectionError",
                ({ message, transport }) => Effect6.succeed(mcpToolFailure("mcp_connection_failed", message, { transport }))
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
              return Effect6.map(
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
                Effect6.map(ToolResult.ok),
                Effect6.catchTag(
                  "IntegrationAlreadyExistsError",
                  ({ slug }) => Effect6.succeed(
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

// ../../plugins/mcp/src/api/group.ts
import { HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";
import { Schema as Schema11 } from "effect";
var SlugParams = { slug: IntegrationSlug };
var StringMap2 = Schema11.Record(Schema11.String, Schema11.String);
var AddRemoteServerPayload = Schema11.Struct({
  transport: Schema11.optional(Schema11.Literal("remote")),
  name: Schema11.String,
  /** Agent-visible catalog description. Defaults to the display name. */
  description: Schema11.optional(Schema11.String),
  endpoint: Schema11.String,
  remoteTransport: Schema11.optional(Schema11.Literals(["streamable-http", "sse", "auto"])),
  slug: Schema11.optional(Schema11.String),
  queryParams: Schema11.optional(StringMap2),
  headers: Schema11.optional(StringMap2),
  /** Declared auth methods a connection can be applied through. */
  authenticationTemplate: Schema11.optional(Schema11.Array(McpAuthMethodInput)),
  /** Single-method shorthand (legacy callers); ignored when
   *  `authenticationTemplate` is present. */
  auth: Schema11.optional(McpAuthShorthand)
});
var AddStdioServerPayload = Schema11.Struct({
  transport: Schema11.Literal("stdio"),
  name: Schema11.String,
  description: Schema11.optional(Schema11.String),
  command: Schema11.String,
  args: Schema11.optional(Schema11.Array(Schema11.String)),
  /** Declare the secret env vars this server needs, by name. Their values are
   *  supplied as the connection's secrets (the connect step), not here. */
  envVars: Schema11.optional(Schema11.Array(Schema11.String)),
  /** One-shot secret env values (programmatic). The UI sends `envVars`. */
  env: Schema11.optional(StringMap2),
  cwd: Schema11.optional(Schema11.String),
  slug: Schema11.optional(Schema11.String)
});
var AddServerPayload = Schema11.Union([AddRemoteServerPayload, AddStdioServerPayload]);
var ProbeEndpointPayload = Schema11.Struct({
  endpoint: Schema11.String,
  headers: Schema11.optional(StringMap2),
  queryParams: Schema11.optional(StringMap2)
});
var ProbeEndpointResponse = Schema11.Struct({
  connected: Schema11.Boolean,
  requiresAuthentication: Schema11.Boolean,
  requiresOAuth: Schema11.Boolean,
  supportsDynamicRegistration: Schema11.Boolean,
  name: Schema11.String,
  slug: Schema11.String,
  toolCount: Schema11.NullOr(Schema11.Number),
  serverName: Schema11.NullOr(Schema11.String),
  /** Server `instructions` from initialize — prefills the description field. */
  instructions: Schema11.NullOr(Schema11.String)
});
var AddServerResponse = Schema11.Struct({
  slug: Schema11.String
});
var RemoveServerResponse = Schema11.Struct({
  removed: Schema11.Boolean
});
var ConfigureServerPayload = Schema11.Struct({
  config: McpIntegrationConfig
});
var ConfigureServerResponse = Schema11.Struct({
  config: McpIntegrationConfig
});
var ConfigureAuthPayload = Schema11.Struct({
  authenticationTemplate: Schema11.Array(McpAuthMethodInput),
  mode: Schema11.optional(Schema11.Literals(["merge", "replace"]))
});
var ConfigureAuthResponse = Schema11.Struct({
  authenticationTemplate: Schema11.Array(McpAuthMethod)
});
var GetServerResponse = Schema11.NullOr(
  Schema11.Struct({
    slug: IntegrationSlug,
    description: Schema11.String,
    kind: Schema11.String,
    canRemove: Schema11.Boolean,
    canRefresh: Schema11.Boolean,
    config: McpIntegrationConfig
  })
);
var McpGroup = HttpApiGroup.make("mcp").add(
  HttpApiEndpoint.post("probeEndpoint", "/mcp/probe", {
    payload: ProbeEndpointPayload,
    success: ProbeEndpointResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
).add(
  HttpApiEndpoint.post("addServer", "/mcp/servers", {
    payload: AddServerPayload,
    success: AddServerResponse,
    error: [
      InternalError,
      McpConnectionError,
      McpToolDiscoveryError,
      IntegrationAlreadyExistsError
    ]
  })
).add(
  HttpApiEndpoint.delete("removeServer", "/mcp/servers/:slug", {
    params: SlugParams,
    success: RemoveServerResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
).add(
  HttpApiEndpoint.get("getServer", "/mcp/servers/:slug", {
    params: SlugParams,
    success: GetServerResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
).add(
  HttpApiEndpoint.post("configureServer", "/mcp/servers/:slug/config", {
    params: SlugParams,
    payload: ConfigureServerPayload,
    success: ConfigureServerResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
).add(
  HttpApiEndpoint.post("configureAuth", "/mcp/servers/:slug/auth", {
    params: SlugParams,
    payload: ConfigureAuthPayload,
    success: ConfigureAuthResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
);

// ../../plugins/mcp/src/api/handlers.ts
import { HttpApiBuilder } from "effect/unstable/httpapi";
import { Context as Context2, Effect as Effect10 } from "effect";

// ../api/src/api.ts
import { HttpApi, OpenApi } from "effect/unstable/httpapi";

// ../api/src/tools/api.ts
import { HttpApiEndpoint as HttpApiEndpoint2, HttpApiGroup as HttpApiGroup2 } from "effect/unstable/httpapi";
import { Schema as Schema12 } from "effect";
var ToolMetadataResponse = Schema12.Struct({
  address: ToolAddress,
  owner: Owner,
  integration: IntegrationSlug,
  connection: ConnectionName,
  name: Schema12.String,
  pluginId: Schema12.String,
  description: Schema12.String,
  mayElicit: Schema12.optional(Schema12.Boolean),
  /** Plugin-derived default approval annotation. Surfaces in the UI as the
   *  "default" policy when no user `tool_policy` rule matches. */
  requiresApproval: Schema12.optional(Schema12.Boolean),
  approvalDescription: Schema12.optional(Schema12.String),
  static: Schema12.optional(Schema12.Boolean)
});
var ListToolsQuery = Schema12.Struct({
  integration: Schema12.optional(IntegrationSlug),
  owner: Schema12.optional(Owner),
  connection: Schema12.optional(ConnectionName),
  query: Schema12.optional(Schema12.String),
  // Query params arrive as strings; the handler interprets "true"/"false".
  includeAnnotations: Schema12.optional(Schema12.String),
  includeBlocked: Schema12.optional(Schema12.String)
});
var SchemaQuery = Schema12.Struct({
  address: ToolAddress
});
var ToolNotFound = ToolNotFoundError.annotate({ httpApiStatus: 404 });
var ToolsApi = HttpApiGroup2.make("tools").add(
  HttpApiEndpoint2.get("list", "/tools", {
    query: ListToolsQuery,
    success: Schema12.Array(ToolMetadataResponse),
    error: InternalError
  })
).add(
  HttpApiEndpoint2.get("schema", "/tools/schema", {
    query: SchemaQuery,
    success: ToolSchemaView,
    error: [InternalError, ToolNotFound]
  })
);

// ../api/src/integrations/api.ts
import { HttpApiEndpoint as HttpApiEndpoint3, HttpApiGroup as HttpApiGroup3 } from "effect/unstable/httpapi";
import { Schema as Schema13 } from "effect";
var IntegrationParams = { slug: IntegrationSlug };
var PlacementDescriptor = Schema13.Struct({
  carrier: Schema13.Literals(["header", "query", "env"]),
  name: Schema13.String,
  prefix: Schema13.String,
  /** Input variable this placement renders from (absent ⇒ `token`). Without
   *  it the client cannot derive per-variable credential inputs for
   *  multi-input methods. */
  variable: Schema13.optional(Schema13.String),
  /** Static value rendered verbatim (no credential input). */
  literal: Schema13.optional(Schema13.String)
});
var OAuthDescriptor = Schema13.Struct({
  discoveryUrl: Schema13.optional(Schema13.String),
  authorizationUrl: Schema13.optional(Schema13.String),
  tokenUrl: Schema13.optional(Schema13.String),
  resource: Schema13.optional(Schema13.NullOr(Schema13.String)),
  scopes: Schema13.optional(Schema13.Array(Schema13.String)),
  registrationEndpoint: Schema13.optional(Schema13.String),
  supportsDynamicRegistration: Schema13.optional(Schema13.Boolean),
  supportsClientIdMetadataDocument: Schema13.optional(Schema13.Boolean)
});
var AuthMethodDescriptorSchema = Schema13.Struct({
  id: Schema13.String,
  label: Schema13.String,
  kind: Schema13.Literals(["oauth", "apikey", "header", "none"]),
  template: Schema13.String,
  placements: Schema13.optional(Schema13.Array(PlacementDescriptor)),
  oauth: Schema13.optional(OAuthDescriptor)
});
var IntegrationResponse = Schema13.Struct({
  slug: IntegrationSlug,
  /** Display name. */
  name: Schema13.String,
  description: Schema13.String,
  /** The plugin that owns this integration kind (e.g. "openapi", "mcp"). */
  kind: Schema13.String,
  canRemove: Schema13.Boolean,
  canRefresh: Schema13.Boolean,
  /** Declared auth methods derived from the owning plugin's stored config.
   *  Always present (possibly empty) so the client never handles absence. */
  authMethods: Schema13.Array(AuthMethodDescriptorSchema),
  /** Non-secret URL derived from opaque integration config for favicons. */
  displayUrl: Schema13.optional(Schema13.String),
  /** Catalog family derived from opaque integration config for grouped display. */
  family: Schema13.optional(Schema13.String)
});
var UpdateIntegrationPayload = Schema13.Struct({
  name: Schema13.optional(Schema13.String),
  description: Schema13.optional(Schema13.String)
});
var DetectRequest = Schema13.Struct({
  url: Schema13.String.check(Schema13.isMaxLength(2048))
});
var SetHealthCheckPayload = Schema13.Struct({
  spec: Schema13.NullOr(HealthCheckSpec)
});
var IntegrationNotFound = IntegrationNotFoundError.annotate({ httpApiStatus: 404 });
var IntegrationRemovalNotAllowed = IntegrationRemovalNotAllowedError.annotate({
  httpApiStatus: 409
});
var IntegrationsApi = HttpApiGroup3.make("integrations").add(
  HttpApiEndpoint3.get("list", "/integrations", {
    success: Schema13.Array(IntegrationResponse),
    error: InternalError
  })
).add(
  HttpApiEndpoint3.get("get", "/integrations/:slug", {
    params: IntegrationParams,
    success: IntegrationResponse,
    error: [InternalError, IntegrationNotFound]
  })
).add(
  HttpApiEndpoint3.patch("update", "/integrations/:slug", {
    params: IntegrationParams,
    payload: UpdateIntegrationPayload,
    success: IntegrationResponse,
    error: [InternalError, IntegrationNotFound]
  })
).add(
  HttpApiEndpoint3.delete("remove", "/integrations/:slug", {
    params: IntegrationParams,
    success: Schema13.Struct({ removed: Schema13.Boolean }),
    error: [InternalError, IntegrationRemovalNotAllowed]
  })
).add(
  HttpApiEndpoint3.post("detect", "/integrations/detect", {
    payload: DetectRequest,
    success: Schema13.Array(IntegrationDetectionResult),
    error: InternalError
  })
).add(
  HttpApiEndpoint3.get("healthCheckGet", "/integrations/:slug/health-check", {
    params: IntegrationParams,
    success: Schema13.NullOr(HealthCheckSpec),
    error: InternalError
  })
).add(
  HttpApiEndpoint3.get("healthCheckCandidates", "/integrations/:slug/health-check/candidates", {
    params: IntegrationParams,
    success: Schema13.Array(HealthCheckCandidate),
    error: [InternalError, IntegrationNotFound]
  })
).add(
  HttpApiEndpoint3.put("healthCheckSet", "/integrations/:slug/health-check", {
    params: IntegrationParams,
    payload: SetHealthCheckPayload,
    success: Schema13.Struct({ ok: Schema13.Boolean }),
    error: [InternalError, IntegrationNotFound]
  })
);

// ../api/src/connections/api.ts
import { HttpApiEndpoint as HttpApiEndpoint4, HttpApiGroup as HttpApiGroup4 } from "effect/unstable/httpapi";
import { Predicate as Predicate4, Schema as Schema14 } from "effect";
var ConnectionParams = {
  owner: Owner,
  integration: IntegrationSlug,
  name: ConnectionName
};
var ConnectionResponse = Schema14.Struct({
  owner: Owner,
  name: ConnectionName,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  provider: ProviderKey,
  address: ConnectionAddress,
  identityLabel: Schema14.NullOr(Schema14.String),
  description: Schema14.NullOr(Schema14.String),
  expiresAt: Schema14.NullOr(Schema14.Number),
  // The OAuth app that minted this connection (its `oauth_client` slug), or null
  // for static credentials. Lets the UI map a connection back to its app. Just a
  // slug — never a secret.
  oauthClient: Schema14.NullOr(OAuthClientSlug),
  oauthClientOwner: Schema14.NullOr(Owner),
  oauthScope: Schema14.NullOr(Schema14.String),
  missingOAuthScopes: Schema14.Array(Schema14.String),
  // Last persisted health-check verdict (written by every checkHealth run),
  // so the list can show alive/expired at a glance without probing.
  lastHealth: Schema14.NullOr(HealthCheckResult)
});
var ToolResponse = Schema14.Struct({
  address: Schema14.String,
  owner: Owner,
  integration: IntegrationSlug,
  connection: ConnectionName,
  name: Schema14.String,
  pluginId: Schema14.String,
  description: Schema14.String
});
var CommonCreateFields = {
  owner: Owner,
  name: ConnectionName,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  identityLabel: Schema14.optional(Schema14.NullOr(Schema14.String)),
  description: Schema14.optional(Schema14.NullOr(Schema14.String))
};
var UpdateConnectionPayload = Schema14.Struct({
  description: Schema14.optional(Schema14.NullOr(Schema14.String)),
  identityLabel: Schema14.optional(Schema14.NullOr(Schema14.String))
});
var CreateConnectionPayload = Schema14.Struct({
  ...CommonCreateFields,
  value: Schema14.optional(Schema14.String),
  values: Schema14.optional(Schema14.Record(Schema14.String, Schema14.String)),
  from: Schema14.optional(
    Schema14.Struct({
      provider: ProviderKey,
      id: ProviderItemId
    })
  )
}).check(
  Schema14.makeFilter(
    (payload) => [payload.value, payload.values, payload.from].filter(Predicate4.isNotUndefined).length === 1 ? void 0 : "Expected exactly one credential origin"
  )
);
var ValidateConnectionPayload = Schema14.Struct({
  owner: Owner,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  spec: Schema14.optional(HealthCheckSpec),
  value: Schema14.optional(Schema14.String),
  values: Schema14.optional(Schema14.Record(Schema14.String, Schema14.String)),
  from: Schema14.optional(
    Schema14.Struct({
      provider: ProviderKey,
      id: ProviderItemId
    })
  )
}).check(
  Schema14.makeFilter(
    (payload) => [payload.value, payload.values, payload.from].filter(Predicate4.isNotUndefined).length === 1 ? void 0 : "Expected exactly one credential origin"
  )
);
var ListConnectionsQuery = Schema14.Struct({
  integration: Schema14.optional(IntegrationSlug),
  owner: Schema14.optional(Owner)
});
var CheckHealthQuery = Schema14.Struct({
  ifStaleMs: Schema14.optional(
    Schema14.FiniteFromString.check(Schema14.isBetween({ minimum: 0, maximum: 864e5 }))
  )
});
var ConnectionNotFound = ConnectionNotFoundError.annotate({
  httpApiStatus: 404
});
var IntegrationNotFound2 = IntegrationNotFoundError.annotate({
  httpApiStatus: 404
});
var CredentialProviderNotRegistered = CredentialProviderNotRegisteredError.annotate({
  httpApiStatus: 409
});
var InvalidConnectionInput = InvalidConnectionInputError.annotate({
  httpApiStatus: 400
});
var ConnectionsApi = HttpApiGroup4.make("connections").add(
  HttpApiEndpoint4.get("list", "/connections", {
    query: ListConnectionsQuery,
    success: Schema14.Array(ConnectionResponse),
    error: InternalError
  })
).add(
  HttpApiEndpoint4.post("create", "/connections", {
    payload: CreateConnectionPayload,
    success: ConnectionResponse,
    error: [
      InternalError,
      IntegrationNotFound2,
      CredentialProviderNotRegistered,
      InvalidConnectionInput
    ]
  })
).add(
  HttpApiEndpoint4.get("get", "/connections/:owner/:integration/:name", {
    params: ConnectionParams,
    success: ConnectionResponse,
    error: [InternalError, ConnectionNotFound]
  })
).add(
  HttpApiEndpoint4.patch("update", "/connections/:owner/:integration/:name", {
    params: ConnectionParams,
    payload: UpdateConnectionPayload,
    success: ConnectionResponse,
    error: [InternalError, ConnectionNotFound]
  })
).add(
  HttpApiEndpoint4.delete("remove", "/connections/:owner/:integration/:name", {
    params: ConnectionParams,
    success: Schema14.Struct({ removed: Schema14.Boolean }),
    error: [InternalError, ConnectionNotFound]
  })
).add(
  HttpApiEndpoint4.post("refresh", "/connections/:owner/:integration/:name/refresh", {
    params: ConnectionParams,
    success: Schema14.Array(ToolResponse),
    error: [InternalError, ConnectionNotFound, IntegrationNotFound2]
  })
).add(
  HttpApiEndpoint4.post("checkHealth", "/connections/:owner/:integration/:name/health", {
    params: ConnectionParams,
    // `ifStaleMs`: return the persisted verdict when younger than this
    // instead of probing (the page-load revalidation path). The server owns
    // the freshness decision so open tabs can't stampede an upstream.
    query: CheckHealthQuery,
    success: HealthCheckResult,
    error: [InternalError, ConnectionNotFound, IntegrationNotFound2]
  })
).add(
  HttpApiEndpoint4.post("validate", "/connections/validate", {
    payload: ValidateConnectionPayload,
    success: HealthCheckResult,
    error: [InternalError, IntegrationNotFound2]
  })
);

// ../api/src/providers/api.ts
import { HttpApiEndpoint as HttpApiEndpoint5, HttpApiGroup as HttpApiGroup5 } from "effect/unstable/httpapi";
import { Schema as Schema15 } from "effect";
var ProviderParams = { key: ProviderKey };
var ProviderEntryResponse = Schema15.Struct({
  id: ProviderItemId,
  name: Schema15.String
});
var ProvidersApi = HttpApiGroup5.make("providers").add(
  HttpApiEndpoint5.get("list", "/providers", {
    success: Schema15.Array(ProviderKey),
    error: InternalError
  })
).add(
  HttpApiEndpoint5.get("items", "/providers/:key/items", {
    params: ProviderParams,
    success: Schema15.Array(ProviderEntryResponse),
    error: InternalError
  })
);

// ../api/src/executions/api.ts
import { HttpApiEndpoint as HttpApiEndpoint6, HttpApiGroup as HttpApiGroup6 } from "effect/unstable/httpapi";
import { Schema as Schema16 } from "effect";
var ExecuteRequest = Schema16.Struct({
  code: Schema16.String,
  // When true the caller is the human approver: approval-gated tools run to
  // completion instead of pausing. Set by the operator-facing Run/Test panel,
  // where clicking Run is itself the approval. `block` policies still apply.
  autoApprove: Schema16.optional(Schema16.Boolean)
});
var CompletedResult = Schema16.Struct({
  status: Schema16.Literal("completed"),
  text: Schema16.String,
  structured: Schema16.Unknown,
  isError: Schema16.Boolean
});
var PausedResult = Schema16.Struct({
  status: Schema16.Literal("paused"),
  text: Schema16.String,
  structured: Schema16.Unknown
});
var ExecuteResponse = Schema16.Union([CompletedResult, PausedResult]);
var ResumeRequest = Schema16.Struct({
  action: Schema16.Literals(["accept", "decline", "cancel"]),
  content: Schema16.optional(Schema16.Unknown)
});
var ResumeResponse = Schema16.Union([CompletedResult, PausedResult]);
var PausedExecutionInfo = Schema16.Struct({
  text: Schema16.String,
  structured: Schema16.Unknown
});
var ExecutionNotFoundError = Schema16.TaggedStruct("ExecutionNotFoundError", {
  executionId: Schema16.String
}).annotate({ httpApiStatus: 404 });
var ExecutionParams = { executionId: Schema16.String };
var ExecutionsApi = HttpApiGroup6.make("executions").add(
  HttpApiEndpoint6.get("getPaused", "/executions/:executionId", {
    params: ExecutionParams,
    success: PausedExecutionInfo,
    error: [InternalError, ExecutionNotFoundError]
  })
).add(
  HttpApiEndpoint6.post("execute", "/executions", {
    payload: ExecuteRequest,
    success: ExecuteResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint6.post("resume", "/executions/:executionId/resume", {
    params: ExecutionParams,
    payload: ResumeRequest,
    success: ResumeResponse,
    error: [InternalError, ExecutionNotFoundError]
  })
);

// ../api/src/oauth/api.ts
import { HttpApiEndpoint as HttpApiEndpoint7, HttpApiGroup as HttpApiGroup7, HttpApiSchema } from "effect/unstable/httpapi";
import { Schema as Schema17 } from "effect";
var ConnectionResponse2 = Schema17.Struct({
  owner: Owner,
  name: ConnectionName,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  provider: ProviderKey,
  address: ConnectionAddress,
  identityLabel: Schema17.NullOr(Schema17.String),
  expiresAt: Schema17.NullOr(Schema17.Number),
  // The OAuth app (`oauth_client` slug) that minted this connection — these
  // results always come from an OAuth flow, so it is non-null in practice. Just
  // a slug, never a secret; kept consistent with the connections-list shape.
  oauthClient: Schema17.NullOr(OAuthClientSlug),
  oauthClientOwner: Schema17.NullOr(Owner),
  oauthScope: Schema17.NullOr(Schema17.String),
  missingOAuthScopes: Schema17.Array(Schema17.String)
});
var CreateClientPayload = Schema17.Struct({
  owner: Owner,
  slug: OAuthClientSlug,
  authorizationUrl: Schema17.String,
  tokenUrl: Schema17.String,
  grant: Schema17.Literals(["authorization_code", "client_credentials"]),
  clientId: Schema17.String,
  clientSecret: Schema17.String,
  resource: Schema17.optional(Schema17.NullOr(Schema17.String)),
  /** Integration whose connect dialog registered this manual app. Recorded so
   *  the picker matches it to this integration by intent, not root domain. */
  originIntegration: Schema17.optional(Schema17.NullOr(IntegrationSlug))
});
var CreateClientResponse = Schema17.Struct({
  client: OAuthClientSlug
});
var RegisterDynamicPayload = Schema17.Struct({
  owner: Owner,
  slug: OAuthClientSlug,
  issuer: Schema17.optional(Schema17.NullOr(Schema17.String)),
  registrationEndpoint: Schema17.String,
  authorizationUrl: Schema17.String,
  tokenUrl: Schema17.String,
  resource: Schema17.optional(Schema17.NullOr(Schema17.String)),
  scopes: Schema17.Array(Schema17.String),
  tokenEndpointAuthMethodsSupported: Schema17.optional(Schema17.Array(Schema17.String)),
  clientName: Schema17.optional(Schema17.String),
  redirectUri: Schema17.optional(Schema17.NullOr(Schema17.String)),
  originIntegration: Schema17.optional(Schema17.NullOr(IntegrationSlug))
});
var RegisterDynamicResponse = Schema17.Struct({
  client: OAuthClientSlug
});
var OAuthClientSummaryResponse = Schema17.Struct({
  owner: Owner,
  slug: OAuthClientSlug,
  grant: Schema17.Literals(["authorization_code", "client_credentials"]),
  authorizationUrl: Schema17.String,
  tokenUrl: Schema17.String,
  resource: Schema17.optional(Schema17.NullOr(Schema17.String)),
  clientId: Schema17.String,
  origin: Schema17.Union([
    Schema17.Struct({ kind: Schema17.Literal("manual") }),
    Schema17.Struct({
      kind: Schema17.Literal("dynamic_client_registration"),
      integration: Schema17.optional(Schema17.NullOr(IntegrationSlug))
    })
  ])
});
var ListClientsResponse = Schema17.Array(OAuthClientSummaryResponse);
var RemoveClientParams = { slug: OAuthClientSlug };
var RemoveClientPayload = Schema17.Struct({
  owner: Owner
});
var RemoveClientResponse = Schema17.Struct({
  removed: Schema17.Boolean
});
var StartPayload = Schema17.Struct({
  client: OAuthClientSlug,
  /** The owner of `client` (a Personal connection may use a shared Workspace app). */
  clientOwner: Owner,
  owner: Owner,
  name: ConnectionName,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  identityLabel: Schema17.optional(Schema17.NullOr(Schema17.String)),
  redirectUri: Schema17.optional(Schema17.NullOr(Schema17.String))
});
var StartResponse = Schema17.Union([
  Schema17.Struct({
    status: Schema17.Literal("connected"),
    connection: ConnectionResponse2
  }),
  Schema17.Struct({
    status: Schema17.Literal("redirect"),
    authorizationUrl: Schema17.String,
    state: OAuthState
  })
]);
var CompletePayload = Schema17.Struct({
  state: OAuthState,
  code: Schema17.String,
  /** Regional host echoed back by the authorization server (Datadog's
   *  `domain`/`site`); forwarded so the code is redeemed at the org's region. */
  callbackDomain: Schema17.optional(Schema17.NullOr(Schema17.String))
});
var CancelPayload = Schema17.Struct({
  state: OAuthState
});
var CancelResponse = Schema17.Struct({
  cancelled: Schema17.Boolean
});
var ProbePayload = Schema17.Struct({
  url: Schema17.String
});
var ProbeResponse = Schema17.Struct({
  issuer: Schema17.optional(Schema17.NullOr(Schema17.String)),
  authorizationUrl: Schema17.String,
  tokenUrl: Schema17.String,
  resource: Schema17.optional(Schema17.NullOr(Schema17.String)),
  scopesSupported: Schema17.optional(Schema17.Array(Schema17.String)),
  registrationEndpoint: Schema17.optional(Schema17.NullOr(Schema17.String)),
  tokenEndpointAuthMethodsSupported: Schema17.optional(Schema17.Array(Schema17.String)),
  clientIdMetadataDocumentSupported: Schema17.optional(Schema17.Boolean)
});
var CallbackUrlParams = Schema17.Struct({
  state: Schema17.String,
  code: Schema17.optional(Schema17.String),
  error: Schema17.optional(Schema17.String),
  error_description: Schema17.optional(Schema17.String),
  // Non-standard region hints (Datadog: `domain` is a bare host, `site` a full
  // origin). Captured so the token exchange can target the org's region.
  domain: Schema17.optional(Schema17.String),
  site: Schema17.optional(Schema17.String)
});
var HtmlResponse = Schema17.String.pipe(HttpApiSchema.asText());
var OAuthStart = OAuthStartError.annotate({ httpApiStatus: 400 });
var OAuthComplete = OAuthCompleteError.annotate({ httpApiStatus: 400 });
var OAuthProbe = OAuthProbeError.annotate({ httpApiStatus: 400 });
var OAuthRegisterDynamic = OAuthRegisterDynamicError.annotate({ httpApiStatus: 400 });
var OAuthSessionNotFound = OAuthSessionNotFoundError.annotate({ httpApiStatus: 404 });
var OAuthApi = HttpApiGroup7.make("oauth").add(
  HttpApiEndpoint7.post("createClient", "/oauth/clients", {
    payload: CreateClientPayload,
    success: CreateClientResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint7.post("registerDynamic", "/oauth/clients/register-dynamic", {
    payload: RegisterDynamicPayload,
    success: RegisterDynamicResponse,
    error: [InternalError, OAuthRegisterDynamic]
  })
).add(
  HttpApiEndpoint7.get("listClients", "/oauth/clients", {
    success: ListClientsResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint7.delete("removeClient", "/oauth/clients/:slug", {
    params: RemoveClientParams,
    payload: RemoveClientPayload,
    success: RemoveClientResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint7.post("start", "/oauth/start", {
    payload: StartPayload,
    success: StartResponse,
    error: [InternalError, OAuthStart]
  })
).add(
  HttpApiEndpoint7.post("complete", "/oauth/complete", {
    payload: CompletePayload,
    success: ConnectionResponse2,
    error: [InternalError, OAuthComplete, OAuthSessionNotFound]
  })
).add(
  HttpApiEndpoint7.post("cancel", "/oauth/cancel", {
    payload: CancelPayload,
    success: CancelResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint7.post("probe", "/oauth/probe", {
    payload: ProbePayload,
    success: ProbeResponse,
    error: [InternalError, OAuthProbe]
  })
).add(
  HttpApiEndpoint7.get("callback", "/oauth/callback", {
    query: CallbackUrlParams,
    success: HtmlResponse,
    error: [InternalError, OAuthComplete, OAuthSessionNotFound]
  })
);

// ../api/src/policies/api.ts
import { HttpApiEndpoint as HttpApiEndpoint8, HttpApiGroup as HttpApiGroup8 } from "effect/unstable/httpapi";
import { Schema as Schema18 } from "effect";
var PolicyParams = { policyId: PolicyId };
var ToolPolicyResponse = Schema18.Struct({
  id: PolicyId,
  owner: Owner,
  pattern: Schema18.String,
  action: ToolPolicyActionSchema,
  position: Schema18.String,
  createdAt: Schema18.Number,
  updatedAt: Schema18.Number
});
var CreateToolPolicyPayload = Schema18.Struct({
  owner: Owner,
  pattern: Schema18.String,
  action: ToolPolicyActionSchema,
  position: Schema18.optional(Schema18.String)
});
var UpdateToolPolicyPayload = Schema18.Struct({
  owner: Owner,
  pattern: Schema18.optional(Schema18.String),
  action: Schema18.optional(ToolPolicyActionSchema),
  position: Schema18.optional(Schema18.String)
});
var RemoveToolPolicyPayload = Schema18.Struct({
  owner: Owner
});
var PoliciesApi = HttpApiGroup8.make("policies").add(
  HttpApiEndpoint8.get("list", "/policies", {
    success: Schema18.Array(ToolPolicyResponse),
    error: InternalError
  })
).add(
  HttpApiEndpoint8.post("create", "/policies", {
    payload: CreateToolPolicyPayload,
    success: ToolPolicyResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint8.patch("update", "/policies/:policyId", {
    params: PolicyParams,
    payload: UpdateToolPolicyPayload,
    success: ToolPolicyResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint8.delete("remove", "/policies/:policyId", {
    params: PolicyParams,
    payload: RemoveToolPolicyPayload,
    success: Schema18.Struct({ removed: Schema18.Boolean }),
    error: InternalError
  })
);

// ../api/src/api.ts
var CoreExecutorApi = HttpApi.make("executor").add(ToolsApi).add(IntegrationsApi).add(ConnectionsApi).add(ProvidersApi).add(ExecutionsApi).add(OAuthApi).add(PoliciesApi).annotateMerge(
  OpenApi.annotations({
    title: "Executor API",
    description: "Tool execution platform API"
  })
);
var addGroup = (group) => CoreExecutorApi.add(group);

// ../api/src/update-check.ts
var EXECUTOR_PACKAGE_NAME = "executor";
var NPM_DIST_TAGS_URL = `https://registry.npmjs.org/-/package/${EXECUTOR_PACKAGE_NAME}/dist-tags`;
var DIST_TAGS_TTL_MS = 10 * 60 * 1e3;
var EMPTY_TTL_MS = 60 * 1e3;

// ../api/src/plugin-routes.ts
import { Effect as Effect7, Layer as Layer4 } from "effect";

// ../api/src/oauth-popup.ts
import { Cause as Cause2, Effect as Effect8 } from "effect";

// ../api/src/account/api.ts
import { HttpApi as HttpApi2, HttpApiEndpoint as HttpApiEndpoint9, HttpApiGroup as HttpApiGroup9 } from "effect/unstable/httpapi";
import { Schema as Schema19 } from "effect";
var AccountError = class extends Schema19.TaggedErrorClass()(
  "AccountError",
  { message: Schema19.String },
  { httpApiStatus: 500 }
) {
};
var AccountForbidden = class extends Schema19.TaggedErrorClass()(
  "AccountForbidden",
  { message: Schema19.optional(Schema19.String) },
  { httpApiStatus: 403 }
) {
};
var AccountNoOrganization = class extends Schema19.TaggedErrorClass()(
  "AccountNoOrganization",
  {},
  { httpApiStatus: 403 }
) {
};
var AccountUnauthorized = class extends Schema19.TaggedErrorClass()(
  "AccountUnauthorized",
  {},
  { httpApiStatus: 401 }
) {
};
var AccountUser = Schema19.Struct({
  id: Schema19.String,
  email: Schema19.String,
  name: Schema19.NullOr(Schema19.String),
  avatarUrl: Schema19.NullOr(Schema19.String)
});
var AccountOrganization = Schema19.Struct({
  id: Schema19.String,
  name: Schema19.String,
  /** URL slug for org-prefixed console paths (`/<slug>/policies`). */
  slug: Schema19.String
});
var AccountMeResponse = Schema19.Struct({
  user: AccountUser,
  organization: Schema19.NullOr(AccountOrganization)
});
var ApiKeySummary = Schema19.Struct({
  id: Schema19.String,
  name: Schema19.String,
  /** Masked display value (e.g. "exk_…a1b2"). The full secret is only ever
   *  returned once, from `createApiKey`. */
  obfuscatedValue: Schema19.String,
  createdAt: Schema19.String,
  updatedAt: Schema19.String,
  lastUsedAt: Schema19.NullOr(Schema19.String)
});
var ApiKeysResponse = Schema19.Struct({
  apiKeys: Schema19.Array(ApiKeySummary)
});
var CreateApiKeyBody = Schema19.Struct({
  name: Schema19.String
});
var CreatedApiKeyResponse = Schema19.Struct({
  id: Schema19.String,
  name: Schema19.String,
  obfuscatedValue: Schema19.String,
  createdAt: Schema19.String,
  updatedAt: Schema19.String,
  lastUsedAt: Schema19.NullOr(Schema19.String),
  value: Schema19.String
});
var OrgMember = Schema19.Struct({
  id: Schema19.String,
  userId: Schema19.String,
  email: Schema19.String,
  name: Schema19.NullOr(Schema19.String),
  avatarUrl: Schema19.NullOr(Schema19.String),
  role: Schema19.String,
  status: Schema19.String,
  lastActiveAt: Schema19.NullOr(Schema19.String),
  isCurrentUser: Schema19.Boolean
});
var OrgMemberSeats = Schema19.Struct({
  used: Schema19.Number,
  granted: Schema19.Number,
  unlimited: Schema19.Boolean
});
var OrgMembersResponse = Schema19.Struct({
  members: Schema19.Array(OrgMember),
  seats: Schema19.optional(OrgMemberSeats)
});
var OrgRole = Schema19.Struct({
  slug: Schema19.String,
  name: Schema19.String
});
var OrgRolesResponse = Schema19.Struct({
  roles: Schema19.Array(OrgRole)
});
var InviteMemberBody = Schema19.Struct({
  email: Schema19.String,
  roleSlug: Schema19.optional(Schema19.String)
});
var InviteMemberResponse = Schema19.Struct({
  id: Schema19.String,
  email: Schema19.String
});
var UpdateMemberRoleBody = Schema19.Struct({
  roleSlug: Schema19.String
});
var UpdateOrgNameBody = Schema19.Struct({
  name: Schema19.String
});
var UpdateOrgNameResponse = Schema19.Struct({
  name: Schema19.String
});
var SuccessResponse = Schema19.Struct({
  success: Schema19.Boolean
});
var ApiKeyParams = { apiKeyId: Schema19.String };
var MembershipParams = { membershipId: Schema19.String };
var AccountApi = HttpApiGroup9.make("account").add(
  HttpApiEndpoint9.get("me", "/account/me", {
    success: AccountMeResponse,
    error: [AccountError, AccountUnauthorized]
  })
).add(
  HttpApiEndpoint9.get("listApiKeys", "/account/api-keys", {
    success: ApiKeysResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint9.post("createApiKey", "/account/api-keys", {
    payload: CreateApiKeyBody,
    success: CreatedApiKeyResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint9.delete("revokeApiKey", "/account/api-keys/:apiKeyId", {
    params: ApiKeyParams,
    success: SuccessResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint9.get("listMembers", "/account/members", {
    success: OrgMembersResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint9.get("listRoles", "/account/roles", {
    success: OrgRolesResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint9.post("inviteMember", "/account/members/invite", {
    payload: InviteMemberBody,
    success: InviteMemberResponse,
    error: [AccountError, AccountUnauthorized, AccountForbidden, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint9.delete("removeMember", "/account/members/:membershipId", {
    params: MembershipParams,
    success: SuccessResponse,
    error: [AccountError, AccountUnauthorized, AccountForbidden, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint9.patch("updateMemberRole", "/account/members/:membershipId/role", {
    params: MembershipParams,
    payload: UpdateMemberRoleBody,
    success: SuccessResponse,
    error: [AccountError, AccountUnauthorized, AccountForbidden, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint9.patch("updateOrgName", "/account/name", {
    payload: UpdateOrgNameBody,
    success: UpdateOrgNameResponse,
    error: [AccountError, AccountUnauthorized, AccountForbidden, AccountNoOrganization]
  })
);
var AccountHttpApi = HttpApi2.make("executor-account").add(AccountApi);

// ../api/src/observability.ts
import { Cause as Cause3, Context, Effect as Effect9, Layer as Layer5, Option as Option8, Result as Result2, Schema as Schema20 } from "effect";
import { HttpServerResponse } from "effect/unstable/http";
import { HttpApiMiddleware } from "effect/unstable/httpapi";
var ErrorCapture = class _ErrorCapture extends Context.Service()(
  "@executor-js/api/ErrorCapture"
) {
  /** No-op — used where capture isn't wired. Traces back as empty string. */
  static NoOp = Layer5.succeed(_ErrorCapture, {
    captureException: () => Effect9.succeed("")
  });
};
var resolveCapture = Effect9.serviceOption(ErrorCapture).pipe(
  Effect9.map(
    (opt) => Option8.isSome(opt) ? opt.value : { captureException: () => Effect9.succeed("") }
  )
);
var capture = (eff) => eff.pipe(
  // oxlint-disable-next-line executor/no-effect-escape-hatch -- boundary: unique conflicts that reach the HTTP edge are unexpected defects captured by observabilityMiddleware
  Effect9.catchTag("UniqueViolationError", (err) => Effect9.die(err)),
  Effect9.catchTag(
    "StorageError",
    (err) => resolveCapture.pipe(
      Effect9.flatMap((c) => c.captureException(Cause3.fail(err))),
      Effect9.flatMap((traceId) => Effect9.fail(new InternalError({ traceId })))
    )
  )
);
var isInternalError = Schema20.is(InternalError);
var ObservabilityMiddleware = class extends HttpApiMiddleware.Service()(
  "@executor-js/api/ObservabilityMiddleware",
  { error: InternalError }
) {
};

// ../../plugins/mcp/src/api/handlers.ts
var McpExtensionService = class extends Context2.Service()(
  "McpExtensionService"
) {
};
var ExecutorApiWithMcp = addGroup(McpGroup);
var toServerInput = (payload) => {
  if (payload.transport === "stdio") {
    const p2 = payload;
    return {
      transport: "stdio",
      name: p2.name,
      description: p2.description,
      command: p2.command,
      args: p2.args ? [...p2.args] : void 0,
      envVars: p2.envVars ? [...p2.envVars] : void 0,
      env: p2.env,
      cwd: p2.cwd,
      slug: p2.slug
    };
  }
  const p = payload;
  return {
    transport: "remote",
    name: p.name,
    description: p.description,
    endpoint: p.endpoint,
    remoteTransport: p.remoteTransport,
    queryParams: p.queryParams,
    headers: p.headers,
    slug: p.slug,
    authenticationTemplate: p.authenticationTemplate,
    auth: p.auth
  };
};
var McpHandlers = HttpApiBuilder.group(
  ExecutorApiWithMcp,
  "mcp",
  (handlers) => handlers.handle(
    "probeEndpoint",
    ({ payload }) => capture(
      Effect10.gen(function* () {
        const ext = yield* McpExtensionService;
        return yield* ext.probeEndpoint(payload);
      })
    )
  ).handle(
    "addServer",
    ({ payload }) => capture(
      Effect10.gen(function* () {
        const ext = yield* McpExtensionService;
        return yield* ext.addServer(
          toServerInput(payload)
        );
      })
    )
  ).handle(
    "removeServer",
    ({ params: path2 }) => capture(
      Effect10.gen(function* () {
        const ext = yield* McpExtensionService;
        yield* ext.removeServer(path2.slug);
        return { removed: true };
      })
    )
  ).handle(
    "getServer",
    ({ params: path2 }) => capture(
      Effect10.gen(function* () {
        const ext = yield* McpExtensionService;
        const integration = yield* ext.getServer(path2.slug);
        if (integration === null) return null;
        const config = parseMcpIntegrationConfig(integration.config);
        if (config === null) return null;
        return {
          slug: integration.slug,
          description: integration.description,
          kind: integration.kind,
          canRemove: integration.canRemove,
          canRefresh: integration.canRefresh,
          config
        };
      })
    )
  ).handle(
    "configureServer",
    ({ params: path2, payload }) => capture(
      Effect10.gen(function* () {
        const ext = yield* McpExtensionService;
        yield* ext.configureServer(path2.slug, payload.config);
        return { config: payload.config };
      })
    )
  ).handle(
    "configureAuth",
    ({ params: path2, payload }) => capture(
      Effect10.gen(function* () {
        const ext = yield* McpExtensionService;
        const authenticationTemplate = yield* ext.configureAuth(path2.slug, {
          authenticationTemplate: payload.authenticationTemplate,
          mode: payload.mode ?? "merge"
        });
        return { authenticationTemplate: [...authenticationTemplate] };
      })
    )
  )
);

// ../../plugins/mcp/src/api/index.ts
var mcpHttpPlugin = definePlugin((options) => ({
  ...mcpPlugin(options),
  routes: () => McpGroup,
  handlers: () => McpHandlers,
  extensionService: McpExtensionService
}));

// ../../plugins/file-secrets/src/index.ts
import { Effect as Effect11, Schema as Schema21 } from "effect";
import * as fs from "fs";
import * as path from "path";
var APP_NAME = "executor";
var xdgDataHome = () => {
  if (process.env.XDG_DATA_HOME?.trim()) return process.env.XDG_DATA_HOME.trim();
  if (process.platform === "win32") {
    return process.env.LOCALAPPDATA || process.env.APPDATA || path.join(process.env.USERPROFILE || "~", "AppData", "Local");
  }
  return path.join(process.env.HOME || "~", ".local", "share");
};
var authDir = (overrideDir) => overrideDir ?? path.join(xdgDataHome(), APP_NAME);
var authFilePath = (overrideDir) => path.join(authDir(overrideDir), "auth.json");
var FlatAuthFile = Schema21.Record(Schema21.String, Schema21.String);
var decodeFlatAuthFile = Schema21.decodeUnknownEffect(Schema21.fromJsonString(FlatAuthFile));
var isFileNotFoundCause = (cause) => typeof cause === "object" && cause !== null && "code" in cause && cause.code === "ENOENT";
var toStorageError = (message) => (cause) => new StorageError({ message, cause });
var readAll = (filePath) => {
  if (!fs.existsSync(filePath)) return Effect11.succeed({});
  return Effect11.try({
    try: () => fs.readFileSync(filePath, "utf-8"),
    catch: toStorageError("Failed to read auth file")
  }).pipe(
    Effect11.catchIf(
      (error) => isFileNotFoundCause(error.cause),
      () => Effect11.succeed("")
    ),
    Effect11.flatMap(
      (raw) => raw === "" ? Effect11.succeed({}) : decodeFlatAuthFile(raw).pipe(
        Effect11.mapError(toStorageError("Failed to parse auth file"))
      )
    )
  );
};
var writeAll = (filePath, secrets) => {
  const dir = path.dirname(filePath);
  const tmp = `${filePath}.tmp`;
  return Effect11.gen(function* () {
    if (!fs.existsSync(dir)) {
      yield* Effect11.try({
        try: () => fs.mkdirSync(dir, { recursive: true, mode: 448 }),
        catch: toStorageError("Failed to create auth directory")
      });
    }
    yield* Effect11.try({
      try: () => fs.writeFileSync(tmp, JSON.stringify(secrets, null, 2), { mode: 384 }),
      catch: toStorageError("Failed to write temporary auth file")
    });
    yield* Effect11.try({
      try: () => fs.renameSync(tmp, filePath),
      catch: toStorageError("Failed to replace auth file")
    });
  });
};
var makeFileSecretsExtension = (options) => ({
  filePath: resolveFilePath(options)
});
var FILE_PROVIDER_KEY = ProviderKey.make("file");
var makeFileProvider = (filePath) => ({
  key: FILE_PROVIDER_KEY,
  writable: true,
  get: (id) => readAll(filePath).pipe(Effect11.map((data) => data[id] ?? null)),
  has: (id) => readAll(filePath).pipe(Effect11.map((data) => id in data)),
  set: (id, value) => Effect11.gen(function* () {
    const data = yield* readAll(filePath);
    data[id] = value;
    yield* writeAll(filePath, data);
  }),
  delete: (id) => Effect11.gen(function* () {
    const data = yield* readAll(filePath);
    if (id in data) {
      delete data[id];
      yield* writeAll(filePath, data);
    }
  }),
  list: () => readAll(filePath).pipe(
    Effect11.map((data) => Object.keys(data).map((k) => ({ id: ProviderItemId.make(k), name: k })))
  )
});
var resolveFilePath = (config) => authFilePath(config?.directory);
var fileSecretsPlugin = definePlugin((options) => ({
  id: "fileSecrets",
  storage: () => ({}),
  extension: () => makeFileSecretsExtension(options),
  credentialProviders: () => [
    makeFileProvider(resolveFilePath(options))
  ]
}));
export {
  fileSecretsPlugin,
  mcpHttpPlugin
};
