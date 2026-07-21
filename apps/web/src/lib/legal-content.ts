import { cookiePolicy } from "@/content/legal/cookies";
import { copyrightNotice } from "@/content/legal/copyright";
import { disclaimer } from "@/content/legal/disclaimer";
import { privacyPolicy } from "@/content/legal/privacy";
import { securityPolicy } from "@/content/legal/security";
import { termsOfService } from "@/content/legal/terms";
import type { LegalPage } from "@/content/legal/types";

export type { LegalPage, LegalSection } from "@/content/legal/types";

export const legalPages: LegalPage[] = [
  privacyPolicy,
  termsOfService,
  disclaimer,
  copyrightNotice,
  securityPolicy,
  cookiePolicy,
];

export const legalPagesBySlug = Object.fromEntries(
  legalPages.map((page) => [page.slug, page]),
) as Record<string, LegalPage>;

export const legalNavLinks = legalPages.map((page) => ({
  href: `/legal/${page.slug}`,
  label: page.title,
}));
