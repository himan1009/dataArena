import type { LegalPage } from "./types";

export const cookiePolicy: LegalPage = {
  slug: "cookies",
  title: "Cookie Policy",
  description:
    "A clear explanation of the cookies and similar technologies DataArena uses, why they are needed, and how you can control them.",
  lastUpdated: "July 22, 2026",
  sections: [
    {
      title: "1. What this Cookie Policy covers",
      paragraphs: [
        "This Cookie Policy explains how DataArena uses cookies and similar browser technologies when you visit our website or use the Platform.",
        "It should be read together with our Privacy Policy, which describes our broader data practices.",
      ],
    },
    {
      title: "2. What cookies are",
      paragraphs: [
        "Cookies are small text files that a website stores on your computer or mobile device through your browser. They help websites remember information about your visit.",
        "Some cookies are deleted when you close your browser. Others remain for a longer period until they expire or are manually removed.",
        "Similar technologies may include local storage or session storage used by web applications for short-term state management.",
      ],
    },
    {
      title: "3. Why DataArena uses cookies",
      paragraphs: [
        "DataArena uses cookies primarily to operate core platform functionality, especially authentication. We do not use cookies to sell your personal data or to deliver unrelated third-party advertising profiles.",
      ],
    },
    {
      title: "4. Cookies we use",
      paragraphs: [
        "The following categories describe the main cookies and similar technologies used by DataArena:",
      ],
    },
    {
      title: "4.1 Essential authentication cookies",
      paragraphs: [
        "These cookies are required for the Platform to function securely for signed-in users.",
      ],
      bullets: [
        "access_token: used to authenticate your session when accessing protected pages and APIs.",
        "refresh_token: used to renew your session without requiring you to sign in again on every visit.",
      ],
    },
    {
      title: "4.2 Why authentication cookies matter",
      paragraphs: [
        "Without these cookies, DataArena cannot reliably keep you signed in or protect your workspace, settings, author drafts, and admin tools.",
        "Because they are essential to service operation, they are not optional if you want to use authenticated features.",
      ],
    },
    {
      title: "4.3 Functional preferences",
      paragraphs: [
        "In the future, DataArena may use additional cookies or local storage entries to remember non-essential preferences such as interface state or dismissed notices.",
        "If we introduce such cookies, we will update this policy to describe them clearly.",
      ],
    },
    {
      title: "4.4 Analytics cookies",
      paragraphs: [
        "We may use privacy-conscious analytics in the future to understand feature usage and improve performance.",
        "If analytics cookies are introduced, they will be described here and implemented in a way that respects user privacy expectations.",
      ],
    },
    {
      title: "5. First-party and third-party cookies",
      paragraphs: [
        "Most cookies used by DataArena are first-party cookies set directly by our application domain.",
        "If we integrate third-party services in the future, such as embedded content or analytics providers, those services may set their own cookies under their own policies. We will update this page if that changes.",
      ],
    },
    {
      title: "6. How long cookies last",
      paragraphs: [
        "Session-related authentication behavior depends on token expiration and logout actions.",
        "When you log out, authentication cookies should be cleared or invalidated as part of the logout process.",
        "If you remain signed in, refresh mechanisms may keep your session active until the refresh token expires or is revoked for security reasons.",
      ],
    },
    {
      title: "7. How to manage or disable cookies",
      paragraphs: [
        "Most browsers allow you to block, delete, or limit cookies through settings. You can usually find these controls under privacy or security settings.",
        "If you block essential authentication cookies, you may be unable to sign in or use protected areas of DataArena.",
        "Clearing cookies may also sign you out and remove session state.",
      ],
    },
    {
      title: "8. Do Not Track and similar signals",
      paragraphs: [
        "Some browsers offer “Do Not Track” or similar signals. Because standards for responding to these signals are not uniform, DataArena may not respond to every such signal in the same way across all jurisdictions.",
      ],
    },
    {
      title: "9. Changes to this Cookie Policy",
      paragraphs: [
        "We may update this Cookie Policy when our technology stack changes or when new features require different browser storage practices.",
        "Material changes will be reflected in the “Last updated” date at the top of this page.",
      ],
    },
    {
      title: "10. Contact",
      paragraphs: [
        "If you have questions about cookies or browser storage on DataArena, contact us through the Contact page.",
      ],
    },
  ],
};
