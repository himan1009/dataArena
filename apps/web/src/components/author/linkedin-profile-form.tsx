"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { authApi, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LinkedinProfileForm({
  initialUrl,
}: {
  initialUrl?: string | null;
}) {
  const router = useRouter();
  const [linkedinUrl, setLinkedinUrl] = useState(initialUrl ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSaving(true);

    try {
      await authApi.updateProfile({
        linkedinUrl: linkedinUrl.trim() || undefined,
      });
      setMessage("LinkedIn profile saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="linkedin-url">LinkedIn profile URL</Label>
        <Input
          id="linkedin-url"
          type="url"
          placeholder="https://www.linkedin.com/in/your-profile"
          className="surface-input"
          value={linkedinUrl}
          onChange={(event) => setLinkedinUrl(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          This link appears in the author credit section when your article is published.
        </p>
      </div>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save LinkedIn profile"
        )}
      </Button>
    </form>
  );
}
