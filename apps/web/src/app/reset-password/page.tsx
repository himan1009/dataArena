import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCurrentUser } from "@/lib/auth-server";

export const metadata = {
  title: "Reset password",
};

function ResetPasswordContent({ token }: { token: string }) {
  return <ResetPasswordForm token={token} />;
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <Suspense fallback={null}>
      <ResetPasswordContent token={token} />
    </Suspense>
  );
}
