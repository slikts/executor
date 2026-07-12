// ---------------------------------------------------------------------------
// promise-runtime — the effect runner behind every Promise-surface adapter.
// ---------------------------------------------------------------------------
//
// The Promise adapters (`promise-executor.ts`, `@executor-js/execution/promise`,
// the MCP tool-server Promise wrapper) each run effects with a bare
// `Effect.runPromise`, which uses the default context: no tracer, no log
// exporter. Every span and log produced inside the SDK is dropped for
// Promise-surface consumers.
//
// This module centralizes the runner so a host can opt into telemetry with
// plain data (no Effect values cross the Promise boundary). When configured,
// all adapter-run effects execute inside a shared ManagedRuntime holding the
// OTLP exporter layer, so each top-level run (for example one
// `engine.execute` call) produces a complete, properly nested trace and its
// logs are exported alongside.
// ---------------------------------------------------------------------------

import { Effect, Layer, ManagedRuntime } from "effect";
import type * as Duration from "effect/Duration";
import { FetchHttpClient } from "effect/unstable/http";
import { Otlp } from "effect/unstable/observability";

export interface PromiseTelemetryConfig {
  /** OTLP/HTTP base URL, e.g. "http://127.0.0.1:4318". */
  readonly otlpBaseUrl: string;
  readonly serviceName: string;
  readonly serviceVersion?: string;
  /** Export intervals; default "1 second" to suit short-lived dev hosts. */
  readonly exportInterval?: string;
}

type AdapterRuntime = ManagedRuntime.ManagedRuntime<never, never>;

let telemetryRuntime: AdapterRuntime | null = null;
let activeConfig: PromiseTelemetryConfig | null = null;

const sameConfig = (a: PromiseTelemetryConfig, b: PromiseTelemetryConfig): boolean =>
  a.otlpBaseUrl === b.otlpBaseUrl &&
  a.serviceName === b.serviceName &&
  a.serviceVersion === b.serviceVersion &&
  a.exportInterval === b.exportInterval;

/**
 * Enable OTLP telemetry for all Promise-surface effect runs in this process.
 * Idempotent for an identical config; a changed config disposes the previous
 * runtime and builds a fresh one. Safe to call before or between executor
 * creations; effects already in flight keep their original runtime.
 */
export const configurePromiseTelemetry = (config: PromiseTelemetryConfig): void => {
  if (activeConfig && sameConfig(activeConfig, config)) return;
  const previous = telemetryRuntime;
  // Public config keeps a plain string so no Effect type crosses the
  // Promise-surface boundary; Otlp accepts "1 second"-style inputs.
  const interval = (config.exportInterval ?? "1 second") as Duration.Input;
  const layer = Otlp.layerJson({
    baseUrl: config.otlpBaseUrl,
    resource: {
      serviceName: config.serviceName,
      ...(config.serviceVersion !== undefined ? { serviceVersion: config.serviceVersion } : {}),
    },
    loggerExportInterval: interval,
    tracerExportInterval: interval,
  }).pipe(Layer.provide(FetchHttpClient.layer));
  telemetryRuntime = ManagedRuntime.make(Layer.orDie(layer)) as AdapterRuntime;
  activeConfig = config;
  if (previous) {
    void previous.dispose();
  }
};

/** Flush and drop the telemetry runtime; runs fall back to the default context. */
export const disposePromiseTelemetry = async (): Promise<void> => {
  const runtime = telemetryRuntime;
  telemetryRuntime = null;
  activeConfig = null;
  if (runtime) {
    await runtime.dispose();
  }
};

/** Runner used by every Promise-surface adapter in place of bare runPromise. */
export const runAdapterPromise = <A, E>(effect: Effect.Effect<A, E>): Promise<A> =>
  telemetryRuntime ? telemetryRuntime.runPromise(effect) : Effect.runPromise(effect);
