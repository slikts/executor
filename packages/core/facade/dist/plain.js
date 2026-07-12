import {
  createExecutorMcpServer
} from "./chunk-AVE4TQAV.js";
import {
  makeQuickJsExecutor
} from "./chunk-3OWQQ3OW.js";
import {
  createExecutionEngine
} from "./chunk-CZJC23SB.js";
import {
  mcpPlugin
} from "./chunk-EOIP2MB5.js";
import "./chunk-NUUHIX6O.js";
import {
  FetchHttpClient_exports,
  HttpClient,
  ProviderItemId,
  ProviderKey,
  Subject,
  Tenant,
  TracerPropagationEnabled,
  appendUrl,
  collectTables,
  createExecutor,
  filterStatusOk,
  fromInput,
  fromRecordUnsafe,
  get as get2,
  isHttpClientError,
  jsonUnsafe,
  merge,
  post,
  retryTransient,
  setBody,
  transformResponse,
  uint8Array
} from "./chunk-PWAKBQOM.js";
import {
  Clock,
  CurrentLogAnnotations,
  CurrentLogSpans,
  Effect_exports,
  Layer_exports,
  ManagedRuntime_exports,
  Record,
  Scope,
  Service,
  String as String2,
  Tracer,
  UndefinedOr,
  addDelay,
  addFinalizer,
  allocate,
  andThen,
  annotateLogs,
  asVoid,
  catchCause,
  context,
  effect,
  effectDiscard,
  ensure,
  flatMap,
  flow,
  fnUntraced,
  forever,
  forever2,
  forkIn,
  format,
  fromInputUnsafe,
  fromUndefinedOr,
  get,
  getOrElse,
  hasInterruptsOnly,
  ignore,
  interruptible,
  isSome,
  layer,
  logDebug,
  make2 as make,
  make4 as make2,
  match,
  max,
  mergeAll,
  orDie,
  parse,
  passthrough,
  pretty,
  prettyErrors,
  provide,
  provideService,
  runForkWith,
  runIn,
  schema,
  seconds,
  sleep,
  snapshotUnsafe,
  succeed2 as succeed,
  succeed3 as succeed2,
  suspend,
  timeoutOption,
  void_,
  withTracerEnabled,
  zero
} from "./chunk-XRXVQF6Q.js";
import {
  __export
} from "./chunk-4VNS5WPM.js";

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/Otlp.js
var Otlp_exports = {};
__export(Otlp_exports, {
  layer: () => layer5,
  layerJson: () => layerJson2,
  layerProtobuf: () => layerProtobuf2
});

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/OtlpExporter.js
var policy = /* @__PURE__ */ forever.pipe(passthrough, /* @__PURE__ */ addDelay((error) => {
  if (isHttpClientError(error) && error.reason._tag === "StatusCodeError" && error.reason.response.status === 429) {
    const retryAfter = fromUndefinedOr(error.reason.response.headers["retry-after"]).pipe(flatMap(parse), getOrElse(() => 5));
    return succeed2(seconds(retryAfter));
  }
  return succeed2(seconds(1));
}));
var make3 = /* @__PURE__ */ fnUntraced(function* (options) {
  const services = yield* context();
  const clock = get(services, Clock);
  const scope = get(services, Scope);
  const runFork = runForkWith(services);
  const exportInterval = max(fromInputUnsafe(options.exportInterval), zero);
  let disabledUntil = void 0;
  const client = filterStatusOk(get(services, HttpClient)).pipe(transformResponse(provideService(TracerPropagationEnabled, false)), retryTransient({
    schedule: policy,
    times: 3
  }));
  let headers = fromRecordUnsafe({
    "user-agent": `effect-opentelemetry-${options.label}/0.0.0`
  });
  if (options.headers) {
    headers = merge(fromInput(options.headers), headers);
  }
  const request = post(options.url, {
    headers
  });
  let buffer = [];
  const runExport = suspend(() => {
    if (disabledUntil !== void 0 && clock.currentTimeMillisUnsafe() < disabledUntil) {
      return void_;
    } else if (disabledUntil !== void 0) {
      disabledUntil = void 0;
    }
    const items = buffer;
    if (options.maxBatchSize !== "disabled") {
      if (buffer.length === 0) {
        return void_;
      }
      buffer = [];
    }
    return client.execute(setBody(request, options.body(items))).pipe(asVoid, withTracerEnabled(false));
  }).pipe(catchCause((cause) => {
    if (disabledUntil !== void 0) return void_;
    disabledUntil = clock.currentTimeMillisUnsafe() + 6e4;
    buffer = [];
    return logDebug("Disabling exporter for 60 seconds", cause);
  }), annotateLogs({
    package: "@effect/opentelemetry",
    module: options.label
  }));
  yield* addFinalizer(scope, runExport.pipe(ignore, interruptible, timeoutOption(options.shutdownTimeout)));
  yield* sleep(exportInterval).pipe(andThen(runExport), forever2, forkIn(scope));
  return {
    push(data) {
      if (disabledUntil !== void 0) return;
      buffer.push(data);
      if (options.maxBatchSize !== "disabled" && buffer.length >= options.maxBatchSize) {
        runIn(runFork(runExport), scope);
      }
    }
  };
});

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/OtlpResource.js
var make4 = (options) => {
  const resourceAttributes = options.attributes ? entriesToAttributes(Object.entries(options.attributes)) : [];
  resourceAttributes.push({
    key: "service.name",
    value: {
      stringValue: options.serviceName
    }
  });
  if (options.serviceVersion) {
    resourceAttributes.push({
      key: "service.version",
      value: {
        stringValue: options.serviceVersion
      }
    });
  }
  return {
    attributes: resourceAttributes,
    droppedAttributesCount: 0
  };
};
var fromConfig = /* @__PURE__ */ fnUntraced(function* (options) {
  const attributes = {
    ...yield* schema(UndefinedOr(Record(String2, String2)), "OTEL_RESOURCE_ATTRIBUTES"),
    ...options?.attributes
  };
  const serviceName = options?.serviceName ?? attributes["service.name"] ?? (yield* schema(String2, "OTEL_SERVICE_NAME"));
  delete attributes["service.name"];
  const serviceVersion = options?.serviceVersion ?? attributes["service.version"] ?? (yield* schema(UndefinedOr(String2), "OTEL_SERVICE_VERSION"));
  delete attributes["service.version"];
  return make4({
    serviceName,
    serviceVersion,
    attributes
  });
}, orDie);
var serviceNameUnsafe = (resource) => {
  const serviceNameAttribute = resource.attributes.find((attr) => attr.key === "service.name");
  if (!serviceNameAttribute || !serviceNameAttribute.value.stringValue) {
    throw new Error("Resource does not contain a service name");
  }
  return serviceNameAttribute.value.stringValue;
};
var entriesToAttributes = (entries) => {
  const attributes = [];
  for (const [key, value] of entries) {
    attributes.push({
      key,
      value: unknownToAttributeValue(value)
    });
  }
  return attributes;
};
var unknownToAttributeValue = (value) => {
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(unknownToAttributeValue)
      }
    };
  }
  switch (typeof value) {
    case "string":
      return {
        stringValue: value
      };
    case "bigint":
      return {
        intValue: Number(value)
      };
    case "number":
      return Number.isInteger(value) ? {
        intValue: value
      } : {
        doubleValue: value
      };
    case "boolean":
      return {
        boolValue: value
      };
    default:
      return {
        stringValue: format(value)
      };
  }
};

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/internal/protobuf.js
var WireType = {
  Varint: 0,
  Fixed64: 1,
  LengthDelimited: 2,
  Fixed32: 5
};
var encodeTag = (fieldNumber, wireType) => fieldNumber << 3 | wireType;
var encodeVarint = (value) => {
  const bytes = [];
  let n = typeof value === "bigint" ? value : BigInt(value);
  while (n > BigInt(127)) {
    bytes.push(Number(n & BigInt(127)) | 128);
    n >>= BigInt(7);
  }
  bytes.push(Number(n));
  return new Uint8Array(bytes);
};
var encodeFixed64 = (value) => {
  const bytes = new Uint8Array(8);
  const view = new DataView(bytes.buffer);
  view.setBigUint64(0, value, true);
  return bytes;
};
var encodeFixed32 = (value) => {
  const bytes = new Uint8Array(4);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, value, true);
  return bytes;
};
var encodeDouble = (value) => {
  const bytes = new Uint8Array(8);
  const view = new DataView(bytes.buffer);
  view.setFloat64(0, value, true);
  return bytes;
};
var encodeString = (value) => new TextEncoder().encode(value);
var encodeHexBytes = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
};
var concat = (...arrays) => {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
};
var varintField = (fieldNumber, value) => concat(encodeVarint(encodeTag(fieldNumber, WireType.Varint)), encodeVarint(value));
var boolField = (fieldNumber, value) => varintField(fieldNumber, value ? 1 : 0);
var fixed64Field = (fieldNumber, value) => concat(encodeVarint(encodeTag(fieldNumber, WireType.Fixed64)), encodeFixed64(value));
var fixed32Field = (fieldNumber, value) => concat(encodeVarint(encodeTag(fieldNumber, WireType.Fixed32)), encodeFixed32(value));
var doubleField = (fieldNumber, value) => concat(encodeVarint(encodeTag(fieldNumber, WireType.Fixed64)), encodeDouble(value));
var lengthDelimitedField = (fieldNumber, value) => concat(encodeVarint(encodeTag(fieldNumber, WireType.LengthDelimited)), encodeVarint(value.length), value);
var stringField = (fieldNumber, value) => lengthDelimitedField(fieldNumber, encodeString(value));
var bytesFieldFromHex = (fieldNumber, hex) => lengthDelimitedField(fieldNumber, encodeHexBytes(hex));
var messageField = (fieldNumber, message) => lengthDelimitedField(fieldNumber, message);
var repeatedField = (fieldNumber, values, encode) => concat(...values.map((v) => messageField(fieldNumber, encode(v))));
var optionalStringField = (fieldNumber, value) => value !== void 0 && value !== "" ? stringField(fieldNumber, value) : new Uint8Array(0);

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/internal/otlpProtobuf.js
var encodeAnyValue = (value) => {
  if (value.stringValue !== void 0 && value.stringValue !== null) {
    return stringField(1, value.stringValue);
  }
  if (value.boolValue !== void 0 && value.boolValue !== null) {
    return boolField(2, value.boolValue);
  }
  if (value.intValue !== void 0 && value.intValue !== null) {
    return varintField(3, BigInt(value.intValue));
  }
  if (value.doubleValue !== void 0 && value.doubleValue !== null) {
    return doubleField(4, value.doubleValue);
  }
  if (value.arrayValue !== void 0) {
    return messageField(5, encodeArrayValue(value.arrayValue));
  }
  if (value.kvlistValue !== void 0) {
    return messageField(6, encodeKeyValueList(value.kvlistValue));
  }
  if (value.bytesValue !== void 0) {
    return lengthDelimitedField(7, value.bytesValue);
  }
  return new Uint8Array(0);
};
var encodeArrayValue = (value) => repeatedField(1, value.values, encodeAnyValue);
var encodeKeyValueList = (value) => repeatedField(1, value.values, encodeKeyValue);
var encodeKeyValue = (kv) => concat(stringField(1, kv.key), messageField(2, encodeAnyValue(kv.value)));
var encodeInstrumentationScope = (scope) => concat(stringField(1, scope.name), optionalStringField(2, scope.version), scope.attributes ? repeatedField(3, scope.attributes, encodeKeyValue) : new Uint8Array(0), scope.droppedAttributesCount ? varintField(4, scope.droppedAttributesCount) : new Uint8Array(0));
var encodeResource = (resource) => concat(repeatedField(1, resource.attributes, encodeKeyValue), resource.droppedAttributesCount > 0 ? varintField(2, resource.droppedAttributesCount) : new Uint8Array(0));
var encodeStatus = (status) => concat(optionalStringField(2, status.message), varintField(3, status.code));
var encodeEvent = (event) => concat(fixed64Field(1, BigInt(event.timeUnixNano)), stringField(2, event.name), repeatedField(3, event.attributes, encodeKeyValue), event.droppedAttributesCount > 0 ? varintField(4, event.droppedAttributesCount) : new Uint8Array(0));
var encodeLink = (link) => concat(bytesFieldFromHex(1, link.traceId), bytesFieldFromHex(2, link.spanId), optionalStringField(3, link.traceState), repeatedField(4, link.attributes, encodeKeyValue), link.droppedAttributesCount > 0 ? varintField(5, link.droppedAttributesCount) : new Uint8Array(0), link.flags !== void 0 ? fixed32Field(6, link.flags) : new Uint8Array(0));
var encodeSpan = (span) => concat(bytesFieldFromHex(1, span.traceId), bytesFieldFromHex(2, span.spanId), optionalStringField(3, span.traceState), span.parentSpanId !== void 0 ? bytesFieldFromHex(4, span.parentSpanId) : new Uint8Array(0), stringField(5, span.name), varintField(6, span.kind), fixed64Field(7, BigInt(span.startTimeUnixNano)), fixed64Field(8, BigInt(span.endTimeUnixNano)), repeatedField(9, span.attributes, encodeKeyValue), span.droppedAttributesCount > 0 ? varintField(10, span.droppedAttributesCount) : new Uint8Array(0), repeatedField(11, span.events, encodeEvent), span.droppedEventsCount > 0 ? varintField(12, span.droppedEventsCount) : new Uint8Array(0), repeatedField(13, span.links, encodeLink), span.droppedLinksCount > 0 ? varintField(14, span.droppedLinksCount) : new Uint8Array(0), messageField(15, encodeStatus(span.status)), span.flags !== void 0 ? fixed32Field(16, span.flags) : new Uint8Array(0));
var encodeScopeSpans = (scopeSpans) => concat(messageField(1, encodeInstrumentationScope(scopeSpans.scope)), repeatedField(2, scopeSpans.spans, encodeSpan), optionalStringField(3, scopeSpans.schemaUrl));
var encodeResourceSpans = (resourceSpans) => concat(messageField(1, encodeResource(resourceSpans.resource)), repeatedField(2, resourceSpans.scopeSpans, encodeScopeSpans), optionalStringField(3, resourceSpans.schemaUrl));
var encodeTracesData = (tracesData) => repeatedField(1, tracesData.resourceSpans, encodeResourceSpans);
var encodeNumberDataPoint = (point) => concat(fixed64Field(2, BigInt(point.startTimeUnixNano)), fixed64Field(3, BigInt(point.timeUnixNano)), point.asDouble !== void 0 ? doubleField(4, point.asDouble) : new Uint8Array(0), point.asInt !== void 0 ? fixed64Field(6, BigInt(point.asInt)) : new Uint8Array(0), repeatedField(7, point.attributes, encodeKeyValue), point.flags !== void 0 ? varintField(8, point.flags) : new Uint8Array(0));
var encodeHistogramDataPoint = (point) => {
  const bucketCountsEncoded = concat(...point.bucketCounts.map((count) => fixed64Field(6, BigInt(count))));
  const explicitBoundsEncoded = concat(...point.explicitBounds.map((bound) => doubleField(7, bound)));
  return concat(fixed64Field(2, BigInt(point.startTimeUnixNano)), fixed64Field(3, BigInt(point.timeUnixNano)), fixed64Field(4, BigInt(point.count)), point.sum !== void 0 ? doubleField(5, point.sum) : new Uint8Array(0), bucketCountsEncoded, explicitBoundsEncoded, repeatedField(9, point.attributes, encodeKeyValue), point.flags !== void 0 ? varintField(10, point.flags) : new Uint8Array(0), point.min !== void 0 ? doubleField(11, point.min) : new Uint8Array(0), point.max !== void 0 ? doubleField(12, point.max) : new Uint8Array(0));
};
var encodeGauge = (gauge) => repeatedField(1, gauge.dataPoints, encodeNumberDataPoint);
var encodeSum = (sum) => concat(repeatedField(1, sum.dataPoints, encodeNumberDataPoint), varintField(2, sum.aggregationTemporality), boolField(3, sum.isMonotonic));
var encodeHistogram = (histogram) => concat(repeatedField(1, histogram.dataPoints, encodeHistogramDataPoint), varintField(2, histogram.aggregationTemporality));
var encodeMetric = (metric) => concat(stringField(1, metric.name), optionalStringField(2, metric.description), optionalStringField(3, metric.unit), metric.gauge !== void 0 ? messageField(5, encodeGauge(metric.gauge)) : new Uint8Array(0), metric.sum !== void 0 ? messageField(7, encodeSum(metric.sum)) : new Uint8Array(0), metric.histogram !== void 0 ? messageField(9, encodeHistogram(metric.histogram)) : new Uint8Array(0));
var encodeScopeMetrics = (scopeMetrics) => concat(messageField(1, encodeInstrumentationScope(scopeMetrics.scope)), repeatedField(2, scopeMetrics.metrics, encodeMetric), optionalStringField(3, scopeMetrics.schemaUrl));
var encodeResourceMetrics = (resourceMetrics) => concat(messageField(1, encodeResource(resourceMetrics.resource)), repeatedField(2, resourceMetrics.scopeMetrics, encodeScopeMetrics), optionalStringField(3, resourceMetrics.schemaUrl));
var encodeMetricsData = (metricsData) => repeatedField(1, metricsData.resourceMetrics, encodeResourceMetrics);
var encodeLogRecord = (record) => concat(fixed64Field(1, BigInt(record.timeUnixNano)), record.severityNumber !== void 0 ? varintField(2, record.severityNumber) : new Uint8Array(0), optionalStringField(3, record.severityText), record.body !== void 0 ? messageField(5, encodeAnyValue(record.body)) : new Uint8Array(0), repeatedField(6, record.attributes, encodeKeyValue), record.droppedAttributesCount !== void 0 && record.droppedAttributesCount > 0 ? varintField(7, record.droppedAttributesCount) : new Uint8Array(0), record.flags !== void 0 ? fixed32Field(8, record.flags) : new Uint8Array(0), record.traceId !== void 0 && record.traceId !== "" ? bytesFieldFromHex(9, record.traceId) : new Uint8Array(0), record.spanId !== void 0 && record.spanId !== "" ? bytesFieldFromHex(10, record.spanId) : new Uint8Array(0), record.observedTimeUnixNano !== void 0 ? fixed64Field(11, BigInt(record.observedTimeUnixNano)) : new Uint8Array(0));
var encodeScopeLogs = (scopeLogs) => concat(messageField(1, encodeInstrumentationScope(scopeLogs.scope)), repeatedField(2, scopeLogs.logRecords, encodeLogRecord), optionalStringField(3, scopeLogs.schemaUrl));
var encodeResourceLogs = (resourceLogs) => concat(messageField(1, encodeResource(resourceLogs.resource)), repeatedField(2, resourceLogs.scopeLogs, encodeScopeLogs), optionalStringField(3, resourceLogs.schemaUrl));
var encodeLogsData = (logsData) => repeatedField(1, logsData.resourceLogs, encodeResourceLogs);

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/OtlpSerialization.js
var OtlpSerialization = class extends (/* @__PURE__ */ Service()("effect/observability/OtlpSerialization")) {
};
var layerJson = /* @__PURE__ */ succeed(OtlpSerialization, {
  traces: (spans) => jsonUnsafe(spans),
  metrics: (metrics) => jsonUnsafe(metrics),
  logs: (logs) => jsonUnsafe(logs)
});
var layerProtobuf = /* @__PURE__ */ succeed(OtlpSerialization, {
  traces: (spans) => uint8Array(encodeTracesData(spans), "application/x-protobuf"),
  metrics: (metrics) => uint8Array(encodeMetricsData(metrics), "application/x-protobuf"),
  logs: (logs) => uint8Array(encodeLogsData(logs), "application/x-protobuf")
});

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/OtlpLogger.js
var make5 = /* @__PURE__ */ fnUntraced(function* (options) {
  const serialization = yield* OtlpSerialization;
  const otelResource = yield* fromConfig(options.resource);
  const scope = {
    name: serviceNameUnsafe(otelResource)
  };
  const exporter = yield* make3({
    label: "OtlpLogger",
    url: options.url,
    headers: options.headers,
    maxBatchSize: options.maxBatchSize ?? 1e3,
    exportInterval: options.exportInterval ?? seconds(1),
    body: (data) => serialization.logs({
      resourceLogs: [{
        resource: otelResource,
        scopeLogs: [{
          scope,
          logRecords: data
        }]
      }]
    }),
    shutdownTimeout: options.shutdownTimeout ?? seconds(3)
  });
  const opts = {
    excludeLogSpans: options.excludeLogSpans ?? false,
    clock: yield* Clock
  };
  return make2((options2) => {
    exporter.push(makeLogRecord(options2, opts));
  });
});
var layer2 = (options) => layer([make5(options)], {
  mergeWithExisting: options.mergeWithExisting ?? true
});
var makeLogRecord = (options, opts) => {
  const now = opts.clock.currentTimeNanosUnsafe();
  const nanosString = now.toString();
  const nowMillis = options.date.getTime();
  const attributes = entriesToAttributes(Object.entries(options.fiber.getRef(CurrentLogAnnotations)));
  attributes.push({
    key: "fiberId",
    value: {
      intValue: options.fiber.id
    }
  });
  if (!opts.excludeLogSpans) {
    for (const [label, startTime] of options.fiber.getRef(CurrentLogSpans)) {
      attributes.push({
        key: `logSpan.${label}`,
        value: {
          stringValue: `${nowMillis - startTime}ms`
        }
      });
    }
  }
  if (options.cause.reasons.length > 0) {
    attributes.push({
      key: "log.error",
      value: {
        stringValue: pretty(options.cause)
      }
    });
  }
  const message = ensure(options.message);
  const logRecord = {
    severityNumber: logLevelToSeverityNumber(options.logLevel),
    severityText: options.logLevel,
    timeUnixNano: nanosString,
    observedTimeUnixNano: nanosString,
    attributes,
    body: unknownToAttributeValue(message.length === 1 ? message[0] : message),
    droppedAttributesCount: 0
  };
  if (options.fiber.currentSpan) {
    logRecord.traceId = options.fiber.currentSpan.traceId;
    logRecord.spanId = options.fiber.currentSpan.spanId;
  }
  return logRecord;
};
var logLevelToSeverityNumber = (logLevel) => {
  switch (logLevel) {
    case "Trace":
      return ESeverityNumber.SEVERITY_NUMBER_TRACE;
    case "Debug":
      return ESeverityNumber.SEVERITY_NUMBER_DEBUG;
    case "Info":
      return ESeverityNumber.SEVERITY_NUMBER_INFO;
    case "Warn":
      return ESeverityNumber.SEVERITY_NUMBER_WARN;
    case "Error":
      return ESeverityNumber.SEVERITY_NUMBER_ERROR;
    case "Fatal":
      return ESeverityNumber.SEVERITY_NUMBER_FATAL;
    default:
      return ESeverityNumber.SEVERITY_NUMBER_UNSPECIFIED;
  }
};
var ESeverityNumber = {
  /** Unspecified. Do NOT use as default */
  SEVERITY_NUMBER_UNSPECIFIED: 0,
  SEVERITY_NUMBER_TRACE: 1,
  SEVERITY_NUMBER_TRACE2: 2,
  SEVERITY_NUMBER_TRACE3: 3,
  SEVERITY_NUMBER_TRACE4: 4,
  SEVERITY_NUMBER_DEBUG: 5,
  SEVERITY_NUMBER_DEBUG2: 6,
  SEVERITY_NUMBER_DEBUG3: 7,
  SEVERITY_NUMBER_DEBUG4: 8,
  SEVERITY_NUMBER_INFO: 9,
  SEVERITY_NUMBER_INFO2: 10,
  SEVERITY_NUMBER_INFO3: 11,
  SEVERITY_NUMBER_INFO4: 12,
  SEVERITY_NUMBER_WARN: 13,
  SEVERITY_NUMBER_WARN2: 14,
  SEVERITY_NUMBER_WARN3: 15,
  SEVERITY_NUMBER_WARN4: 16,
  SEVERITY_NUMBER_ERROR: 17,
  SEVERITY_NUMBER_ERROR2: 18,
  SEVERITY_NUMBER_ERROR3: 19,
  SEVERITY_NUMBER_ERROR4: 20,
  SEVERITY_NUMBER_FATAL: 21,
  SEVERITY_NUMBER_FATAL2: 22,
  SEVERITY_NUMBER_FATAL3: 23,
  SEVERITY_NUMBER_FATAL4: 24
};

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/OtlpMetrics.js
var make6 = /* @__PURE__ */ fnUntraced(function* (options) {
  const clock = yield* Clock;
  const serialization = yield* OtlpSerialization;
  const startTimeNanos = yield* clock.currentTimeNanos;
  const startTime = String(startTimeNanos);
  const temporality = options.temporality ?? "cumulative";
  const resource = yield* fromConfig(options.resource);
  const metricsScope = {
    name: serviceNameUnsafe(resource)
  };
  const services = yield* context();
  let previousExportTimeNanos = startTimeNanos;
  const previousCounterState = /* @__PURE__ */ new Map();
  const previousHistogramState = /* @__PURE__ */ new Map();
  const previousFrequencyState = /* @__PURE__ */ new Map();
  const previousSummaryState = /* @__PURE__ */ new Map();
  const snapshot = () => {
    const snapshot2 = snapshotUnsafe(services);
    const nowNanos = clock.currentTimeNanosUnsafe();
    const nowTime = String(nowNanos);
    const metricData = [];
    const metricDataByName = /* @__PURE__ */ new Map();
    const addMetricData = (data) => {
      metricData.push(data);
      metricDataByName.set(data.name, data);
    };
    const isDelta = temporality === "delta";
    const aggregationTemporalityEnum = isDelta ? EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA : EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE;
    const intervalStartTime = isDelta ? String(previousExportTimeNanos) : startTime;
    for (let i = 0, len = snapshot2.length; i < len; i++) {
      const state = snapshot2[i];
      const unit = state.attributes?.unit ?? state.attributes?.time_unit ?? "1";
      const attributes = state.attributes ? entriesToAttributes(Object.entries(state.attributes)) : [];
      const metricKey = makeMetricKey(state.id, state.attributes);
      switch (state.type) {
        case "Counter": {
          const currentCount = state.state.count;
          let reportValue = currentCount;
          if (isDelta) {
            const previousCount = previousCounterState.get(metricKey);
            if (previousCount !== void 0) {
              if (typeof currentCount === "bigint" && typeof previousCount === "bigint") {
                reportValue = currentCount - previousCount;
                if (reportValue < BigInt(0)) {
                  reportValue = currentCount;
                }
              } else {
                const curr = Number(currentCount);
                const prev = Number(previousCount);
                reportValue = curr - prev;
                if (reportValue < 0) {
                  reportValue = curr;
                }
              }
            }
            previousCounterState.set(metricKey, currentCount);
          }
          const dataPoint = {
            attributes,
            startTimeUnixNano: intervalStartTime,
            timeUnixNano: nowTime
          };
          if (typeof reportValue === "bigint") {
            dataPoint.asInt = Number(reportValue);
          } else {
            dataPoint.asDouble = reportValue;
          }
          if (metricDataByName.has(state.id)) {
            metricDataByName.get(state.id).sum.dataPoints.push(dataPoint);
          } else {
            addMetricData({
              name: state.id,
              description: state.description,
              unit,
              sum: {
                aggregationTemporality: aggregationTemporalityEnum,
                isMonotonic: state.state.incremental,
                dataPoints: [dataPoint]
              }
            });
          }
          break;
        }
        case "Gauge": {
          const dataPoint = {
            attributes,
            startTimeUnixNano: startTime,
            timeUnixNano: nowTime
          };
          if (typeof state.state.value === "bigint") {
            dataPoint.asInt = Number(state.state.value);
          } else {
            dataPoint.asDouble = state.state.value;
          }
          if (metricDataByName.has(state.id)) {
            metricDataByName.get(state.id).gauge.dataPoints.push(dataPoint);
          } else {
            addMetricData({
              name: state.id,
              description: state.description,
              unit,
              gauge: {
                dataPoints: [dataPoint]
              }
            });
          }
          break;
        }
        case "Histogram": {
          const size = state.state.buckets.length;
          const currentBuckets = {
            boundaries: allocate(size - 1),
            counts: allocate(size)
          };
          let idx = 0;
          let prev = 0;
          for (const [boundary, value] of state.state.buckets) {
            if (idx < size - 1) {
              currentBuckets.boundaries[idx] = boundary;
            }
            currentBuckets.counts[idx] = value - prev;
            prev = value;
            idx++;
          }
          let reportCount = state.state.count;
          let reportSum = state.state.sum;
          let reportBucketCounts = currentBuckets.counts;
          const reportMin = state.state.min;
          const reportMax = state.state.max;
          if (isDelta) {
            const previousState = previousHistogramState.get(metricKey);
            if (previousState !== void 0) {
              reportCount = state.state.count - previousState.count;
              reportSum = state.state.sum - previousState.sum;
              reportBucketCounts = currentBuckets.counts.map((c, i2) => Math.max(0, c - (previousState.bucketCounts[i2] ?? 0)));
            }
            previousHistogramState.set(metricKey, {
              count: state.state.count,
              sum: state.state.sum,
              bucketCounts: currentBuckets.counts.slice(),
              min: state.state.min,
              max: state.state.max
            });
          }
          const dataPoint = {
            attributes,
            startTimeUnixNano: intervalStartTime,
            timeUnixNano: nowTime,
            count: reportCount,
            min: reportMin,
            max: reportMax,
            sum: reportSum,
            bucketCounts: reportBucketCounts,
            explicitBounds: currentBuckets.boundaries
          };
          if (metricDataByName.has(state.id)) {
            metricDataByName.get(state.id).histogram.dataPoints.push(dataPoint);
          } else {
            addMetricData({
              name: state.id,
              description: state.description,
              unit,
              histogram: {
                aggregationTemporality: aggregationTemporalityEnum,
                dataPoints: [dataPoint]
              }
            });
          }
          break;
        }
        case "Frequency": {
          const dataPoints = [];
          const currentOccurrences = /* @__PURE__ */ new Map();
          for (const [freqKey, value] of state.state.occurrences) {
            currentOccurrences.set(freqKey, value);
            let reportValue = value;
            if (isDelta) {
              const previousOccurrences = previousFrequencyState.get(metricKey);
              if (previousOccurrences !== void 0) {
                const previousValue = previousOccurrences.get(freqKey) ?? 0;
                reportValue = Math.max(0, value - previousValue);
              }
            }
            dataPoints.push({
              attributes: [...attributes, {
                key: "key",
                value: {
                  stringValue: freqKey
                }
              }],
              startTimeUnixNano: intervalStartTime,
              timeUnixNano: nowTime,
              asInt: reportValue
            });
          }
          if (isDelta) {
            previousFrequencyState.set(metricKey, currentOccurrences);
          }
          if (metricDataByName.has(state.id)) {
            metricDataByName.get(state.id).sum.dataPoints.push(...dataPoints);
          } else {
            addMetricData({
              name: state.id,
              description: state.description,
              unit,
              sum: {
                aggregationTemporality: aggregationTemporalityEnum,
                isMonotonic: true,
                dataPoints
              }
            });
          }
          break;
        }
        case "Summary": {
          const dataPoints = [{
            attributes: [...attributes, {
              key: "quantile",
              value: {
                stringValue: "min"
              }
            }],
            startTimeUnixNano: intervalStartTime,
            timeUnixNano: nowTime,
            asDouble: state.state.min
          }];
          for (const [quantile, value] of state.state.quantiles) {
            dataPoints.push({
              attributes: [...attributes, {
                key: "quantile",
                value: {
                  stringValue: quantile.toString()
                }
              }],
              startTimeUnixNano: intervalStartTime,
              timeUnixNano: nowTime,
              asDouble: value ?? 0
            });
          }
          dataPoints.push({
            attributes: [...attributes, {
              key: "quantile",
              value: {
                stringValue: "max"
              }
            }],
            startTimeUnixNano: intervalStartTime,
            timeUnixNano: nowTime,
            asDouble: state.state.max
          });
          let reportCount = state.state.count;
          let reportSum = state.state.sum;
          if (isDelta) {
            const previousState = previousSummaryState.get(metricKey);
            if (previousState !== void 0) {
              reportCount = state.state.count - previousState.count;
              reportSum = state.state.sum - previousState.sum;
            }
            previousSummaryState.set(metricKey, {
              count: state.state.count,
              sum: state.state.sum
            });
          }
          const countDataPoint = {
            attributes,
            startTimeUnixNano: intervalStartTime,
            timeUnixNano: nowTime,
            asInt: reportCount
          };
          const sumDataPoint = {
            attributes,
            startTimeUnixNano: intervalStartTime,
            timeUnixNano: nowTime,
            asDouble: reportSum
          };
          if (metricDataByName.has(`${state.id}_quantiles`)) {
            metricDataByName.get(`${state.id}_quantiles`).sum.dataPoints.push(...dataPoints);
            metricDataByName.get(`${state.id}_count`).sum.dataPoints.push(countDataPoint);
            metricDataByName.get(`${state.id}_sum`).sum.dataPoints.push(sumDataPoint);
          } else {
            addMetricData({
              name: `${state.id}_quantiles`,
              description: state.description,
              unit,
              sum: {
                aggregationTemporality: aggregationTemporalityEnum,
                isMonotonic: false,
                dataPoints
              }
            });
            addMetricData({
              name: `${state.id}_count`,
              description: state.description,
              unit: "1",
              sum: {
                aggregationTemporality: aggregationTemporalityEnum,
                isMonotonic: true,
                dataPoints: [countDataPoint]
              }
            });
            addMetricData({
              name: `${state.id}_sum`,
              description: state.description,
              unit: "1",
              sum: {
                aggregationTemporality: aggregationTemporalityEnum,
                isMonotonic: true,
                dataPoints: [sumDataPoint]
              }
            });
          }
          break;
        }
      }
    }
    if (isDelta) {
      previousExportTimeNanos = nowNanos;
    }
    return serialization.metrics({
      resourceMetrics: [{
        resource,
        scopeMetrics: [{
          scope: metricsScope,
          metrics: metricData
        }]
      }]
    });
  };
  yield* make3({
    label: "OtlpMetrics",
    url: options.url,
    headers: options.headers,
    maxBatchSize: "disabled",
    exportInterval: options.exportInterval ?? seconds(10),
    body: snapshot,
    shutdownTimeout: options.shutdownTimeout ?? seconds(3)
  });
});
var layer3 = (options) => effectDiscard(make6(options));
var makeMetricKey = (id, attributes) => {
  if (attributes === void 0 || Object.keys(attributes).length === 0) {
    return id;
  }
  const sortedEntries = Object.entries(attributes).sort((a, b) => a[0].localeCompare(b[0]));
  return `${id}:${JSON.stringify(sortedEntries)}`;
};
var EAggregationTemporality = {
  AGGREGATION_TEMPORALITY_UNSPECIFIED: 0,
  /** DELTA is an AggregationTemporality for a metric aggregator which reports
    changes since last report time. Successive metrics contain aggregation of
    values from continuous and non-overlapping intervals.
       The values for a DELTA metric are based only on the time interval
    associated with one measurement cycle. There is no dependency on
    previous measurements like is the case for CUMULATIVE metrics.
       For example, consider a system measuring the number of requests that
    it receives and reports the sum of these requests every second as a
    DELTA metric:
       1. The system starts receiving at time=t_0.
    2. A request is received, the system measures 1 request.
    3. A request is received, the system measures 1 request.
    4. A request is received, the system measures 1 request.
    5. The 1 second collection cycle ends. A metric is exported for the
        number of requests received over the interval of time t_0 to
        t_0+1 with a value of 3.
    6. A request is received, the system measures 1 request.
    7. A request is received, the system measures 1 request.
    8. The 1 second collection cycle ends. A metric is exported for the
        number of requests received over the interval of time t_0+1 to
        t_0+2 with a value of 2. */
  AGGREGATION_TEMPORALITY_DELTA: 1,
  /** CUMULATIVE is an AggregationTemporality for a metric aggregator which
    reports changes since a fixed start time. This means that current values
    of a CUMULATIVE metric depend on all previous measurements since the
    start time. Because of this, the sender is required to retain this state
    in some form. If this state is lost or invalidated, the CUMULATIVE metric
    values MUST be reset and a new fixed start time following the last
    reported measurement time sent MUST be used.
       For example, consider a system measuring the number of requests that
    it receives and reports the sum of these requests every second as a
    CUMULATIVE metric:
       1. The system starts receiving at time=t_0.
    2. A request is received, the system measures 1 request.
    3. A request is received, the system measures 1 request.
    4. A request is received, the system measures 1 request.
    5. The 1 second collection cycle ends. A metric is exported for the
        number of requests received over the interval of time t_0 to
        t_0+1 with a value of 3.
    6. A request is received, the system measures 1 request.
    7. A request is received, the system measures 1 request.
    8. The 1 second collection cycle ends. A metric is exported for the
        number of requests received over the interval of time t_0 to
        t_0+2 with a value of 5.
    9. The system experiences a fault and loses state.
    10. The system recovers and resumes receiving at time=t_1.
    11. A request is received, the system measures 1 request.
    12. The 1 second collection cycle ends. A metric is exported for the
        number of requests received over the interval of time t_1 to
        t_0+1 with a value of 1.
       Note: Even though, when reporting changes since last report time, using
    CUMULATIVE is valid, it is not recommended. This may cause problems for
    systems that do not use start_time to determine when the aggregation
    value was reset (e.g. Prometheus). */
  AGGREGATION_TEMPORALITY_CUMULATIVE: 2
};

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/OtlpTracer.js
var make7 = /* @__PURE__ */ fnUntraced(function* (options) {
  const otelResource = yield* fromConfig(options.resource);
  const serialization = yield* OtlpSerialization;
  const scope = {
    name: serviceNameUnsafe(otelResource)
  };
  const exporter = yield* make3({
    label: "OtlpTracer",
    url: options.url,
    headers: options.headers,
    exportInterval: options.exportInterval ?? seconds(5),
    maxBatchSize: options.maxBatchSize ?? 1e3,
    body(spans) {
      const data = {
        resourceSpans: [{
          resource: otelResource,
          scopeSpans: [{
            scope,
            spans
          }]
        }]
      };
      return serialization.traces(data);
    },
    shutdownTimeout: options.shutdownTimeout ?? seconds(3)
  });
  function exportFn(span) {
    if (!span.sampled) return;
    exporter.push(makeOtlpSpan(span));
  }
  return make({
    span(options2) {
      return makeSpan({
        ...options2,
        status: {
          _tag: "Started",
          startTime: options2.startTime
        },
        attributes: /* @__PURE__ */ new Map(),
        export: exportFn
      });
    },
    context: options.context ? function(primitive, fiber) {
      if (fiber.currentSpan === void 0) {
        return primitive["~effect/Effect/evaluate"](fiber);
      }
      return options.context(primitive, fiber.currentSpan);
    } : void 0
  });
});
var layer4 = /* @__PURE__ */ flow(make7, /* @__PURE__ */ effect(Tracer));
var SpanProto = {
  _tag: "Span",
  end(endTime, exit) {
    this.status = {
      _tag: "Ended",
      startTime: this.status.startTime,
      endTime,
      exit
    };
    this.export(this);
  },
  attribute(key, value) {
    this.attributes.set(key, value);
  },
  event(name, startTime, attributes) {
    this.events.push([name, startTime, attributes]);
  },
  addLinks(links) {
    this.links.push(...links);
  }
};
var makeSpan = (options) => {
  const self = Object.assign(Object.create(SpanProto), options);
  if (isSome(self.parent)) {
    self.traceId = self.parent.value.traceId;
  } else {
    self.traceId = generateId(32);
  }
  self.spanId = generateId(16);
  self.events = [];
  return self;
};
var generateId = (len) => {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};
var makeOtlpSpan = (self) => {
  const status = self.status;
  const attributes = entriesToAttributes(self.attributes.entries());
  const events = self.events.map(([name, startTime, attributes2]) => ({
    name,
    timeUnixNano: String(startTime),
    attributes: attributes2 ? entriesToAttributes(Object.entries(attributes2)) : [],
    droppedAttributesCount: 0
  }));
  let otelStatus;
  if (status.exit._tag === "Success") {
    otelStatus = constOtelStatusSuccess;
  } else if (hasInterruptsOnly(status.exit.cause)) {
    otelStatus = {
      code: StatusCode.Ok,
      message: "Interrupted"
    };
    attributes.push({
      key: "span.label",
      value: {
        stringValue: "\u26A0\uFE0E Interrupted"
      }
    }, {
      key: "status.interrupted",
      value: {
        boolValue: true
      }
    });
  } else {
    const errors = prettyErrors(status.exit.cause);
    otelStatus = {
      code: StatusCode.Error
    };
    if (errors.length > 0) {
      otelStatus.message = errors[0].message;
      for (const error of errors) {
        events.push({
          name: "exception",
          timeUnixNano: String(status.endTime),
          droppedAttributesCount: 0,
          attributes: [{
            "key": "exception.type",
            "value": {
              "stringValue": error.name
            }
          }, {
            "key": "exception.message",
            "value": {
              "stringValue": error.message
            }
          }, {
            "key": "exception.stacktrace",
            "value": {
              "stringValue": error.stack ?? "No stack trace available"
            }
          }]
        });
      }
    }
  }
  return {
    traceId: self.traceId,
    spanId: self.spanId,
    parentSpanId: match(self.parent, {
      onNone: () => void 0,
      onSome: (parent) => parent.spanId
    }),
    name: self.name,
    kind: SpanKind[self.kind],
    startTimeUnixNano: String(status.startTime),
    endTimeUnixNano: String(status.endTime),
    attributes,
    droppedAttributesCount: 0,
    events,
    droppedEventsCount: 0,
    status: otelStatus,
    links: self.links.map((link) => ({
      traceId: link.span.traceId,
      spanId: link.span.spanId,
      attributes: entriesToAttributes(Object.entries(link.attributes)),
      droppedAttributesCount: 0
    })),
    droppedLinksCount: 0
  };
};
var StatusCode = {
  Unset: 0,
  Ok: 1,
  Error: 2
};
var SpanKind = {
  unspecified: 0,
  internal: 1,
  server: 2,
  client: 3,
  producer: 4,
  consumer: 5
};
var constOtelStatusSuccess = {
  code: StatusCode.Ok
};

// ../../../node_modules/.bun/effect@4.0.0-beta.59/node_modules/effect/dist/unstable/observability/Otlp.js
var layer5 = (options) => {
  const base = get2(options.baseUrl);
  const url = (path) => appendUrl(base, path).url;
  return mergeAll(layer2({
    url: url("/v1/logs"),
    resource: options.resource,
    headers: options.headers,
    exportInterval: options.loggerExportInterval,
    maxBatchSize: options.maxBatchSize,
    shutdownTimeout: options.shutdownTimeout,
    excludeLogSpans: options.loggerExcludeLogSpans,
    mergeWithExisting: options.loggerMergeWithExisting
  }), layer3({
    url: url("/v1/metrics"),
    resource: options.resource,
    headers: options.headers,
    exportInterval: options.metricsExportInterval,
    shutdownTimeout: options.shutdownTimeout,
    temporality: options.metricsTemporality
  }), layer4({
    url: url("/v1/traces"),
    resource: options.resource,
    headers: options.headers,
    exportInterval: options.tracerExportInterval,
    maxBatchSize: options.maxBatchSize,
    context: options.tracerContext,
    shutdownTimeout: options.shutdownTimeout
  }));
};
var layerJson2 = /* @__PURE__ */ flow(layer5, /* @__PURE__ */ provide(layerJson));
var layerProtobuf2 = /* @__PURE__ */ flow(layer5, /* @__PURE__ */ provide(layerProtobuf));

// ../sdk/src/promise-runtime.ts
var telemetryRuntime = null;
var activeConfig = null;
var sameConfig = (a, b) => a.otlpBaseUrl === b.otlpBaseUrl && a.serviceName === b.serviceName && a.serviceVersion === b.serviceVersion && a.exportInterval === b.exportInterval;
var configurePromiseTelemetry = (config) => {
  if (activeConfig && sameConfig(activeConfig, config)) return;
  const previous = telemetryRuntime;
  const interval = config.exportInterval ?? "1 second";
  const layer6 = Otlp_exports.layerJson({
    baseUrl: config.otlpBaseUrl,
    resource: {
      serviceName: config.serviceName,
      ...config.serviceVersion !== void 0 ? { serviceVersion: config.serviceVersion } : {}
    },
    loggerExportInterval: interval,
    tracerExportInterval: interval
  }).pipe(Layer_exports.provide(FetchHttpClient_exports.layer));
  telemetryRuntime = ManagedRuntime_exports.make(Layer_exports.orDie(layer6));
  activeConfig = config;
  if (previous) {
    void previous.dispose();
  }
};
var disposePromiseTelemetry = async () => {
  const runtime = telemetryRuntime;
  telemetryRuntime = null;
  activeConfig = null;
  if (runtime) {
    await runtime.dispose();
  }
};
var runAdapterPromise = (effect2) => telemetryRuntime ? telemetryRuntime.runPromise(effect2) : Effect_exports.runPromise(effect2);

// ../sdk/src/promise-executor.ts
var isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date) && !(v instanceof Promise);
var isPromiseOnElicitation = (value) => value === "accept-all" || typeof value === "function";
var toEffectOnElicitation = (handler) => handler === "accept-all" ? "accept-all" : (ctx) => {
  const result = handler(ctx);
  return Effect_exports.isEffect(result) ? result : Effect_exports.promise(() => Promise.resolve(result));
};
var adaptPromiseInvokeOptions = (value) => {
  if (!isPlainObject(value) || !Object.hasOwn(value, "onElicitation")) return value;
  const onElicitation = value.onElicitation;
  if (onElicitation === void 0 || !isPromiseOnElicitation(onElicitation)) return value;
  return {
    ...value,
    onElicitation: toEffectOnElicitation(onElicitation)
  };
};
var adaptPromiseArgs = (args) => args.map((arg) => adaptPromiseInvokeOptions(arg));
var toEffectProvider = (provider) => ({
  key: ProviderKey.make(provider.key),
  writable: provider.writable,
  get: (id) => Effect_exports.promise(() => provider.get(String(id))),
  ...provider.has ? { has: (id) => Effect_exports.promise(() => provider.has(String(id))) } : {},
  ...provider.set ? {
    set: (id, value) => Effect_exports.promise(() => provider.set(String(id), value))
  } : {},
  ...provider.delete ? { delete: (id) => Effect_exports.promise(() => provider.delete(String(id))) } : {},
  ...provider.list ? {
    list: () => Effect_exports.promise(
      async () => (await provider.list()).map((entry) => ({
        id: ProviderItemId.make(entry.id),
        name: entry.name
      }))
    )
  } : {}
});
var promisifyDeep = (value) => {
  if (typeof value === "function") {
    return ((...args) => {
      const result = value.apply(
        void 0,
        adaptPromiseArgs(args)
      );
      if (Effect_exports.isEffect(result)) {
        return runAdapterPromise(result);
      }
      return result;
    });
  }
  if (!isPlainObject(value)) return value;
  return new Proxy(value, {
    get(target, prop, receiver) {
      const v = Reflect.get(target, prop, receiver);
      if (typeof v === "function") {
        return (...args) => {
          const result = v.apply(target, adaptPromiseArgs(args));
          if (Effect_exports.isEffect(result)) {
            return runAdapterPromise(result);
          }
          return result;
        };
      }
      if (isPlainObject(v)) return promisifyDeep(v);
      return v;
    }
  });
};
var createExecutor2 = async (config) => {
  const plugins = config?.plugins ?? [];
  const db = typeof config.db === "function" ? await config.db({ tables: collectTables() }) : config.db;
  const effectConfig = {
    tenant: Tenant.make(config.tenant ?? "default-tenant"),
    ...config.subject !== void 0 ? { subject: Subject.make(config.subject) } : {},
    plugins,
    ...config.coreTools ? { coreTools: config.coreTools } : {},
    ...config.providers ? { providers: config.providers.map(toEffectProvider) } : {},
    onElicitation: toEffectOnElicitation(config.onElicitation),
    ...db ? { db } : {}
  };
  const effectExecutor = await runAdapterPromise(createExecutor(effectConfig));
  const executor = promisifyDeep(effectExecutor);
  return {
    ...executor,
    close: async () => {
      await runAdapterPromise(effectExecutor.close());
    }
  };
};

// ../execution/src/promise.ts
var isTaggedRejection = (cause) => typeof cause === "object" && cause !== null && "_tag" in cause && typeof cause._tag === "string";
var fromPromise = (try_) => (
  // oxlint-disable-next-line executor/no-effect-escape-hatch -- boundary: Promise executor facade erased the typed error channel; re-fail structurally
  Effect_exports.tryPromise({ try: try_, catch: (cause) => cause }).pipe(
    Effect_exports.catch((cause) => isTaggedRejection(cause) ? Effect_exports.fail(cause) : Effect_exports.die(cause))
  )
);
var wrapPromiseExecutor = (pe) => {
  const adapter = {
    integrations: {
      list: () => fromPromise(() => pe.integrations.list()),
      get: (slug) => fromPromise(() => pe.integrations.get(slug)),
      update: (slug, patch) => fromPromise(() => pe.integrations.update(slug, patch)),
      remove: (slug) => fromPromise(() => pe.integrations.remove(slug)),
      detect: (url) => fromPromise(() => pe.integrations.detect(url))
    },
    connections: {
      create: (input) => fromPromise(() => pe.connections.create(input)),
      list: (filter) => fromPromise(() => pe.connections.list(filter)),
      get: (ref) => fromPromise(() => pe.connections.get(ref)),
      update: (ref, input) => fromPromise(() => pe.connections.update(ref, input)),
      remove: (ref) => fromPromise(() => pe.connections.remove(ref)),
      refresh: (ref) => fromPromise(() => pe.connections.refresh(ref))
    },
    tools: {
      list: (filter) => fromPromise(() => pe.tools.list(filter)),
      schema: (address) => fromPromise(() => pe.tools.schema(address))
    },
    providers: {
      list: () => fromPromise(() => pe.providers.list()),
      items: (key) => fromPromise(() => pe.providers.items(key))
    },
    policies: {
      list: () => fromPromise(() => pe.policies.list()),
      create: (input) => fromPromise(() => pe.policies.create(input)),
      update: (input) => fromPromise(() => pe.policies.update(input)),
      remove: (input) => fromPromise(() => pe.policies.remove(input)),
      resolve: (address) => fromPromise(() => pe.policies.resolve(address))
    },
    execute: (address, args, options) => fromPromise(() => pe.execute(address, args, options)),
    close: () => fromPromise(() => pe.close())
  };
  return adapter;
};
var toPromiseExecutionEngine = (engine) => ({
  execute: (code, options) => runAdapterPromise(
    engine.execute(code, {
      onElicitation: (ctx) => (
        // oxlint-disable-next-line executor/no-effect-escape-hatch -- boundary: host-provided Promise elicitation callback is outside the Effect error model
        Effect_exports.tryPromise(() => options.onElicitation(ctx)).pipe(Effect_exports.orDie)
      )
    })
  ),
  executeWithPause: (code, options) => runAdapterPromise(engine.executeWithPause(code, options)),
  resume: (executionId, response) => runAdapterPromise(engine.resume(executionId, response)),
  getPausedExecution: (executionId) => runAdapterPromise(engine.getPausedExecution(executionId)),
  pausedExecutionCount: () => runAdapterPromise(engine.pausedExecutionCount()),
  hasPausedExecutions: () => runAdapterPromise(engine.hasPausedExecutions()),
  getDescription: () => runAdapterPromise(engine.getDescription)
});
var createExecutionEngine2 = (config) => toPromiseExecutionEngine(
  createExecutionEngine({
    executor: wrapPromiseExecutor(config.executor),
    codeExecutor: config.codeExecutor
  })
);

// ../../hosts/mcp/src/tool-server-promise.ts
var fromPromise2 = (thunk) => Effect_exports.promise(thunk);
var toEffectEngine = (engine) => ({
  execute: (code, options) => fromPromise2(
    () => engine.execute(code, {
      onElicitation: (context2) => runAdapterPromise(options.onElicitation(context2))
    })
  ),
  executeWithPause: (code, options) => fromPromise2(() => engine.executeWithPause(code, options)),
  resume: (executionId, response) => fromPromise2(() => engine.resume(executionId, response)),
  getPausedExecution: (executionId) => fromPromise2(() => engine.getPausedExecution(executionId)),
  pausedExecutionCount: () => fromPromise2(() => engine.pausedExecutionCount()),
  hasPausedExecutions: () => fromPromise2(() => engine.hasPausedExecutions()),
  getDescription: fromPromise2(() => engine.getDescription())
});
var createExecutorMcpServer2 = (config) => runAdapterPromise(
  createExecutorMcpServer({
    ...config,
    engine: toEffectEngine(config.engine),
    ...config.additionalSkills ? {
      additionalSkills: () => Effect_exports.promise(() => Promise.resolve(config.additionalSkills()))
    } : {}
  })
);

// src/plain.ts
var createExecutor3 = (config) => createExecutor2(
  config
);
var mcpPlugin2 = (config) => mcpPlugin(config);
var makeQuickJsExecutor2 = () => makeQuickJsExecutor();
var createExecutionEngine3 = (config) => createExecutionEngine2(
  config
);
var createExecutorMcpServer3 = (config) => createExecutorMcpServer2(config);
var configureTelemetry = (config) => configurePromiseTelemetry(config);
var disposeTelemetry = () => disposePromiseTelemetry();
export {
  configureTelemetry,
  createExecutionEngine3 as createExecutionEngine,
  createExecutor3 as createExecutor,
  createExecutorMcpServer3 as createExecutorMcpServer,
  disposeTelemetry,
  makeQuickJsExecutor2 as makeQuickJsExecutor,
  mcpPlugin2 as mcpPlugin
};
