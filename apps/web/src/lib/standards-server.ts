import { getCookieHeader } from "@/lib/auth-server";
import { ServerFetchError } from "@/lib/fetch-server";
import { getBackendUrl } from "@/lib/proxy";
import type { WritingStandard } from "@/lib/standards-api";

export async function fetchWritingStandards(
  cookieHeader?: string,
): Promise<WritingStandard[]> {
  const header = cookieHeader ?? (await getCookieHeader());
  const response = await fetch(getBackendUrl("/standards"), {
    headers: { cookie: header },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Could not load writing standards.";

    try {
      const data = (await response.json()) as { message?: string | string[] };
      if (typeof data.message === "string") {
        message = data.message;
      } else if (Array.isArray(data.message)) {
        message = data.message.join(", ");
      }
    } catch {
      // Keep default message when body is not JSON.
    }

    throw new ServerFetchError(message, response.status);
  }

  const data = (await response.json()) as { standards?: WritingStandard[] };
  return data.standards ?? [];
}
