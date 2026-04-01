import { Context, Effect, Schema } from "effect";

import { SecretId, ScopeId } from "./ids";
import { SecretNotFoundError, SecretResolutionError } from "./errors";

export class Secret extends Schema.Class<Secret>("Secret")({
  id: SecretId,
  scopeId: ScopeId,
  name: Schema.String,
  purpose: Schema.optional(Schema.String),
  createdAt: Schema.DateFromNumber,
}) {}

export class SecretStore extends Context.Tag("@executor/sdk/SecretStore")<
  SecretStore,
  {
    readonly list: (scopeId: ScopeId) => Effect.Effect<readonly Secret[]>;
    readonly get: (
      secretId: SecretId,
    ) => Effect.Effect<Secret, SecretNotFoundError>;
    readonly resolve: (
      secretId: SecretId,
    ) => Effect.Effect<string, SecretNotFoundError | SecretResolutionError>;
    readonly store: (input: {
      readonly scopeId: ScopeId;
      readonly name: string;
      readonly value: string;
      readonly purpose?: string;
    }) => Effect.Effect<Secret>;
    readonly remove: (
      secretId: SecretId,
    ) => Effect.Effect<boolean, SecretNotFoundError>;
  }
>() {}
