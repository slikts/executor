import { describe, expect, it } from "@effect/vitest";

import { resolveOtlpProxyTarget, resolveOtlpTraceExportConfig } from "./otlp";

describe("OTLP endpoint resolution", () => {
  it("uses generic OTLP endpoints without auth headers", () => {
    expect(
      resolveOtlpTraceExportConfig({
        OTEL_EXPORTER_OTLP_ENDPOINT: "http://collector.local:4318",
        AXIOM_TOKEN: "axiom-secret",
      }),
    ).toEqual({ endpoint: "http://collector.local:4318/v1/traces", headers: undefined });
  });

  it("falls back to Axiom when no collector endpoint is configured", () => {
    expect(
      resolveOtlpTraceExportConfig({
        AXIOM_TOKEN: "axiom-secret",
        AXIOM_DATASET: "executor-cloud",
      }),
    ).toEqual({
      endpoint: "https://api.axiom.co/v1/traces",
      headers: {
        Authorization: "Bearer axiom-secret",
        "X-Axiom-Dataset": "executor-cloud",
      },
    });
  });

  it("derives a proxy target from the collector base URL", () => {
    expect(
      resolveOtlpProxyTarget({
        OTEL_EXPORTER_OTLP_ENDPOINT: "http://collector.local:4318",
      }),
    ).toBe("http://collector.local:4318/");
  });
});
