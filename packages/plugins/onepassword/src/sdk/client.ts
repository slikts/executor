import { Duration, Effect } from "effect";
import {
  createClient,
  DesktopAuth,
  type Client,
} from "@1password/sdk";

import { OnePasswordError } from "./errors";

// ---------------------------------------------------------------------------
// Resolved auth — raw credentials ready for the SDK
// ---------------------------------------------------------------------------

export type ResolvedAuth =
  | { readonly kind: "desktop-app"; readonly accountName: string }
  | { readonly kind: "service-account"; readonly token: string };

// ---------------------------------------------------------------------------
// 1Password client wrapper using the Effect "use" pattern
// ---------------------------------------------------------------------------

export interface OnePasswordClient {
  /** The raw 1Password SDK client (escape hatch) */
  readonly client: Client;

  /**
   * Execute a function against the 1Password client with automatic
   * error handling, timeout, and tracing.
   */
  readonly use: <A>(
    fn: (client: Client) => Promise<A>,
    operation?: string,
  ) => Effect.Effect<A, OnePasswordError>;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

const DEFAULT_TIMEOUT_MS = 15_000;

export const makeOnePasswordClient = (
  auth: ResolvedAuth,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Effect.Effect<OnePasswordClient, OnePasswordError> =>
  Effect.gen(function* () {
    const timeout = Duration.millis(timeoutMs);

    const client = yield* Effect.tryPromise({
      try: () =>
        createClient({
          auth:
            auth.kind === "desktop-app"
              ? new DesktopAuth(auth.accountName)
              : auth.token,
          integrationName: "Executor",
          integrationVersion: "0.0.0",
        }),
      catch: (cause) =>
        new OnePasswordError({
          operation: "client setup",
          message: cause instanceof Error ? cause.message : String(cause),
        }),
    }).pipe(
      Effect.timeoutFail({
        duration: timeout,
        onTimeout: () =>
          new OnePasswordError({
            operation: "client setup",
            message: `timed out after ${Math.floor(timeoutMs / 1000)}s — approve the request in the 1Password desktop app and try again`,
          }),
      }),
    );

    const use = <A>(
      fn: (client: Client) => Promise<A>,
      operation = "use",
    ): Effect.Effect<A, OnePasswordError> =>
      Effect.tryPromise({
        try: () => fn(client),
        catch: (cause) =>
          new OnePasswordError({
            operation,
            message: cause instanceof Error ? cause.message : String(cause),
          }),
      }).pipe(
        Effect.timeoutFail({
          duration: timeout,
          onTimeout: () =>
            new OnePasswordError({
              operation,
              message: `timed out after ${Math.floor(timeoutMs / 1000)}s — approve the request in the 1Password desktop app and try again`,
            }),
        }),
        Effect.withSpan(`onepassword.${operation}`),
      );

    return { client, use } satisfies OnePasswordClient;
  }).pipe(Effect.withSpan("onepassword.make_client"));
