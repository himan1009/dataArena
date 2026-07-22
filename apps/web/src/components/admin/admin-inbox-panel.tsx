"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive, Loader2, Mail, MessageSquare, Bug } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  buildBugReplyMailto,
  buildContactReplyMailto,
  feedbackApi,
  type BugReport,
  type ContactMessage,
  type FeedbackStatus,
} from "@/lib/feedback-api";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: FeedbackStatus }) {
  const styles =
    status === "NEW"
      ? "bg-amber-500/12 text-amber-200"
      : status === "READ"
        ? "bg-primary/12 text-primary"
        : "bg-white/[0.06] text-muted-foreground";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

export function AdminInboxPanel({
  contacts,
  bugs,
}: {
  contacts: ContactMessage[];
  bugs: BugReport[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"contact" | "bugs">("contact");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setContactStatus = async (id: string, status: FeedbackStatus) => {
    setLoadingId(id);
    setError(null);
    try {
      await feedbackApi.updateContactStatus(id, status);
      router.refresh();
    } catch {
      setError("Could not update the contact message. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const setBugStatus = async (id: string, status: FeedbackStatus) => {
    setLoadingId(id);
    setError(null);
    try {
      await feedbackApi.updateBugStatus(id, status);
      router.refresh();
    } catch {
      setError("Could not update the bug report. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const newContactCount = contacts.filter((item) => item.status === "NEW").length;
  const newBugCount = bugs.filter((item) => item.status === "NEW").length;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={tab === "contact" ? "default" : "outline"}
          className={tab !== "contact" ? "border-white/10 bg-white/[0.03]" : undefined}
          onClick={() => setTab("contact")}
        >
          <MessageSquare className="size-4" />
          Contact
          {newContactCount > 0 && (
            <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 text-xs">
              {newContactCount}
            </span>
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tab === "bugs" ? "default" : "outline"}
          className={tab !== "bugs" ? "border-white/10 bg-white/[0.03]" : undefined}
          onClick={() => setTab("bugs")}
        >
          <Bug className="size-4" />
          Bug reports
          {newBugCount > 0 && (
            <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 text-xs">
              {newBugCount}
            </span>
          )}
        </Button>
      </div>

      {tab === "contact" && (
        <div className="space-y-4">
          {contacts.map((item) => (
            <article key={item.id} className="glass-panel space-y-4 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={buildContactReplyMailto(item)}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "border-white/10 bg-white/[0.03]",
                    )}
                  >
                    <Mail className="size-4" />
                    Reply via email
                  </a>
                  {item.status !== "ARCHIVED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={loadingId === item.id}
                      onClick={() => setContactStatus(item.id, "ARCHIVED")}
                    >
                      {loadingId === item.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Archive className="size-4" />
                      )}
                      Archive
                    </Button>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-relaxed">
                {item.message}
              </p>
            </article>
          ))}
          {contacts.length === 0 && (
            <div className="glass-panel p-8 text-center text-sm text-muted-foreground">
              No contact messages yet.
            </div>
          )}
        </div>
      )}

      {tab === "bugs" && (
        <div className="space-y-4">
          {bugs.map((item) => (
            <article key={item.id} className="glass-panel space-y-4 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.email}</p>
                  <p className="mt-1 text-sm">
                    <span className="text-muted-foreground">Area:</span>{" "}
                    <span className="font-medium text-foreground">{item.area}</span>
                  </p>
                  {item.pageUrl && (
                    <p className="mt-1 text-xs text-primary break-all">{item.pageUrl}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={buildBugReplyMailto(item)}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "border-white/10 bg-white/[0.03]",
                    )}
                  >
                    <Mail className="size-4" />
                    Reply via email
                  </a>
                  {item.status !== "ARCHIVED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={loadingId === item.id}
                      onClick={() => setBugStatus(item.id, "ARCHIVED")}
                    >
                      {loadingId === item.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Archive className="size-4" />
                      )}
                      Archive
                    </Button>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-relaxed">
                {item.message}
              </p>
            </article>
          ))}
          {bugs.length === 0 && (
            <div className="glass-panel p-8 text-center text-sm text-muted-foreground">
              No bug reports yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
