"use client";

import { useEffect, useState } from "react";
import { Bug, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BUG_REPORT_AREAS,
  FeedbackApiError,
  feedbackApi,
} from "@/lib/feedback-api";

export function BugReportForm({
  defaultName = "",
  defaultEmail = "",
  defaultPageUrl = "",
}: {
  defaultName?: string;
  defaultEmail?: string;
  defaultPageUrl?: string;
}) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [area, setArea] = useState<string>(BUG_REPORT_AREAS[0]);
  const [pageUrl, setPageUrl] = useState(defaultPageUrl);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!defaultPageUrl && typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, [defaultPageUrl]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await feedbackApi.submitBug({
        name,
        email,
        area,
        pageUrl: pageUrl || undefined,
        message,
      });
      setSuccess(response.confirmation);
      setMessage("");
    } catch (err) {
      setError(
        err instanceof FeedbackApiError
          ? err.message
          : "Could not submit your report. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-teal/25 bg-teal/10 px-4 py-3 text-sm text-teal">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bug-name">Your name</Label>
          <Input
            id="bug-name"
            className="surface-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={120}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bug-email">Email</Label>
          <Input
            id="bug-email"
            type="email"
            className="surface-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={254}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bug-area">Where did you see the problem?</Label>
        <select
          id="bug-area"
          className="surface-input w-full rounded-xl px-3"
          value={area}
          onChange={(event) => setArea(event.target.value)}
          required
        >
          {BUG_REPORT_AREAS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bug-page-url">Page URL (optional)</Label>
        <Input
          id="bug-page-url"
          className="surface-input"
          value={pageUrl}
          onChange={(event) => setPageUrl(event.target.value)}
          placeholder="https://..."
          maxLength={500}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bug-message">What went wrong?</Label>
        <textarea
          id="bug-message"
          className="min-h-40 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Steps to reproduce, what you expected, and what happened instead..."
          required
          maxLength={5000}
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Bug className="size-4" />
            Submit bug report
          </>
        )}
      </Button>
    </form>
  );
}
