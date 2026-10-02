import { Suspense } from "react";

import { VerifyEmailClient } from "@/components/auth/verify-email-client";

export const metadata = {
  title: "Verify email",
};

function VerifyEmailContent({ token }: { token: string }) {
  return <VerifyEmailClient token={token} />;
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <Suspense fallback={null}>
      <VerifyEmailContent token={token} />
    </Suspense>
  );
}
