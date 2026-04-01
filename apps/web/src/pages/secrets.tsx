import { useState } from "react";
import {
  useAtomValue,
  useAtomSet,
  useAtomRefresh,
  Result,
  secretsAtom,
  setSecret,
  removeSecret,
} from "@executor/react";
import { SecretId, ScopeId } from "@executor/sdk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@executor/ui/components/dialog";
import { Button } from "@executor/ui/components/button";
import { Input } from "@executor/ui/components/input";
import { Label } from "@executor/ui/components/label";
import { Badge } from "@executor/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@executor/ui/components/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@executor/ui/components/select";

// ---------------------------------------------------------------------------
// Add secret dialog
// ---------------------------------------------------------------------------

function AddSecretDialog(props: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [purpose, setPurpose] = useState("");
  const [provider, setProvider] = useState("auto");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSet = useAtomSet(setSecret, { mode: "promise" });
  const refresh = useAtomRefresh(secretsAtom());

  const reset = () => {
    setId("");
    setName("");
    setValue("");
    setPurpose("");
    setProvider("auto");
    setError(null);
    setSaving(false);
  };

  const handleSave = async () => {
    if (!id.trim() || !name.trim() || !value.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await doSet({
        path: { scopeId: ScopeId.make("default") },
        payload: {
          id: SecretId.make(id.trim()),
          name: name.trim(),
          value: value.trim(),
          purpose: purpose.trim() || undefined,
          provider: provider === "auto" ? undefined : provider,
        },
      });
      reset();
      props.onOpenChange(false);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save secret");
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={props.open}
      onOpenChange={(v) => {
        if (!v) reset();
        props.onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add secret</DialogTitle>
          <DialogDescription>
            Store a credential or API key. Values are stored in your system keychain when available, with a local file fallback.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="secret-id">ID</Label>
            <Input
              id="secret-id"
              placeholder="github-token"
              value={id}
              onChange={(e) => setId((e.target as HTMLInputElement).value)}
              className="font-mono text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              Unique identifier used to reference this secret.
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="secret-name">Name</Label>
            <Input
              id="secret-name"
              placeholder="GitHub Personal Access Token"
              value={name}
              onChange={(e) => setName((e.target as HTMLInputElement).value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="secret-value">Value</Label>
            <Input
              id="secret-value"
              type="password"
              placeholder="ghp_xxxxxxxxxxxx"
              value={value}
              onChange={(e) => setValue((e.target as HTMLInputElement).value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="secret-purpose">
              Purpose <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="secret-purpose"
              placeholder="Authentication for GitHub API"
              value={purpose}
              onChange={(e) => setPurpose((e.target as HTMLInputElement).value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="secret-provider">
              Storage <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger id="secret-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (keychain → file)</SelectItem>
                <SelectItem value="keychain">Keychain</SelectItem>
                <SelectItem value="file">File</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Where to store the secret value. Auto uses keychain if available.
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={!id.trim() || !name.trim() || !value.trim() || saving}
          >
            {saving ? "Saving…" : "Save secret"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Secret row
// ---------------------------------------------------------------------------

function SecretRow(props: {
  secret: { id: string; name: string; purpose?: string; provider?: string };
  onRemove: () => void;
}) {
  const { secret } = props;

  return (
    <div className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3.5 transition-colors hover:border-primary/25">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{secret.name}</p>
          <Badge variant="outline" className="font-mono text-[10px]">
            {secret.id}
          </Badge>
        </div>
        {secret.purpose && (
          <p className="mt-0.5 text-xs text-muted-foreground">{secret.purpose}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {secret.provider && (
          <Badge variant="secondary" className="text-[10px]">
            {secret.provider}
          </Badge>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg viewBox="0 0 16 16" className="size-3.5">
                <circle cx="8" cy="3" r="1.2" fill="currentColor" />
                <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                <circle cx="8" cy="13" r="1.2" fill="currentColor" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={props.onRemove}
            >
              Remove secret
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function SecretsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const secrets = useAtomValue(secretsAtom());
  const doRemove = useAtomSet(removeSecret, { mode: "promise" });
  const refresh = useAtomRefresh(secretsAtom());

  const handleRemove = async (secretId: string) => {
    try {
      await doRemove({
        path: {
          scopeId: ScopeId.make("default"),
          secretId: SecretId.make(secretId),
        },
      });
      refresh();
    } catch {
      // TODO: toast
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl tracking-tight text-foreground lg:text-4xl">
              Secrets
            </h1>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              Credentials and API keys for your connected sources.
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5 mr-1.5">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Add secret
          </Button>
        </div>

        {Result.match(secrets, {
          onInitial: () => (
            <p className="text-sm text-muted-foreground">Loading secrets…</p>
          ),
          onFailure: () => (
            <p className="text-sm text-destructive">Failed to load secrets</p>
          ),
          onSuccess: ({ value }) =>
            value.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                  <svg viewBox="0 0 16 16" className="size-5">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[14px] font-medium text-foreground/70 mb-1">
                  No secrets stored
                </p>
                <p className="text-[13px] text-muted-foreground/60 mb-5">
                  Add a secret to store API keys and credentials.
                </p>
                <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
                  Add your first secret
                </Button>
              </div>
            ) : (
              <div className="grid gap-2">
                {value.map((s) => (
                  <SecretRow
                    key={s.id}
                    secret={{
                      id: s.id,
                      name: s.name,
                      purpose: s.purpose,
                      provider: s.provider ? String(s.provider) : undefined,
                    }}
                    onRemove={() => handleRemove(s.id)}
                  />
                ))}
              </div>
            ),
        })}

        <AddSecretDialog open={addOpen} onOpenChange={setAddOpen} />
      </div>
    </div>
  );
}
