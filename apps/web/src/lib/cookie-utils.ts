import { cookies } from "next/headers";

type ParsedCookie = {
  name: string;
  value: string;
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    path?: string;
    maxAge?: number;
    expires?: Date;
  };
};

export function parseSetCookieHeader(header: string): ParsedCookie | null {
  const segments = header.split(";").map((part) => part.trim());
  const [nameValue, ...attributes] = segments;
  const separatorIndex = nameValue.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const name = nameValue.slice(0, separatorIndex);
  const value = nameValue.slice(separatorIndex + 1);
  const options: ParsedCookie["options"] = { path: "/" };

  for (const attribute of attributes) {
    const [rawKey, ...rawValueParts] = attribute.split("=");
    const key = rawKey.toLowerCase();
    const rawValue = rawValueParts.join("=");

    if (key === "httponly") {
      options.httpOnly = true;
    } else if (key === "secure") {
      options.secure = true;
    } else if (key === "samesite") {
      const sameSite = rawValue.toLowerCase();
      if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
        options.sameSite = sameSite;
      }
    } else if (key === "path") {
      options.path = rawValue;
    } else if (key === "max-age") {
      options.maxAge = Number.parseInt(rawValue, 10);
    } else if (key === "expires") {
      options.expires = new Date(rawValue);
    }
  }

  return { name, value, options };
}

export async function applySetCookiesFromResponse(response: Response) {
  const cookieStore = await cookies();
  const setCookies = response.headers.getSetCookie?.() ?? [];

  for (const header of setCookies) {
    const parsed = parseSetCookieHeader(header);
    if (!parsed) {
      continue;
    }

    cookieStore.set(parsed.name, parsed.value, parsed.options);
  }
}
