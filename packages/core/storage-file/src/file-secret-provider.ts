// ---------------------------------------------------------------------------
// File-backed SecretProvider — stores values in auth.json with 0o600 perms
//
// Location: $XDG_DATA_HOME/executor/auth.json (default ~/.local/share/executor/)
// Format: { "secret-id": "value", ... }
// ---------------------------------------------------------------------------

import { Effect, Schema } from "effect";
import type { SecretProvider } from "@executor/sdk";
import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// XDG data dir resolution
// ---------------------------------------------------------------------------

const APP_NAME = "executor";

const xdgDataHome = (): string =>
  process.env.XDG_DATA_HOME?.trim() ||
  path.join(process.env.HOME || process.env.USERPROFILE || "~", ".local", "share");

const authDir = (overrideDir?: string): string =>
  overrideDir ?? path.join(xdgDataHome(), APP_NAME);

const authFilePath = (overrideDir?: string): string =>
  path.join(authDir(overrideDir), "auth.json");

// ---------------------------------------------------------------------------
// Schema for the auth file
// ---------------------------------------------------------------------------

const AuthFile = Schema.Record({ key: Schema.String, value: Schema.String });
const decodeAuthFile = Schema.decodeUnknownSync(AuthFile);

// ---------------------------------------------------------------------------
// File I/O with restricted permissions
// ---------------------------------------------------------------------------

const readAuthFile = (filePath: string): Record<string, string> => {
  try {
    if (!fs.existsSync(filePath)) return {};
    const raw = fs.readFileSync(filePath, "utf-8");
    return decodeAuthFile(JSON.parse(raw));
  } catch {
    return {};
  }
};

const writeAuthFile = (filePath: string, data: Record<string, string>): void => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, filePath);
};

// ---------------------------------------------------------------------------
// Provider factory
// ---------------------------------------------------------------------------

export interface FileSecretProviderConfig {
  /** Override the directory for auth.json (default: XDG data dir) */
  readonly directory?: string;
}

export const makeFileSecretProvider = (
  config?: FileSecretProviderConfig,
): SecretProvider => {
  const filePath = authFilePath(config?.directory);

  return {
    key: "file",
    writable: true,

    get: (secretId) =>
      Effect.sync(() => {
        const data = readAuthFile(filePath);
        return data[secretId] ?? null;
      }),

    set: (secretId, value) =>
      Effect.sync(() => {
        const data = readAuthFile(filePath);
        data[secretId] = value;
        writeAuthFile(filePath, data);
      }),

    delete: (secretId) =>
      Effect.sync(() => {
        const data = readAuthFile(filePath);
        const had = secretId in data;
        delete data[secretId];
        if (had) writeAuthFile(filePath, data);
        return had;
      }),

    list: () =>
      Effect.sync(() => {
        const data = readAuthFile(filePath);
        return Object.keys(data);
      }),
  };
};
