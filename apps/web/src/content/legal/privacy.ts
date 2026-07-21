import type { LegalPage } from "./types";

export const privacyPolicy: LegalPage = {
  slug: "privacy",
  title: "Privacy Policy",
  description:
    "A detailed explanation of what personal data DataArena collects, why we collect it, how long we keep it, and the choices available to you.",
  lastUpdated: "July 22, 2026",
  sections: [
    {
      title: "1. Introduction and who this policy applies to",
      paragraphs: [
        "DataArena is an online learning platform focused on data engineering. We provide structured notes, author publishing workflows, interview preparation material, and planned practice and AI-assisted features.",
        "This Privacy Policy describes how DataArena (“we”, “us”, “our”) collects, uses, stores, shares, and protects personal information when you visit our website, create an account, read content, publish articles, contact support, or otherwise interact with the platform.",
        "This policy applies to all visitors and registered users, including standard users, editors, and administrators. If you do not agree with this policy, please do not use DataArena.",
      ],
    },
    {
      title: "2. Definitions used in this policy",
      paragraphs: ["For clarity, the following terms are used throughout this document:"],
      bullets: [
        "Personal data: any information that identifies you or can reasonably be linked to you, such as your name, email address, or account activity.",
        "Platform: the DataArena website, web application, APIs, and related services.",
        "User content: articles, messages, bug reports, contact submissions, and other material you submit through the platform.",
        "Processing: any operation performed on personal data, including collection, storage, use, disclosure, and deletion.",
      ],
    },
    {
      title: "3. Information we collect",
      paragraphs: [
        "We collect information in three main ways: information you provide directly, information generated through your use of the platform, and limited technical information from your device and browser.",
      ],
    },
    {
      title: "3.1 Information you provide when creating an account",
      paragraphs: [
        "When you register, we collect your email address, password, and optional display name. Passwords are never stored in plain text. They are processed using secure one-way hashing before being saved in our database.",
        "Your account is also assigned a role. By default, new accounts receive the USER role. Some accounts may later be promoted to EDITOR or ADMIN by platform administrators for publishing and content management purposes.",
      ],
    },
    {
      title: "3.2 Profile and author information",
      paragraphs: [
        "If you are an editor or administrator, you may optionally add a LinkedIn profile URL in Settings. When you publish an article, a snapshot of your author name and LinkedIn URL may be stored with that article so readers can see who wrote it, even if your profile changes later.",
        "This attribution snapshot is part of the platform’s educational publishing model and is visible on published article pages.",
      ],
    },
    {
      title: "3.3 Content and communications you submit",
      paragraphs: [
        "Depending on how you use DataArena, we may process the following user-submitted content:",
      ],
      bullets: [
        "Articles and drafts you write, edit, submit for review, or publish through the author workspace.",
        "Edit requests, review comments, and editorial notes associated with article workflows.",
        "Contact form submissions, including your name, email address, and message body.",
        "Bug reports, including your name, email, affected product area, optional page URL, and description of the issue.",
      ],
    },
    {
      title: "3.4 Usage and technical information",
      paragraphs: [
        "When you access the platform, our systems may automatically record technical information needed to operate and secure the service. This may include your IP address, browser type, device characteristics, request timestamps, pages visited, and error logs.",
        "We use this information to maintain service reliability, detect abuse, troubleshoot bugs, and understand which parts of the platform are used most often.",
      ],
    },
    {
      title: "3.5 Authentication cookies and session data",
      paragraphs: [
        "To keep you signed in, DataArena uses HTTP-only cookies for access and refresh tokens after successful login. These cookies are essential for authentication and are described in more detail in our Cookie Policy.",
        "We do not use authentication cookies to sell advertising profiles or track you across unrelated third-party websites.",
      ],
    },
    {
      title: "4. How and why we use personal data",
      paragraphs: [
        "We process personal data only where we have a legitimate purpose related to operating DataArena, providing educational services, maintaining security, or complying with law.",
      ],
      bullets: [
        "Account creation and login: to register you, authenticate sessions, and protect access to your workspace.",
        "Content delivery: to display notes, categories, topics, and published articles to learners.",
        "Author publishing: to manage drafts, submissions, reviews, editor assignments, publication, and permanent author/editor attribution.",
        "Administration: to allow authorized administrators to manage users, categories, topics, reviews, and inbox messages.",
        "Support and feedback: to read and respond to contact messages and bug reports submitted by users.",
        "Security and abuse prevention: to investigate suspicious activity, enforce platform rules, and protect users and infrastructure.",
        "Service improvement: to fix defects, improve performance, and plan new educational features.",
        "Legal compliance: to respond to lawful requests and meet regulatory obligations where applicable.",
      ],
    },
    {
      title: "5. Legal bases for processing (where applicable)",
      paragraphs: [
        "Depending on your location, privacy laws may require us to identify a legal basis for processing personal data. In general, we rely on one or more of the following:",
      ],
      bullets: [
        "Contract: processing necessary to provide the platform and account features you request.",
        "Legitimate interests: operating, securing, and improving an educational platform, preventing abuse, and maintaining attribution for published learning content.",
        "Consent: where required for optional activities or communications, such as certain non-essential cookies if introduced in the future.",
        "Legal obligation: where we must retain or disclose information to comply with applicable law.",
      ],
    },
    {
      title: "6. How we share personal data",
      paragraphs: [
        "We do not sell your personal data. We also do not rent or trade your personal information to data brokers or advertising networks.",
        "We may share limited personal data only in the circumstances described below.",
      ],
      bullets: [
        "Service providers: hosting providers, database services, email-related tooling, or infrastructure vendors that help us run the platform under confidentiality and security obligations.",
        "Published attribution: when you publish educational content, your author name and optional LinkedIn snapshot may be visible to other users as part of the article credit system.",
        "Administrators and editors: authorized staff or editor accounts may access content, submissions, and support messages as part of editorial review, moderation, and platform administration.",
        "Legal and safety disclosures: where required by law, court order, or governmental request, or where necessary to protect the rights, safety, and security of users, the public, or DataArena.",
        "Business transfers: if DataArena is involved in a merger, acquisition, or asset sale, personal data may transfer as part of that transaction subject to continued protection.",
      ],
    },
    {
      title: "7. International data transfers",
      paragraphs: [
        "DataArena may be accessed globally. Your information may be processed in countries other than the one where you live. Where required, we take reasonable steps to ensure appropriate safeguards for cross-border transfers.",
      ],
    },
    {
      title: "8. Data retention",
      paragraphs: [
        "We retain personal data only for as long as necessary for the purposes described in this policy, unless a longer retention period is required or permitted by law.",
      ],
      bullets: [
        "Account data: retained while your account remains active and for a reasonable period afterward to handle support, disputes, or legal obligations.",
        "Published articles and attribution snapshots: may be retained to preserve educational content integrity and author credit, even if an account is deactivated.",
        "Contact and bug report records: retained in the admin inbox for support, quality, and security review, then archived or deleted according to operational needs.",
        "Authentication logs and security records: retained for a limited period to investigate incidents and protect the platform.",
      ],
    },
    {
      title: "9. Your privacy rights and choices",
      paragraphs: [
        "Depending on your jurisdiction, you may have rights regarding your personal data. These may include:",
      ],
      bullets: [
        "The right to access the personal data we hold about you.",
        "The right to correct inaccurate or incomplete account information.",
        "The right to request deletion of your account and certain associated data, subject to legal and content-preservation limits.",
        "The right to object to or restrict certain processing activities.",
        "The right to withdraw consent where processing is based on consent.",
        "The right to lodge a complaint with a data protection authority, where applicable.",
      ],
    },
    {
      title: "9.1 How to exercise your rights",
      paragraphs: [
        "To make a privacy request, contact us through the Contact page and clearly describe the request. We may need to verify your identity before fulfilling certain requests.",
        "You can update your display name and LinkedIn URL directly in Settings where those features are available.",
      ],
    },
    {
      title: "10. Children’s privacy",
      paragraphs: [
        "DataArena is intended for learners who meet the minimum age required to use online services in their jurisdiction. We do not knowingly collect personal data from children below the applicable minimum age without appropriate parental consent.",
        "If you believe a child has provided personal data to us improperly, contact us and we will review the matter.",
      ],
    },
    {
      title: "11. Security measures",
      paragraphs: [
        "We implement technical and organizational safeguards designed to protect personal data, including password hashing, authenticated access controls, protected application routes, and rate limiting on sensitive public endpoints.",
        "No online service can guarantee absolute security. You are responsible for keeping your login credentials confidential. For more detail, read our Security page.",
      ],
    },
    {
      title: "12. Changes to this Privacy Policy",
      paragraphs: [
        "We may update this Privacy Policy as the platform evolves, as laws change, or as our data practices mature. When we make material changes, we will update the “Last updated” date at the top of this page.",
        "Your continued use of DataArena after an updated policy becomes effective means you accept the revised policy, unless applicable law requires a different form of notice or consent.",
      ],
    },
    {
      title: "13. Contact us about privacy",
      paragraphs: [
        "If you have questions, concerns, or requests related to this Privacy Policy or our handling of personal data, please contact us through the Contact page on this website.",
        "Please include enough detail for us to understand and respond to your request, including the email address associated with your account if applicable.",
      ],
    },
  ],
};
