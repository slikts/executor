type OtlpEndpointEnv = {
  readonly AXIOM_TOKEN?: string;
  readonly AXIOM_DATASET?: string;
  readonly AXIOM_TRACES_URL?: string;
  readonly OTEL_EXPORTER_OTLP_ENDPOINT?: string;
  readonly OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: string;
};

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

const normalizeOtlpTracesEndpoint = (value: string): string => {
  const url = new URL(value);
  const pathname = trimTrailingSlash(url.pathname);
  url.pathname = pathname.endsWith("/v1") ? `${pathname}/traces` : `${pathname || ""}/v1/traces`;
  return url.toString();
};

export type OtlpTraceExportConfig = {
  readonly endpoint: string | null;
  readonly headers: Record<string, string> | undefined;
};

export const resolveOtlpTraceExportConfig = (env: OtlpEndpointEnv): OtlpTraceExportConfig => {
  const configuredEndpoint =
    env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ?? env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (configuredEndpoint) {
    return {
      endpoint: normalizeOtlpTracesEndpoint(configuredEndpoint),
      headers: undefined,
    };
  }
  if (env.AXIOM_TOKEN) {
    return {
      endpoint: env.AXIOM_TRACES_URL ?? "https://api.axiom.co/v1/traces",
      headers: {
        Authorization: `Bearer ${env.AXIOM_TOKEN}`,
        "X-Axiom-Dataset": env.AXIOM_DATASET ?? "executor-cloud",
      },
    };
  }
  return { endpoint: null, headers: undefined };
};

export const resolveOtlpProxyTarget = (env: OtlpEndpointEnv): string | null => {
  const configuredEndpoint =
    env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ?? env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!configuredEndpoint) return null;
  const url = new URL(normalizeOtlpTracesEndpoint(configuredEndpoint));
  url.pathname = trimTrailingSlash(url.pathname).replace(/\/v1\/traces$/, "");
  return url.toString();
};
