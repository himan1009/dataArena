"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import {
  InterviewApiError,
  interviewExperiencesApi,
  type InterviewReportReason,
} from "@/lib/interview-experiences-api";

const reasonOptions = [
  { value: "INCORRECT_INFO", label: "Incorrect information" },
  { value: "SPAM", label: "Spam" },
  { value: "OFFENSIVE", label: "Offensive content" },
  { value: "DUPLICATE", label: "Duplicate" },
];

export function InterviewReportForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<InterviewReportReason>("INCORRECT_INFO");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await interviewExperiencesApi.report(slug, {
        reason,
        details: details || undefined,
      });
      setMessage(result.message);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof InterviewApiError ? err.message : "Could not submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-5">
      {!open ? (
        <Button variant="outline" className="border-white/10" onClick={() => setOpen(true)}>
          <Flag className="size-4" />
          Report experience
        </Button>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium">Report this experience</p>
          <SelectField
            value={reason}
            options={reasonOptions}
            onValueChange={(value) => setReason(value as InterviewReportReason)}
          />
          <textarea
            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
            placeholder="Optional details..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <div className="flex gap-3">
            <Button onClick={submit} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Submit report
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {message && <p className="mt-3 text-sm text-primary">{message}</p>}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}
