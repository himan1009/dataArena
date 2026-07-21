import type { LegalPage } from "./types";

export const termsOfService: LegalPage = {
  slug: "terms",
  title: "Terms of Service",
  description:
    "The complete rules for using DataArena, including accounts, roles, publishing workflows, acceptable use, and liability limits.",
  lastUpdated: "July 22, 2026",
  sections: [
    {
      title: "1. Agreement to these Terms",
      paragraphs: [
        "These Terms of Service (“Terms”) form a binding agreement between you and DataArena governing your access to and use of the platform, website, APIs, and related services (collectively, the “Platform”).",
        "By creating an account, signing in, reading content, publishing articles, submitting feedback, or otherwise using DataArena, you confirm that you have read, understood, and agree to these Terms and to our Privacy Policy.",
        "If you are using the Platform on behalf of an organization, you represent that you have authority to bind that organization to these Terms.",
      ],
    },
    {
      title: "2. What DataArena provides",
      paragraphs: [
        "DataArena is an educational technology platform for data engineering learners and contributors. The Platform may include, now or in the future:",
      ],
      bullets: [
        "Structured learning notes organized by categories and topics.",
        "Published articles with author and editor attribution.",
        "An author workspace for drafting, submitting, and editing educational content.",
        "Administrative tools for content review, user management, and platform operations.",
        "Contact and bug reporting channels.",
        "Planned or beta features such as practice labs, search, bookmarks, and AI-assisted learning tools.",
      ],
    },
    {
      title: "3. Eligibility",
      paragraphs: [
        "You must be at least 13 years old, or the minimum digital consent age required in your country, to use DataArena.",
        "You are responsible for ensuring that your use of the Platform complies with all laws and regulations that apply to you, including workplace, school, or regional restrictions on online learning platforms.",
      ],
    },
    {
      title: "4. Accounts, roles, and access levels",
      paragraphs: [
        "DataArena uses role-based access to separate learner features from publishing and administrative capabilities.",
      ],
      bullets: [
        "USER: can access the learning workspace, read published content, manage personal settings, and submit contact or bug reports.",
        "EDITOR: can use the author workspace to write, submit, and edit articles according to platform workflows, and may receive editor assignments on published content.",
        "ADMIN: can manage categories, topics, articles, users, reviews, inbox messages, and other administrative functions.",
      ],
    },
    {
      title: "4.1 Account registration and security",
      paragraphs: [
        "You must provide accurate registration information and keep your account details up to date. You are solely responsible for maintaining the confidentiality of your password and for all activity that occurs under your account.",
        "You must notify us promptly if you suspect unauthorized access. We may suspend or terminate accounts involved in abuse, fraud, security risk, or repeated violations of these Terms.",
        "We may deactivate accounts that are inactive, abusive, or no longer authorized to use the Platform. Deactivation may limit access while preserving published attribution where appropriate.",
      ],
    },
    {
      title: "5. Acceptable use of the Platform",
      paragraphs: [
        "You agree to use DataArena only for lawful educational and platform-related purposes. You must not misuse the Platform or interfere with other users’ ability to learn and contribute.",
      ],
    },
    {
      title: "5.1 Prohibited conduct",
      paragraphs: ["You may not:"],
      bullets: [
        "Attempt to gain unauthorized access to accounts, admin tools, APIs, databases, or infrastructure.",
        "Upload malware, exploit code, or content designed to disrupt, damage, or compromise the Platform.",
        "Harass, threaten, impersonate, or abuse other users, authors, editors, or administrators.",
        "Scrape, crawl, bulk download, mirror, or republish Platform content without permission.",
        "Circumvent authentication, rate limits, editorial review, or role-based restrictions.",
        "Submit false bug reports, spam contact messages, or misleading editorial submissions.",
        "Use the Platform for unlawful, deceptive, discriminatory, or harmful activities.",
        "Collect personal data from other users without a lawful basis and appropriate consent.",
      ],
    },
    {
      title: "6. Educational content and publishing rules",
      paragraphs: [
        "Much of the value of DataArena comes from curated and community-authored educational material. Publishing on the Platform is subject to editorial rules and review workflows.",
      ],
    },
    {
      title: "6.1 Author workflow",
      paragraphs: [
        "Editors may create drafts, submit articles for review, respond to requested changes, and publish approved content within assigned topics. Article statuses may include draft, submitted, changes requested, published, or rejected.",
        "Administrators may review submissions, request revisions, reject content, publish directly, assign editors, and make administrative edits when necessary for quality, accuracy, or platform integrity.",
      ],
    },
    {
      title: "6.2 Topic claims and assignments",
      paragraphs: [
        "Some topics may be opened for authors to claim and write about. Topic availability, claim status, and editorial assignment are controlled by administrators.",
        "Claiming or being assigned a topic does not guarantee publication. All submissions remain subject to review and Platform standards.",
      ],
    },
    {
      title: "6.3 Attribution and editorial changes",
      paragraphs: [
        "When an article is published, the Platform may store author name and optional LinkedIn attribution snapshots so credit remains visible over time.",
        "If an editor or administrator updates a published article, the Platform may record editor credit separately from original authorship. This is intended to preserve transparency for learners.",
      ],
    },
    {
      title: "7. User content and intellectual property",
      paragraphs: [
        "You retain ownership of original content you create and submit to DataArena, subject to the license you grant below.",
        "By submitting content to the Platform, you represent and warrant that you own or have the necessary rights to submit that content and that it does not infringe any third party’s intellectual property, privacy, or other rights.",
      ],
    },
    {
      title: "7.1 License you grant to DataArena",
      paragraphs: [
        "By submitting or publishing content on DataArena, you grant us a worldwide, non-exclusive, royalty-free license to host, store, reproduce, display, distribute, and adapt that content within the Platform for educational purposes.",
        "This license allows us to operate core features such as article rendering, search indexing, attribution display, editorial updates, backups, and content migration.",
        "This license continues for published educational content to the extent necessary to keep the learning material available and properly attributed, even if your account is later deactivated.",
      ],
    },
    {
      title: "7.2 Moderation and removal",
      paragraphs: [
        "We may review, edit, reject, unpublish, or remove content that violates these Terms, applicable law, or reasonable educational quality standards.",
        "We are not obligated to host any particular piece of user content and may remove content at our discretion where necessary to protect users, rights holders, or the Platform.",
      ],
    },
    {
      title: "8. Platform intellectual property",
      paragraphs: [
        "DataArena’s software, branding, visual design, curated structure, and original platform materials are owned by DataArena or its licensors and are protected by intellectual property laws.",
        "These Terms do not transfer ownership of the Platform to you. You receive only a limited right to access and use the Platform according to these Terms.",
      ],
    },
    {
      title: "9. Third-party tools and links",
      paragraphs: [
        "The Platform may reference or link to third-party websites, libraries, cloud services, documentation, or tools. We do not control third-party services and are not responsible for their content, availability, security, or privacy practices.",
        "Your use of third-party services is governed by the terms and policies of those third parties.",
      ],
    },
    {
      title: "10. Beta, planned, and changing features",
      paragraphs: [
        "Some features may be labeled as planned, coming soon, beta, or experimental. We may add, modify, suspend, or remove features at any time as the Platform evolves.",
        "We do not guarantee that any specific feature roadmap item will be released, or that released features will remain available indefinitely.",
      ],
    },
    {
      title: "11. Disclaimers",
      paragraphs: [
        "DataArena is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.",
        "We do not warrant that the Platform will be uninterrupted, error-free, secure, or free of harmful components. Educational content may contain inaccuracies or become outdated.",
        "See our Disclaimer page for additional important limitations regarding educational material, practice environments, and AI-assisted features.",
      ],
    },
    {
      title: "12. Limitation of liability",
      paragraphs: [
        "To the fullest extent permitted by law, DataArena and its operators will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including lost profits, lost data, lost opportunities, interview outcomes, employment decisions, or business interruption.",
        "Our total liability for any claim arising out of or relating to the Platform or these Terms will not exceed the greater of the amount you paid us for the Platform in the twelve months before the claim, or one hundred U.S. dollars, if you have not paid for access.",
        "Some jurisdictions do not allow certain limitations of liability, so some of the above limits may not apply to you.",
      ],
    },
    {
      title: "13. Indemnification",
      paragraphs: [
        "You agree to defend, indemnify, and hold harmless DataArena from claims, damages, losses, and expenses arising from your misuse of the Platform, your user content, or your violation of these Terms or applicable law.",
      ],
    },
    {
      title: "14. Suspension and termination",
      paragraphs: [
        "We may suspend or terminate your access immediately if we reasonably believe you have violated these Terms, created security risk, or harmed other users or the Platform.",
        "You may stop using the Platform at any time. Certain provisions, including intellectual property, disclaimers, limitation of liability, and dispute terms, survive termination.",
      ],
    },
    {
      title: "15. Changes to these Terms",
      paragraphs: [
        "We may update these Terms from time to time. When we do, we will revise the “Last updated” date at the top of this page.",
        "If changes are material, we may provide additional notice where appropriate. Continued use of the Platform after updated Terms become effective constitutes acceptance, unless applicable law requires otherwise.",
      ],
    },
    {
      title: "16. Governing law and disputes",
      paragraphs: [
        "These Terms are governed by applicable law in the jurisdiction where DataArena operates, without regard to conflict-of-law principles.",
        "Before initiating formal legal proceedings, you agree to contact us through the Contact page and attempt to resolve the dispute informally in good faith.",
      ],
    },
    {
      title: "17. Contact",
      paragraphs: [
        "Questions about these Terms may be sent through the Contact page on this website.",
      ],
    },
  ],
};
