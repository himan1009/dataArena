import type { LegalPage } from "./types";

export const securityPolicy: LegalPage = {
  slug: "security",
  title: "Security",
  description:
    "How DataArena protects accounts and data, what security controls we use, and how to report vulnerabilities responsibly.",
  lastUpdated: "July 22, 2026",
  sections: [
    {
      title: "1. Our security commitment",
      paragraphs: [
        "Security is essential for any platform that handles user accounts, educational content, editorial workflows, and support communications. DataArena is designed with security in mind, but no internet service can promise perfect protection.",
        "This page explains the security measures we use, the responsibilities you have as a user, and how to report security concerns responsibly.",
      ],
    },
    {
      title: "2. Security principles we follow",
      paragraphs: [
        "Our approach to security is based on practical engineering principles appropriate for an educational platform:",
      ],
      bullets: [
        "Least privilege: administrative and editorial capabilities are restricted by role.",
        "Defense in depth: multiple layers protect authentication, application routes, and sensitive operations.",
        "Secure defaults: passwords are hashed, authenticated areas require valid sessions, and public endpoints are rate limited where appropriate.",
        "Transparency with users: we explain key risks and encourage responsible reporting.",
        "Continuous improvement: security controls evolve as features and threats evolve.",
      ],
    },
    {
      title: "3. Account and authentication security",
      paragraphs: [
        "DataArena uses account-based authentication with access and refresh tokens stored in HTTP-only cookies after login.",
      ],
      bullets: [
        "Passwords are hashed before storage and are never displayed or returned by the API.",
        "Authenticated sessions allow access to protected areas such as the dashboard, notes workspace, author tools, settings, and admin panels.",
        "Refresh tokens support session renewal while allowing revocation on logout or account compromise response.",
        "Protected frontend routes require a valid authenticated session before loading app pages.",
      ],
    },
    {
      title: "4. Role-based access control",
      paragraphs: [
        "Not every user should have the same capabilities. DataArena separates access by role:",
      ],
      bullets: [
        "USER accounts can access learning and personal account features.",
        "EDITOR accounts can access publishing workflows and assigned editing tasks.",
        "ADMIN accounts can manage users, categories, topics, reviews, inbox messages, and direct content administration.",
      ],
    },
    {
      title: "4.1 Administrative safeguards",
      paragraphs: [
        "Sensitive admin actions such as user management, article administration, editor assignment, and inbox review are restricted to authorized admin accounts.",
        "Editorial workflows reduce the risk of unreviewed content being published at scale by requiring review states for author submissions.",
      ],
    },
    {
      title: "5. Application and API protections",
      paragraphs: [
        "We apply several application-level controls to reduce common web security risks:",
      ],
      bullets: [
        "Input validation on registration, feedback forms, and content submission endpoints.",
        "Rate limiting on sensitive public endpoints such as contact and bug reporting to reduce spam and abuse.",
        "Server-side authorization checks for protected API routes and role-restricted operations.",
        "Separation between public marketing pages and authenticated application areas.",
      ],
    },
    {
      title: "6. Data protection",
      paragraphs: [
        "Personal data and platform content are stored in managed infrastructure with access restricted to operational needs.",
        "We aim to minimize exposure of sensitive information in logs, support tickets, and public content. Users should avoid submitting secrets, credentials, or confidential business data in articles, bug reports, or contact messages.",
      ],
    },
    {
      title: "7. What we cannot guarantee",
      paragraphs: [
        "Despite our efforts, we cannot guarantee that the Platform will be completely free from vulnerabilities, unauthorized access, downtime, or data loss.",
        "Security also depends on user behavior. Weak passwords, shared accounts, phishing, and unsafe copying of code into production environments can create risk outside our control.",
      ],
    },
    {
      title: "8. Your security responsibilities",
      paragraphs: [
        "You play an important role in keeping your account and learning environment secure:",
      ],
      bullets: [
        "Use a strong, unique password that you do not reuse on other websites.",
        "Do not share your login credentials with anyone.",
        "Log out on shared or public devices.",
        "Be cautious of phishing messages pretending to be from DataArena.",
        "Do not publish API keys, passwords, private connection strings, or customer data in articles or support requests.",
        "Review AI-generated or copied code carefully before running it in your own environment.",
      ],
    },
    {
      title: "9. Reporting security vulnerabilities",
      paragraphs: [
        "If you believe you have found a security vulnerability in DataArena, please report it responsibly.",
        "Use the Report a bug page or Contact page and include enough technical detail for us to reproduce and understand the issue. If possible, describe the affected endpoint, role, browser, and steps to reproduce.",
        "Please do not publicly disclose vulnerabilities before we have had a reasonable opportunity to investigate and remediate them.",
        "We appreciate good-faith security reports from the community.",
      ],
    },
    {
      title: "10. Incident response",
      paragraphs: [
        "If we become aware of a security incident that affects user data or platform integrity, we will investigate promptly, take steps to contain and remediate the issue, and provide notice where required by applicable law.",
        "Our response may include password resets, token revocation, temporary feature restrictions, or account suspension depending on the nature of the incident.",
      ],
    },
    {
      title: "11. Related policies",
      paragraphs: [
        "For information about how personal data is handled, see our Privacy Policy. For platform rules and acceptable use, see our Terms of Service.",
      ],
    },
  ],
};
