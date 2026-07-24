export function AdminLoadError({
  title = "Could not load admin data",
  error,
}: {
  title?: string;
  error: string;
}) {
  const isMigrationHint =
    error.toLowerCase().includes("internal server") ||
    error.toLowerCase().includes("assignedauthor");

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-destructive/90">{error}</p>
      {isMigrationHint && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-3 font-mono text-xs text-foreground">
          <p className="text-muted-foreground">Run in a terminal:</p>
          <p className="mt-2">docker compose up -d</p>
          <p>cd apps/api &amp;&amp; npx prisma migrate deploy</p>
          <p className="mt-2 text-muted-foreground">
            Then restart the API (npm run start:dev).
          </p>
        </div>
      )}
    </div>
  );
}
