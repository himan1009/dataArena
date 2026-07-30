"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Loader2, UserCheck, UserX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import {
  adminUsersApi,
  type AdminUser,
} from "@/lib/admin-users-api";
import { ApiError } from "@/lib/notes-api";

const roleLabels: Record<AdminUser["role"], string> = {
  USER: "User",
  EDITOR: "Editor",
  ADMIN: "Admin",
};

export function AdminUsersPanel({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAction = async (key: string, action: () => Promise<unknown>) => {
    setError(null);
    setLoadingKey(key);

    try {
      await action();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 text-sm text-muted-foreground sm:p-6">
        <p>
          Promote users to <strong className="text-foreground">Editor</strong> when they
          contribute articles. Use <strong className="text-foreground">Practice upload</strong> to
          let a user add practice questions (categories and topics stay admin-only in Practice CMS).
        </p>
        <p className="mt-2">
          After you click <strong className="text-foreground">Allow upload</strong>, that user will
          see <strong className="text-foreground">Add question</strong> on the Practice page and in
          the sidebar. Questions still go through admin review before publishing.
        </p>
        <p className="mt-2">
          Deactivating a user blocks login, but their name and LinkedIn stay on every
          published article forever.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-5 py-4 font-semibold">User</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Practice upload</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Published</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUserId;
                const isAdmin = user.role === "ADMIN";
                const roleKey = `role-${user.id}`;
                const uploadKey = `upload-${user.id}`;
                const statusKey = `status-${user.id}`;

                return (
                  <tr
                    key={user.id}
                    className="border-b border-white/[0.04] last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium">
                        {user.name || user.email.split("@")[0]}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                      {user.linkedinUrl && (
                        <a
                          href={user.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="size-3" />
                          LinkedIn
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isAdmin ? (
                        <Badge className="bg-primary/15 text-primary">
                          {roleLabels[user.role]}
                        </Badge>
                      ) : (
                        <SelectField
                          className="h-10 min-w-[9rem] py-2 text-sm"
                          value={user.role}
                          options={[
                            { value: "USER", label: "User" },
                            { value: "EDITOR", label: "Editor" },
                          ]}
                          disabled={isSelf || loadingKey === roleKey}
                          onValueChange={(value) =>
                            runAction(roleKey, () =>
                              adminUsersApi.updateRole(
                                user.id,
                                value as "USER" | "EDITOR",
                              ),
                            )
                          }
                        />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isAdmin ? (
                        <span className="text-xs text-muted-foreground">Always on</span>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {user.canUploadQuestions && (
                            <Badge className="w-fit bg-violet-500/15 text-violet-300">
                              Can add questions
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant={user.canUploadQuestions ? "outline" : "secondary"}
                            className="border-white/10 bg-white/[0.03]"
                            disabled={isSelf || loadingKey === uploadKey}
                            onClick={() =>
                              runAction(uploadKey, () =>
                                adminUsersApi.updateQuestionUpload(
                                  user.id,
                                  !user.canUploadQuestions,
                                ),
                              )
                            }
                          >
                            {loadingKey === uploadKey ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : user.canUploadQuestions ? (
                              "Revoke upload"
                            ) : (
                              "Allow upload"
                            )}
                          </Button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {user.isActive ? (
                        <Badge className="bg-emerald-500/15 text-emerald-300">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/15 text-destructive">
                          Deactivated
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {user.publishedArticleCount}
                    </td>
                    <td className="px-5 py-4">
                      {isSelf ? (
                        <span className="text-xs text-muted-foreground">You</span>
                      ) : isAdmin ? (
                        <span className="text-xs text-muted-foreground">Protected</span>
                      ) : (
                        <Button
                          size="sm"
                          variant={user.isActive ? "destructive" : "outline"}
                          className={
                            user.isActive
                              ? undefined
                              : "border-white/10 bg-white/[0.03]"
                          }
                          disabled={loadingKey === statusKey}
                          onClick={() =>
                            runAction(statusKey, () =>
                              adminUsersApi.updateStatus(user.id, !user.isActive),
                            )
                          }
                        >
                          {loadingKey === statusKey ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : user.isActive ? (
                            <UserX className="size-4" />
                          ) : (
                            <UserCheck className="size-4" />
                          )}
                          {user.isActive ? "Deactivate" : "Reactivate"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
