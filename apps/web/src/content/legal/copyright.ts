import type { LegalPage } from "./types";

export const copyrightNotice: LegalPage = {
  slug: "copyright",
  title: "Copyright Notice",
  description:
    "How ownership, author credit, editor credit, permitted use, and copyright complaints work on DataArena.",
  lastUpdated: "July 22, 2026",
  sections: [
    {
      title: "1. Overview",
      paragraphs: [
        "DataArena respects intellectual property rights and expects users to do the same. This Copyright Notice explains who owns what on the Platform, how attribution works, what use is permitted, and how to report infringement.",
      ],
    },
    {
      title: "2. Platform-owned materials",
      paragraphs: [
        "Unless otherwise stated, the following are owned by DataArena or its licensors and are protected by copyright, trademark, and other intellectual property laws:",
      ],
      bullets: [
        "The DataArena name, logo, and brand identity.",
        "The Platform’s software, user interface, design system, and underlying code.",
        "Original platform copy, curated structure, and non-user-generated educational organization.",
        "Graphics, layout elements, and proprietary learning framework created by DataArena.",
      ],
    },
    {
      title: "3. User-generated and author-published content",
      paragraphs: [
        "Authors and editors who publish educational articles on DataArena generally retain ownership of the original content they create, subject to the license granted in our Terms of Service.",
        "By publishing on the Platform, contributors grant DataArena the right to host, display, distribute, and reasonably adapt that content within the Platform for educational purposes.",
      ],
    },
    {
      title: "4. Attribution and credit snapshots",
      paragraphs: [
        "DataArena uses an attribution system so learners can see who created and contributed to educational material.",
      ],
      bullets: [
        "Author credit: published articles may display the author’s name and optional LinkedIn profile snapshot captured at publication time.",
        "Editor credit: if an editor or administrator materially updates a published article, the Platform may display separate editor attribution.",
        "Attribution snapshots may remain visible even if a user later changes profile details or deactivates an account, because educational credit and content integrity are important parts of the Platform.",
      ],
    },
    {
      title: "5. Permitted use",
      paragraphs: [
        "Unless you have written permission from the rights holder, you may use DataArena content only within the boundaries below.",
      ],
      bullets: [
        "Personal learning: you may read, study, and reference Platform content for your own non-commercial education.",
        "Limited sharing: you may share short excerpts with attribution for discussion, study groups, or commentary, provided you do not reproduce substantial portions of the Platform or compete with it.",
        "Workplace learning: internal study using Platform content may be acceptable for personal professional development, but redistribution inside a company still must respect copyright and these rules.",
      ],
    },
    {
      title: "6. Prohibited use",
      paragraphs: ["You may not, without explicit permission:"],
      bullets: [
        "Republish, sell, sublicense, or commercially exploit Platform content.",
        "Scrape or bulk download articles, notes, or other materials for republishing elsewhere.",
        "Remove author, editor, or Platform attribution from content.",
        "Present DataArena content as your own original work.",
        "Create competing databases or learning products using substantial portions of Platform material.",
        "Use automated tools to systematically copy or mirror the Platform.",
      ],
    },
    {
      title: "7. Third-party materials",
      paragraphs: [
        "Educational articles may reference third-party documentation, logos, trademarks, code snippets, or screenshots. Those materials remain the property of their respective owners.",
        "References in learning content do not imply endorsement by DataArena or by the third party unless explicitly stated.",
      ],
    },
    {
      title: "8. Copyright complaints and takedown requests",
      paragraphs: [
        "If you believe content on DataArena infringes your copyright, please contact us with a detailed notice including:",
      ],
      bullets: [
        "Your name and contact information.",
        "Identification of the copyrighted work you believe has been infringed.",
        "The specific URL or location of the allegedly infringing material on DataArena.",
        "A statement that you have a good-faith belief that the use is not authorized by the copyright owner, its agent, or the law.",
        "A statement, under penalty of perjury where applicable, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the owner’s behalf.",
        "Your physical or electronic signature, if required by applicable law.",
      ],
    },
    {
      title: "9. Repeat infringement",
      paragraphs: [
        "We may suspend or terminate accounts of users who repeatedly infringe intellectual property rights or who upload content they do not have the right to publish.",
      ],
    },
    {
      title: "10. Questions",
      paragraphs: [
        "For copyright questions or permission requests, contact us through the Contact page.",
      ],
    },
  ],
};
