import {
  McpAuthMethod,
  McpAuthMethodInput,
  McpAuthShorthand,
  McpConnectionError,
  McpIntegrationConfig,
  McpToolDiscoveryError,
  mcpPlugin,
  parseMcpIntegrationConfig
} from "./chunk-EOIP2MB5.js";
import "./chunk-NUUHIX6O.js";
import {
  AuthTemplateSlug,
  ConnectionAddress,
  ConnectionName,
  ConnectionNotFoundError,
  CredentialProviderNotRegisteredError,
  HealthCheckCandidate,
  HealthCheckResult,
  HealthCheckSpec,
  HttpApiBuilder_exports,
  HttpApiEndpoint_exports,
  HttpApiGroup_exports,
  HttpApiMiddleware_exports,
  HttpApiSchema_exports,
  HttpApi_exports,
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
  OpenApi_exports,
  Owner,
  PolicyId,
  ProviderItemId,
  ProviderKey,
  StorageError,
  ToolAddress,
  ToolNotFoundError,
  ToolPolicyActionSchema,
  ToolSchemaView,
  definePlugin
} from "./chunk-PWAKBQOM.js";
import {
  Cause_exports,
  Context_exports,
  Effect_exports,
  Layer_exports,
  Option_exports,
  Predicate_exports,
  Schema_exports
} from "./chunk-XRXVQF6Q.js";
import "./chunk-4VNS5WPM.js";

// ../../plugins/mcp/src/api/group.ts
var SlugParams = { slug: IntegrationSlug };
var StringMap = Schema_exports.Record(Schema_exports.String, Schema_exports.String);
var AddRemoteServerPayload = Schema_exports.Struct({
  transport: Schema_exports.optional(Schema_exports.Literal("remote")),
  name: Schema_exports.String,
  /** Agent-visible catalog description. Defaults to the display name. */
  description: Schema_exports.optional(Schema_exports.String),
  endpoint: Schema_exports.String,
  remoteTransport: Schema_exports.optional(Schema_exports.Literals(["streamable-http", "sse", "auto"])),
  slug: Schema_exports.optional(Schema_exports.String),
  queryParams: Schema_exports.optional(StringMap),
  headers: Schema_exports.optional(StringMap),
  /** Declared auth methods a connection can be applied through. */
  authenticationTemplate: Schema_exports.optional(Schema_exports.Array(McpAuthMethodInput)),
  /** Single-method shorthand (legacy callers); ignored when
   *  `authenticationTemplate` is present. */
  auth: Schema_exports.optional(McpAuthShorthand)
});
var AddStdioServerPayload = Schema_exports.Struct({
  transport: Schema_exports.Literal("stdio"),
  name: Schema_exports.String,
  description: Schema_exports.optional(Schema_exports.String),
  command: Schema_exports.String,
  args: Schema_exports.optional(Schema_exports.Array(Schema_exports.String)),
  /** Declare the secret env vars this server needs, by name. Their values are
   *  supplied as the connection's secrets (the connect step), not here. */
  envVars: Schema_exports.optional(Schema_exports.Array(Schema_exports.String)),
  /** One-shot secret env values (programmatic). The UI sends `envVars`. */
  env: Schema_exports.optional(StringMap),
  cwd: Schema_exports.optional(Schema_exports.String),
  slug: Schema_exports.optional(Schema_exports.String)
});
var AddServerPayload = Schema_exports.Union([AddRemoteServerPayload, AddStdioServerPayload]);
var ProbeEndpointPayload = Schema_exports.Struct({
  endpoint: Schema_exports.String,
  headers: Schema_exports.optional(StringMap),
  queryParams: Schema_exports.optional(StringMap)
});
var ProbeEndpointResponse = Schema_exports.Struct({
  connected: Schema_exports.Boolean,
  requiresAuthentication: Schema_exports.Boolean,
  requiresOAuth: Schema_exports.Boolean,
  supportsDynamicRegistration: Schema_exports.Boolean,
  name: Schema_exports.String,
  slug: Schema_exports.String,
  toolCount: Schema_exports.NullOr(Schema_exports.Number),
  serverName: Schema_exports.NullOr(Schema_exports.String),
  /** Server `instructions` from initialize — prefills the description field. */
  instructions: Schema_exports.NullOr(Schema_exports.String)
});
var AddServerResponse = Schema_exports.Struct({
  slug: Schema_exports.String
});
var RemoveServerResponse = Schema_exports.Struct({
  removed: Schema_exports.Boolean
});
var ConfigureServerPayload = Schema_exports.Struct({
  config: McpIntegrationConfig
});
var ConfigureServerResponse = Schema_exports.Struct({
  config: McpIntegrationConfig
});
var ConfigureAuthPayload = Schema_exports.Struct({
  authenticationTemplate: Schema_exports.Array(McpAuthMethodInput),
  mode: Schema_exports.optional(Schema_exports.Literals(["merge", "replace"]))
});
var ConfigureAuthResponse = Schema_exports.Struct({
  authenticationTemplate: Schema_exports.Array(McpAuthMethod)
});
var GetServerResponse = Schema_exports.NullOr(
  Schema_exports.Struct({
    slug: IntegrationSlug,
    description: Schema_exports.String,
    kind: Schema_exports.String,
    canRemove: Schema_exports.Boolean,
    canRefresh: Schema_exports.Boolean,
    config: McpIntegrationConfig
  })
);
var McpGroup = HttpApiGroup_exports.make("mcp").add(
  HttpApiEndpoint_exports.post("probeEndpoint", "/mcp/probe", {
    payload: ProbeEndpointPayload,
    success: ProbeEndpointResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
).add(
  HttpApiEndpoint_exports.post("addServer", "/mcp/servers", {
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
  HttpApiEndpoint_exports.delete("removeServer", "/mcp/servers/:slug", {
    params: SlugParams,
    success: RemoveServerResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
).add(
  HttpApiEndpoint_exports.get("getServer", "/mcp/servers/:slug", {
    params: SlugParams,
    success: GetServerResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
).add(
  HttpApiEndpoint_exports.post("configureServer", "/mcp/servers/:slug/config", {
    params: SlugParams,
    payload: ConfigureServerPayload,
    success: ConfigureServerResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
).add(
  HttpApiEndpoint_exports.post("configureAuth", "/mcp/servers/:slug/auth", {
    params: SlugParams,
    payload: ConfigureAuthPayload,
    success: ConfigureAuthResponse,
    error: [InternalError, McpConnectionError, McpToolDiscoveryError]
  })
);

// ../api/src/tools/api.ts
var ToolMetadataResponse = Schema_exports.Struct({
  address: ToolAddress,
  owner: Owner,
  integration: IntegrationSlug,
  connection: ConnectionName,
  name: Schema_exports.String,
  pluginId: Schema_exports.String,
  description: Schema_exports.String,
  mayElicit: Schema_exports.optional(Schema_exports.Boolean),
  /** Plugin-derived default approval annotation. Surfaces in the UI as the
   *  "default" policy when no user `tool_policy` rule matches. */
  requiresApproval: Schema_exports.optional(Schema_exports.Boolean),
  approvalDescription: Schema_exports.optional(Schema_exports.String),
  static: Schema_exports.optional(Schema_exports.Boolean)
});
var ListToolsQuery = Schema_exports.Struct({
  integration: Schema_exports.optional(IntegrationSlug),
  owner: Schema_exports.optional(Owner),
  connection: Schema_exports.optional(ConnectionName),
  query: Schema_exports.optional(Schema_exports.String),
  // Query params arrive as strings; the handler interprets "true"/"false".
  includeAnnotations: Schema_exports.optional(Schema_exports.String),
  includeBlocked: Schema_exports.optional(Schema_exports.String)
});
var SchemaQuery = Schema_exports.Struct({
  address: ToolAddress
});
var ToolNotFound = ToolNotFoundError.annotate({ httpApiStatus: 404 });
var ToolsApi = HttpApiGroup_exports.make("tools").add(
  HttpApiEndpoint_exports.get("list", "/tools", {
    query: ListToolsQuery,
    success: Schema_exports.Array(ToolMetadataResponse),
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.get("schema", "/tools/schema", {
    query: SchemaQuery,
    success: ToolSchemaView,
    error: [InternalError, ToolNotFound]
  })
);

// ../api/src/integrations/api.ts
var IntegrationParams = { slug: IntegrationSlug };
var PlacementDescriptor = Schema_exports.Struct({
  carrier: Schema_exports.Literals(["header", "query", "env"]),
  name: Schema_exports.String,
  prefix: Schema_exports.String,
  /** Input variable this placement renders from (absent ⇒ `token`). Without
   *  it the client cannot derive per-variable credential inputs for
   *  multi-input methods. */
  variable: Schema_exports.optional(Schema_exports.String),
  /** Static value rendered verbatim (no credential input). */
  literal: Schema_exports.optional(Schema_exports.String)
});
var OAuthDescriptor = Schema_exports.Struct({
  discoveryUrl: Schema_exports.optional(Schema_exports.String),
  authorizationUrl: Schema_exports.optional(Schema_exports.String),
  tokenUrl: Schema_exports.optional(Schema_exports.String),
  resource: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  scopes: Schema_exports.optional(Schema_exports.Array(Schema_exports.String)),
  registrationEndpoint: Schema_exports.optional(Schema_exports.String),
  supportsDynamicRegistration: Schema_exports.optional(Schema_exports.Boolean),
  supportsClientIdMetadataDocument: Schema_exports.optional(Schema_exports.Boolean)
});
var AuthMethodDescriptorSchema = Schema_exports.Struct({
  id: Schema_exports.String,
  label: Schema_exports.String,
  kind: Schema_exports.Literals(["oauth", "apikey", "header", "none"]),
  template: Schema_exports.String,
  placements: Schema_exports.optional(Schema_exports.Array(PlacementDescriptor)),
  oauth: Schema_exports.optional(OAuthDescriptor)
});
var IntegrationResponse = Schema_exports.Struct({
  slug: IntegrationSlug,
  /** Display name. */
  name: Schema_exports.String,
  description: Schema_exports.String,
  /** The plugin that owns this integration kind (e.g. "openapi", "mcp"). */
  kind: Schema_exports.String,
  canRemove: Schema_exports.Boolean,
  canRefresh: Schema_exports.Boolean,
  /** Declared auth methods derived from the owning plugin's stored config.
   *  Always present (possibly empty) so the client never handles absence. */
  authMethods: Schema_exports.Array(AuthMethodDescriptorSchema),
  /** Non-secret URL derived from opaque integration config for favicons. */
  displayUrl: Schema_exports.optional(Schema_exports.String),
  /** Catalog family derived from opaque integration config for grouped display. */
  family: Schema_exports.optional(Schema_exports.String)
});
var UpdateIntegrationPayload = Schema_exports.Struct({
  name: Schema_exports.optional(Schema_exports.String),
  description: Schema_exports.optional(Schema_exports.String)
});
var DetectRequest = Schema_exports.Struct({
  url: Schema_exports.String.check(Schema_exports.isMaxLength(2048))
});
var SetHealthCheckPayload = Schema_exports.Struct({
  spec: Schema_exports.NullOr(HealthCheckSpec)
});
var IntegrationNotFound = IntegrationNotFoundError.annotate({ httpApiStatus: 404 });
var IntegrationRemovalNotAllowed = IntegrationRemovalNotAllowedError.annotate({
  httpApiStatus: 409
});
var IntegrationsApi = HttpApiGroup_exports.make("integrations").add(
  HttpApiEndpoint_exports.get("list", "/integrations", {
    success: Schema_exports.Array(IntegrationResponse),
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.get("get", "/integrations/:slug", {
    params: IntegrationParams,
    success: IntegrationResponse,
    error: [InternalError, IntegrationNotFound]
  })
).add(
  HttpApiEndpoint_exports.patch("update", "/integrations/:slug", {
    params: IntegrationParams,
    payload: UpdateIntegrationPayload,
    success: IntegrationResponse,
    error: [InternalError, IntegrationNotFound]
  })
).add(
  HttpApiEndpoint_exports.delete("remove", "/integrations/:slug", {
    params: IntegrationParams,
    success: Schema_exports.Struct({ removed: Schema_exports.Boolean }),
    error: [InternalError, IntegrationRemovalNotAllowed]
  })
).add(
  HttpApiEndpoint_exports.post("detect", "/integrations/detect", {
    payload: DetectRequest,
    success: Schema_exports.Array(IntegrationDetectionResult),
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.get("healthCheckGet", "/integrations/:slug/health-check", {
    params: IntegrationParams,
    success: Schema_exports.NullOr(HealthCheckSpec),
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.get("healthCheckCandidates", "/integrations/:slug/health-check/candidates", {
    params: IntegrationParams,
    success: Schema_exports.Array(HealthCheckCandidate),
    error: [InternalError, IntegrationNotFound]
  })
).add(
  HttpApiEndpoint_exports.put("healthCheckSet", "/integrations/:slug/health-check", {
    params: IntegrationParams,
    payload: SetHealthCheckPayload,
    success: Schema_exports.Struct({ ok: Schema_exports.Boolean }),
    error: [InternalError, IntegrationNotFound]
  })
);

// ../api/src/connections/api.ts
var ConnectionParams = {
  owner: Owner,
  integration: IntegrationSlug,
  name: ConnectionName
};
var ConnectionResponse = Schema_exports.Struct({
  owner: Owner,
  name: ConnectionName,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  provider: ProviderKey,
  address: ConnectionAddress,
  identityLabel: Schema_exports.NullOr(Schema_exports.String),
  description: Schema_exports.NullOr(Schema_exports.String),
  expiresAt: Schema_exports.NullOr(Schema_exports.Number),
  // The OAuth app that minted this connection (its `oauth_client` slug), or null
  // for static credentials. Lets the UI map a connection back to its app. Just a
  // slug — never a secret.
  oauthClient: Schema_exports.NullOr(OAuthClientSlug),
  oauthClientOwner: Schema_exports.NullOr(Owner),
  oauthScope: Schema_exports.NullOr(Schema_exports.String),
  missingOAuthScopes: Schema_exports.Array(Schema_exports.String),
  // Last persisted health-check verdict (written by every checkHealth run),
  // so the list can show alive/expired at a glance without probing.
  lastHealth: Schema_exports.NullOr(HealthCheckResult)
});
var ToolResponse = Schema_exports.Struct({
  address: Schema_exports.String,
  owner: Owner,
  integration: IntegrationSlug,
  connection: ConnectionName,
  name: Schema_exports.String,
  pluginId: Schema_exports.String,
  description: Schema_exports.String
});
var CommonCreateFields = {
  owner: Owner,
  name: ConnectionName,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  identityLabel: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  description: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String))
};
var UpdateConnectionPayload = Schema_exports.Struct({
  description: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  identityLabel: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String))
});
var CreateConnectionPayload = Schema_exports.Struct({
  ...CommonCreateFields,
  value: Schema_exports.optional(Schema_exports.String),
  values: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, Schema_exports.String)),
  from: Schema_exports.optional(
    Schema_exports.Struct({
      provider: ProviderKey,
      id: ProviderItemId
    })
  )
}).check(
  Schema_exports.makeFilter(
    (payload) => [payload.value, payload.values, payload.from].filter(Predicate_exports.isNotUndefined).length === 1 ? void 0 : "Expected exactly one credential origin"
  )
);
var ValidateConnectionPayload = Schema_exports.Struct({
  owner: Owner,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  spec: Schema_exports.optional(HealthCheckSpec),
  value: Schema_exports.optional(Schema_exports.String),
  values: Schema_exports.optional(Schema_exports.Record(Schema_exports.String, Schema_exports.String)),
  from: Schema_exports.optional(
    Schema_exports.Struct({
      provider: ProviderKey,
      id: ProviderItemId
    })
  )
}).check(
  Schema_exports.makeFilter(
    (payload) => [payload.value, payload.values, payload.from].filter(Predicate_exports.isNotUndefined).length === 1 ? void 0 : "Expected exactly one credential origin"
  )
);
var ListConnectionsQuery = Schema_exports.Struct({
  integration: Schema_exports.optional(IntegrationSlug),
  owner: Schema_exports.optional(Owner)
});
var CheckHealthQuery = Schema_exports.Struct({
  ifStaleMs: Schema_exports.optional(
    Schema_exports.FiniteFromString.check(Schema_exports.isBetween({ minimum: 0, maximum: 864e5 }))
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
var ConnectionsApi = HttpApiGroup_exports.make("connections").add(
  HttpApiEndpoint_exports.get("list", "/connections", {
    query: ListConnectionsQuery,
    success: Schema_exports.Array(ConnectionResponse),
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.post("create", "/connections", {
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
  HttpApiEndpoint_exports.get("get", "/connections/:owner/:integration/:name", {
    params: ConnectionParams,
    success: ConnectionResponse,
    error: [InternalError, ConnectionNotFound]
  })
).add(
  HttpApiEndpoint_exports.patch("update", "/connections/:owner/:integration/:name", {
    params: ConnectionParams,
    payload: UpdateConnectionPayload,
    success: ConnectionResponse,
    error: [InternalError, ConnectionNotFound]
  })
).add(
  HttpApiEndpoint_exports.delete("remove", "/connections/:owner/:integration/:name", {
    params: ConnectionParams,
    success: Schema_exports.Struct({ removed: Schema_exports.Boolean }),
    error: [InternalError, ConnectionNotFound]
  })
).add(
  HttpApiEndpoint_exports.post("refresh", "/connections/:owner/:integration/:name/refresh", {
    params: ConnectionParams,
    success: Schema_exports.Array(ToolResponse),
    error: [InternalError, ConnectionNotFound, IntegrationNotFound2]
  })
).add(
  HttpApiEndpoint_exports.post("checkHealth", "/connections/:owner/:integration/:name/health", {
    params: ConnectionParams,
    // `ifStaleMs`: return the persisted verdict when younger than this
    // instead of probing (the page-load revalidation path). The server owns
    // the freshness decision so open tabs can't stampede an upstream.
    query: CheckHealthQuery,
    success: HealthCheckResult,
    error: [InternalError, ConnectionNotFound, IntegrationNotFound2]
  })
).add(
  HttpApiEndpoint_exports.post("validate", "/connections/validate", {
    payload: ValidateConnectionPayload,
    success: HealthCheckResult,
    error: [InternalError, IntegrationNotFound2]
  })
);

// ../api/src/providers/api.ts
var ProviderParams = { key: ProviderKey };
var ProviderEntryResponse = Schema_exports.Struct({
  id: ProviderItemId,
  name: Schema_exports.String
});
var ProvidersApi = HttpApiGroup_exports.make("providers").add(
  HttpApiEndpoint_exports.get("list", "/providers", {
    success: Schema_exports.Array(ProviderKey),
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.get("items", "/providers/:key/items", {
    params: ProviderParams,
    success: Schema_exports.Array(ProviderEntryResponse),
    error: InternalError
  })
);

// ../api/src/executions/api.ts
var ExecuteRequest = Schema_exports.Struct({
  code: Schema_exports.String,
  // When true the caller is the human approver: approval-gated tools run to
  // completion instead of pausing. Set by the operator-facing Run/Test panel,
  // where clicking Run is itself the approval. `block` policies still apply.
  autoApprove: Schema_exports.optional(Schema_exports.Boolean)
});
var CompletedResult = Schema_exports.Struct({
  status: Schema_exports.Literal("completed"),
  text: Schema_exports.String,
  structured: Schema_exports.Unknown,
  isError: Schema_exports.Boolean
});
var PausedResult = Schema_exports.Struct({
  status: Schema_exports.Literal("paused"),
  text: Schema_exports.String,
  structured: Schema_exports.Unknown
});
var ExecuteResponse = Schema_exports.Union([CompletedResult, PausedResult]);
var ResumeRequest = Schema_exports.Struct({
  action: Schema_exports.Literals(["accept", "decline", "cancel"]),
  content: Schema_exports.optional(Schema_exports.Unknown)
});
var ResumeResponse = Schema_exports.Union([CompletedResult, PausedResult]);
var PausedExecutionInfo = Schema_exports.Struct({
  text: Schema_exports.String,
  structured: Schema_exports.Unknown
});
var ExecutionNotFoundError = Schema_exports.TaggedStruct("ExecutionNotFoundError", {
  executionId: Schema_exports.String
}).annotate({ httpApiStatus: 404 });
var ExecutionParams = { executionId: Schema_exports.String };
var ExecutionsApi = HttpApiGroup_exports.make("executions").add(
  HttpApiEndpoint_exports.get("getPaused", "/executions/:executionId", {
    params: ExecutionParams,
    success: PausedExecutionInfo,
    error: [InternalError, ExecutionNotFoundError]
  })
).add(
  HttpApiEndpoint_exports.post("execute", "/executions", {
    payload: ExecuteRequest,
    success: ExecuteResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.post("resume", "/executions/:executionId/resume", {
    params: ExecutionParams,
    payload: ResumeRequest,
    success: ResumeResponse,
    error: [InternalError, ExecutionNotFoundError]
  })
);

// ../api/src/oauth/api.ts
var ConnectionResponse2 = Schema_exports.Struct({
  owner: Owner,
  name: ConnectionName,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  provider: ProviderKey,
  address: ConnectionAddress,
  identityLabel: Schema_exports.NullOr(Schema_exports.String),
  expiresAt: Schema_exports.NullOr(Schema_exports.Number),
  // The OAuth app (`oauth_client` slug) that minted this connection — these
  // results always come from an OAuth flow, so it is non-null in practice. Just
  // a slug, never a secret; kept consistent with the connections-list shape.
  oauthClient: Schema_exports.NullOr(OAuthClientSlug),
  oauthClientOwner: Schema_exports.NullOr(Owner),
  oauthScope: Schema_exports.NullOr(Schema_exports.String),
  missingOAuthScopes: Schema_exports.Array(Schema_exports.String)
});
var CreateClientPayload = Schema_exports.Struct({
  owner: Owner,
  slug: OAuthClientSlug,
  authorizationUrl: Schema_exports.String,
  tokenUrl: Schema_exports.String,
  grant: Schema_exports.Literals(["authorization_code", "client_credentials"]),
  clientId: Schema_exports.String,
  clientSecret: Schema_exports.String,
  resource: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  /** Integration whose connect dialog registered this manual app. Recorded so
   *  the picker matches it to this integration by intent, not root domain. */
  originIntegration: Schema_exports.optional(Schema_exports.NullOr(IntegrationSlug))
});
var CreateClientResponse = Schema_exports.Struct({
  client: OAuthClientSlug
});
var RegisterDynamicPayload = Schema_exports.Struct({
  owner: Owner,
  slug: OAuthClientSlug,
  issuer: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  registrationEndpoint: Schema_exports.String,
  authorizationUrl: Schema_exports.String,
  tokenUrl: Schema_exports.String,
  resource: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  scopes: Schema_exports.Array(Schema_exports.String),
  tokenEndpointAuthMethodsSupported: Schema_exports.optional(Schema_exports.Array(Schema_exports.String)),
  clientName: Schema_exports.optional(Schema_exports.String),
  redirectUri: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  originIntegration: Schema_exports.optional(Schema_exports.NullOr(IntegrationSlug))
});
var RegisterDynamicResponse = Schema_exports.Struct({
  client: OAuthClientSlug
});
var OAuthClientSummaryResponse = Schema_exports.Struct({
  owner: Owner,
  slug: OAuthClientSlug,
  grant: Schema_exports.Literals(["authorization_code", "client_credentials"]),
  authorizationUrl: Schema_exports.String,
  tokenUrl: Schema_exports.String,
  resource: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  clientId: Schema_exports.String,
  origin: Schema_exports.Union([
    Schema_exports.Struct({ kind: Schema_exports.Literal("manual") }),
    Schema_exports.Struct({
      kind: Schema_exports.Literal("dynamic_client_registration"),
      integration: Schema_exports.optional(Schema_exports.NullOr(IntegrationSlug))
    })
  ])
});
var ListClientsResponse = Schema_exports.Array(OAuthClientSummaryResponse);
var RemoveClientParams = { slug: OAuthClientSlug };
var RemoveClientPayload = Schema_exports.Struct({
  owner: Owner
});
var RemoveClientResponse = Schema_exports.Struct({
  removed: Schema_exports.Boolean
});
var StartPayload = Schema_exports.Struct({
  client: OAuthClientSlug,
  /** The owner of `client` (a Personal connection may use a shared Workspace app). */
  clientOwner: Owner,
  owner: Owner,
  name: ConnectionName,
  integration: IntegrationSlug,
  template: AuthTemplateSlug,
  identityLabel: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  redirectUri: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String))
});
var StartResponse = Schema_exports.Union([
  Schema_exports.Struct({
    status: Schema_exports.Literal("connected"),
    connection: ConnectionResponse2
  }),
  Schema_exports.Struct({
    status: Schema_exports.Literal("redirect"),
    authorizationUrl: Schema_exports.String,
    state: OAuthState
  })
]);
var CompletePayload = Schema_exports.Struct({
  state: OAuthState,
  code: Schema_exports.String,
  /** Regional host echoed back by the authorization server (Datadog's
   *  `domain`/`site`); forwarded so the code is redeemed at the org's region. */
  callbackDomain: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String))
});
var CancelPayload = Schema_exports.Struct({
  state: OAuthState
});
var CancelResponse = Schema_exports.Struct({
  cancelled: Schema_exports.Boolean
});
var ProbePayload = Schema_exports.Struct({
  url: Schema_exports.String
});
var ProbeResponse = Schema_exports.Struct({
  issuer: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  authorizationUrl: Schema_exports.String,
  tokenUrl: Schema_exports.String,
  resource: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  scopesSupported: Schema_exports.optional(Schema_exports.Array(Schema_exports.String)),
  registrationEndpoint: Schema_exports.optional(Schema_exports.NullOr(Schema_exports.String)),
  tokenEndpointAuthMethodsSupported: Schema_exports.optional(Schema_exports.Array(Schema_exports.String)),
  clientIdMetadataDocumentSupported: Schema_exports.optional(Schema_exports.Boolean)
});
var CallbackUrlParams = Schema_exports.Struct({
  state: Schema_exports.String,
  code: Schema_exports.optional(Schema_exports.String),
  error: Schema_exports.optional(Schema_exports.String),
  error_description: Schema_exports.optional(Schema_exports.String),
  // Non-standard region hints (Datadog: `domain` is a bare host, `site` a full
  // origin). Captured so the token exchange can target the org's region.
  domain: Schema_exports.optional(Schema_exports.String),
  site: Schema_exports.optional(Schema_exports.String)
});
var HtmlResponse = Schema_exports.String.pipe(HttpApiSchema_exports.asText());
var OAuthStart = OAuthStartError.annotate({ httpApiStatus: 400 });
var OAuthComplete = OAuthCompleteError.annotate({ httpApiStatus: 400 });
var OAuthProbe = OAuthProbeError.annotate({ httpApiStatus: 400 });
var OAuthRegisterDynamic = OAuthRegisterDynamicError.annotate({ httpApiStatus: 400 });
var OAuthSessionNotFound = OAuthSessionNotFoundError.annotate({ httpApiStatus: 404 });
var OAuthApi = HttpApiGroup_exports.make("oauth").add(
  HttpApiEndpoint_exports.post("createClient", "/oauth/clients", {
    payload: CreateClientPayload,
    success: CreateClientResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.post("registerDynamic", "/oauth/clients/register-dynamic", {
    payload: RegisterDynamicPayload,
    success: RegisterDynamicResponse,
    error: [InternalError, OAuthRegisterDynamic]
  })
).add(
  HttpApiEndpoint_exports.get("listClients", "/oauth/clients", {
    success: ListClientsResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.delete("removeClient", "/oauth/clients/:slug", {
    params: RemoveClientParams,
    payload: RemoveClientPayload,
    success: RemoveClientResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.post("start", "/oauth/start", {
    payload: StartPayload,
    success: StartResponse,
    error: [InternalError, OAuthStart]
  })
).add(
  HttpApiEndpoint_exports.post("complete", "/oauth/complete", {
    payload: CompletePayload,
    success: ConnectionResponse2,
    error: [InternalError, OAuthComplete, OAuthSessionNotFound]
  })
).add(
  HttpApiEndpoint_exports.post("cancel", "/oauth/cancel", {
    payload: CancelPayload,
    success: CancelResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.post("probe", "/oauth/probe", {
    payload: ProbePayload,
    success: ProbeResponse,
    error: [InternalError, OAuthProbe]
  })
).add(
  HttpApiEndpoint_exports.get("callback", "/oauth/callback", {
    query: CallbackUrlParams,
    success: HtmlResponse,
    error: [InternalError, OAuthComplete, OAuthSessionNotFound]
  })
);

// ../api/src/policies/api.ts
var PolicyParams = { policyId: PolicyId };
var ToolPolicyResponse = Schema_exports.Struct({
  id: PolicyId,
  owner: Owner,
  pattern: Schema_exports.String,
  action: ToolPolicyActionSchema,
  position: Schema_exports.String,
  createdAt: Schema_exports.Number,
  updatedAt: Schema_exports.Number
});
var CreateToolPolicyPayload = Schema_exports.Struct({
  owner: Owner,
  pattern: Schema_exports.String,
  action: ToolPolicyActionSchema,
  position: Schema_exports.optional(Schema_exports.String)
});
var UpdateToolPolicyPayload = Schema_exports.Struct({
  owner: Owner,
  pattern: Schema_exports.optional(Schema_exports.String),
  action: Schema_exports.optional(ToolPolicyActionSchema),
  position: Schema_exports.optional(Schema_exports.String)
});
var RemoveToolPolicyPayload = Schema_exports.Struct({
  owner: Owner
});
var PoliciesApi = HttpApiGroup_exports.make("policies").add(
  HttpApiEndpoint_exports.get("list", "/policies", {
    success: Schema_exports.Array(ToolPolicyResponse),
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.post("create", "/policies", {
    payload: CreateToolPolicyPayload,
    success: ToolPolicyResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.patch("update", "/policies/:policyId", {
    params: PolicyParams,
    payload: UpdateToolPolicyPayload,
    success: ToolPolicyResponse,
    error: InternalError
  })
).add(
  HttpApiEndpoint_exports.delete("remove", "/policies/:policyId", {
    params: PolicyParams,
    payload: RemoveToolPolicyPayload,
    success: Schema_exports.Struct({ removed: Schema_exports.Boolean }),
    error: InternalError
  })
);

// ../api/src/api.ts
var CoreExecutorApi = HttpApi_exports.make("executor").add(ToolsApi).add(IntegrationsApi).add(ConnectionsApi).add(ProvidersApi).add(ExecutionsApi).add(OAuthApi).add(PoliciesApi).annotateMerge(
  OpenApi_exports.annotations({
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

// ../api/src/account/api.ts
var AccountError = class extends Schema_exports.TaggedErrorClass()(
  "AccountError",
  { message: Schema_exports.String },
  { httpApiStatus: 500 }
) {
};
var AccountForbidden = class extends Schema_exports.TaggedErrorClass()(
  "AccountForbidden",
  { message: Schema_exports.optional(Schema_exports.String) },
  { httpApiStatus: 403 }
) {
};
var AccountNoOrganization = class extends Schema_exports.TaggedErrorClass()(
  "AccountNoOrganization",
  {},
  { httpApiStatus: 403 }
) {
};
var AccountUnauthorized = class extends Schema_exports.TaggedErrorClass()(
  "AccountUnauthorized",
  {},
  { httpApiStatus: 401 }
) {
};
var AccountUser = Schema_exports.Struct({
  id: Schema_exports.String,
  email: Schema_exports.String,
  name: Schema_exports.NullOr(Schema_exports.String),
  avatarUrl: Schema_exports.NullOr(Schema_exports.String)
});
var AccountOrganization = Schema_exports.Struct({
  id: Schema_exports.String,
  name: Schema_exports.String,
  /** URL slug for org-prefixed console paths (`/<slug>/policies`). */
  slug: Schema_exports.String
});
var AccountMeResponse = Schema_exports.Struct({
  user: AccountUser,
  organization: Schema_exports.NullOr(AccountOrganization)
});
var ApiKeySummary = Schema_exports.Struct({
  id: Schema_exports.String,
  name: Schema_exports.String,
  /** Masked display value (e.g. "exk_…a1b2"). The full secret is only ever
   *  returned once, from `createApiKey`. */
  obfuscatedValue: Schema_exports.String,
  createdAt: Schema_exports.String,
  updatedAt: Schema_exports.String,
  lastUsedAt: Schema_exports.NullOr(Schema_exports.String)
});
var ApiKeysResponse = Schema_exports.Struct({
  apiKeys: Schema_exports.Array(ApiKeySummary)
});
var CreateApiKeyBody = Schema_exports.Struct({
  name: Schema_exports.String
});
var CreatedApiKeyResponse = Schema_exports.Struct({
  id: Schema_exports.String,
  name: Schema_exports.String,
  obfuscatedValue: Schema_exports.String,
  createdAt: Schema_exports.String,
  updatedAt: Schema_exports.String,
  lastUsedAt: Schema_exports.NullOr(Schema_exports.String),
  value: Schema_exports.String
});
var OrgMember = Schema_exports.Struct({
  id: Schema_exports.String,
  userId: Schema_exports.String,
  email: Schema_exports.String,
  name: Schema_exports.NullOr(Schema_exports.String),
  avatarUrl: Schema_exports.NullOr(Schema_exports.String),
  role: Schema_exports.String,
  status: Schema_exports.String,
  lastActiveAt: Schema_exports.NullOr(Schema_exports.String),
  isCurrentUser: Schema_exports.Boolean
});
var OrgMemberSeats = Schema_exports.Struct({
  used: Schema_exports.Number,
  granted: Schema_exports.Number,
  unlimited: Schema_exports.Boolean
});
var OrgMembersResponse = Schema_exports.Struct({
  members: Schema_exports.Array(OrgMember),
  seats: Schema_exports.optional(OrgMemberSeats)
});
var OrgRole = Schema_exports.Struct({
  slug: Schema_exports.String,
  name: Schema_exports.String
});
var OrgRolesResponse = Schema_exports.Struct({
  roles: Schema_exports.Array(OrgRole)
});
var InviteMemberBody = Schema_exports.Struct({
  email: Schema_exports.String,
  roleSlug: Schema_exports.optional(Schema_exports.String)
});
var InviteMemberResponse = Schema_exports.Struct({
  id: Schema_exports.String,
  email: Schema_exports.String
});
var UpdateMemberRoleBody = Schema_exports.Struct({
  roleSlug: Schema_exports.String
});
var UpdateOrgNameBody = Schema_exports.Struct({
  name: Schema_exports.String
});
var UpdateOrgNameResponse = Schema_exports.Struct({
  name: Schema_exports.String
});
var SuccessResponse = Schema_exports.Struct({
  success: Schema_exports.Boolean
});
var ApiKeyParams = { apiKeyId: Schema_exports.String };
var MembershipParams = { membershipId: Schema_exports.String };
var AccountApi = HttpApiGroup_exports.make("account").add(
  HttpApiEndpoint_exports.get("me", "/account/me", {
    success: AccountMeResponse,
    error: [AccountError, AccountUnauthorized]
  })
).add(
  HttpApiEndpoint_exports.get("listApiKeys", "/account/api-keys", {
    success: ApiKeysResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint_exports.post("createApiKey", "/account/api-keys", {
    payload: CreateApiKeyBody,
    success: CreatedApiKeyResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint_exports.delete("revokeApiKey", "/account/api-keys/:apiKeyId", {
    params: ApiKeyParams,
    success: SuccessResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint_exports.get("listMembers", "/account/members", {
    success: OrgMembersResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint_exports.get("listRoles", "/account/roles", {
    success: OrgRolesResponse,
    error: [AccountError, AccountUnauthorized, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint_exports.post("inviteMember", "/account/members/invite", {
    payload: InviteMemberBody,
    success: InviteMemberResponse,
    error: [AccountError, AccountUnauthorized, AccountForbidden, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint_exports.delete("removeMember", "/account/members/:membershipId", {
    params: MembershipParams,
    success: SuccessResponse,
    error: [AccountError, AccountUnauthorized, AccountForbidden, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint_exports.patch("updateMemberRole", "/account/members/:membershipId/role", {
    params: MembershipParams,
    payload: UpdateMemberRoleBody,
    success: SuccessResponse,
    error: [AccountError, AccountUnauthorized, AccountForbidden, AccountNoOrganization]
  })
).add(
  HttpApiEndpoint_exports.patch("updateOrgName", "/account/name", {
    payload: UpdateOrgNameBody,
    success: UpdateOrgNameResponse,
    error: [AccountError, AccountUnauthorized, AccountForbidden, AccountNoOrganization]
  })
);
var AccountHttpApi = HttpApi_exports.make("executor-account").add(AccountApi);

// ../api/src/observability.ts
var ErrorCapture = class _ErrorCapture extends Context_exports.Service()(
  "@executor-js/api/ErrorCapture"
) {
  /** No-op — used where capture isn't wired. Traces back as empty string. */
  static NoOp = Layer_exports.succeed(_ErrorCapture, {
    captureException: () => Effect_exports.succeed("")
  });
};
var resolveCapture = Effect_exports.serviceOption(ErrorCapture).pipe(
  Effect_exports.map(
    (opt) => Option_exports.isSome(opt) ? opt.value : { captureException: () => Effect_exports.succeed("") }
  )
);
var capture = (eff) => eff.pipe(
  // oxlint-disable-next-line executor/no-effect-escape-hatch -- boundary: unique conflicts that reach the HTTP edge are unexpected defects captured by observabilityMiddleware
  Effect_exports.catchTag("UniqueViolationError", (err) => Effect_exports.die(err)),
  Effect_exports.catchTag(
    "StorageError",
    (err) => resolveCapture.pipe(
      Effect_exports.flatMap((c) => c.captureException(Cause_exports.fail(err))),
      Effect_exports.flatMap((traceId) => Effect_exports.fail(new InternalError({ traceId })))
    )
  )
);
var isInternalError = Schema_exports.is(InternalError);
var ObservabilityMiddleware = class extends HttpApiMiddleware_exports.Service()(
  "@executor-js/api/ObservabilityMiddleware",
  { error: InternalError }
) {
};

// ../../plugins/mcp/src/api/handlers.ts
var McpExtensionService = class extends Context_exports.Service()(
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
var McpHandlers = HttpApiBuilder_exports.group(
  ExecutorApiWithMcp,
  "mcp",
  (handlers) => handlers.handle(
    "probeEndpoint",
    ({ payload }) => capture(
      Effect_exports.gen(function* () {
        const ext = yield* McpExtensionService;
        return yield* ext.probeEndpoint(payload);
      })
    )
  ).handle(
    "addServer",
    ({ payload }) => capture(
      Effect_exports.gen(function* () {
        const ext = yield* McpExtensionService;
        return yield* ext.addServer(
          toServerInput(payload)
        );
      })
    )
  ).handle(
    "removeServer",
    ({ params: path2 }) => capture(
      Effect_exports.gen(function* () {
        const ext = yield* McpExtensionService;
        yield* ext.removeServer(path2.slug);
        return { removed: true };
      })
    )
  ).handle(
    "getServer",
    ({ params: path2 }) => capture(
      Effect_exports.gen(function* () {
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
      Effect_exports.gen(function* () {
        const ext = yield* McpExtensionService;
        yield* ext.configureServer(path2.slug, payload.config);
        return { config: payload.config };
      })
    )
  ).handle(
    "configureAuth",
    ({ params: path2, payload }) => capture(
      Effect_exports.gen(function* () {
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
var FlatAuthFile = Schema_exports.Record(Schema_exports.String, Schema_exports.String);
var decodeFlatAuthFile = Schema_exports.decodeUnknownEffect(Schema_exports.fromJsonString(FlatAuthFile));
var isFileNotFoundCause = (cause) => typeof cause === "object" && cause !== null && "code" in cause && cause.code === "ENOENT";
var toStorageError = (message) => (cause) => new StorageError({ message, cause });
var readAll = (filePath) => {
  if (!fs.existsSync(filePath)) return Effect_exports.succeed({});
  return Effect_exports.try({
    try: () => fs.readFileSync(filePath, "utf-8"),
    catch: toStorageError("Failed to read auth file")
  }).pipe(
    Effect_exports.catchIf(
      (error) => isFileNotFoundCause(error.cause),
      () => Effect_exports.succeed("")
    ),
    Effect_exports.flatMap(
      (raw) => raw === "" ? Effect_exports.succeed({}) : decodeFlatAuthFile(raw).pipe(
        Effect_exports.mapError(toStorageError("Failed to parse auth file"))
      )
    )
  );
};
var writeAll = (filePath, secrets) => {
  const dir = path.dirname(filePath);
  const tmp = `${filePath}.tmp`;
  return Effect_exports.gen(function* () {
    if (!fs.existsSync(dir)) {
      yield* Effect_exports.try({
        try: () => fs.mkdirSync(dir, { recursive: true, mode: 448 }),
        catch: toStorageError("Failed to create auth directory")
      });
    }
    yield* Effect_exports.try({
      try: () => fs.writeFileSync(tmp, JSON.stringify(secrets, null, 2), { mode: 384 }),
      catch: toStorageError("Failed to write temporary auth file")
    });
    yield* Effect_exports.try({
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
  get: (id) => readAll(filePath).pipe(Effect_exports.map((data) => data[id] ?? null)),
  has: (id) => readAll(filePath).pipe(Effect_exports.map((data) => id in data)),
  set: (id, value) => Effect_exports.gen(function* () {
    const data = yield* readAll(filePath);
    data[id] = value;
    yield* writeAll(filePath, data);
  }),
  delete: (id) => Effect_exports.gen(function* () {
    const data = yield* readAll(filePath);
    if (id in data) {
      delete data[id];
      yield* writeAll(filePath, data);
    }
  }),
  list: () => readAll(filePath).pipe(
    Effect_exports.map((data) => Object.keys(data).map((k) => ({ id: ProviderItemId.make(k), name: k })))
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
