import type { LegalPage } from "./types";

export const disclaimer: LegalPage = {
  slug: "disclaimer",
  title: "Disclaimer",
  description:
    "Important limitations on how you should interpret educational content, author material, practice features, and AI-assisted tools on DataArena.",
  lastUpdated: "July 22, 2026",
  sections: [
    {
      title: "1. Purpose of this Disclaimer",
      paragraphs: [
        "DataArena exists to help people learn data engineering through structured notes, published articles, interview preparation material, and future practice and AI-assisted tools.",
        "This Disclaimer explains the limits of what the Platform provides and what it does not provide. Please read it carefully before relying on any content, code sample, explanation, or recommendation found on DataArena.",
      ],
    },
    {
      title: "2. Educational content only — not professional advice",
      paragraphs: [
        "All content on DataArena is provided for general educational and informational purposes. Nothing on the Platform should be interpreted as legal advice, financial advice, medical advice, employment advice, or certified professional engineering advice.",
        "Learning about SQL, Python, PySpark, data pipelines, cloud platforms, or interview topics on DataArena does not make you a licensed professional in any jurisdiction, nor does it replace formal training, mentorship, workplace supervision, or production engineering judgment.",
      ],
    },
    {
      title: "3. No guarantee of accuracy or completeness",
      paragraphs: [
        "We work to maintain high-quality educational material, but DataArena does not guarantee that any article, note, explanation, diagram, code sample, or answer is complete, current, error-free, or suitable for your specific environment.",
        "Data engineering changes quickly. Tools are updated, APIs change, cloud services evolve, and best practices shift. Content that was accurate when published may later become outdated, incomplete, or inappropriate for a particular company, stack, or compliance regime.",
        "You are responsible for validating information against official documentation, your organization’s standards, and your own professional requirements before using it in real projects.",
      ],
    },
    {
      title: "4. Author-published content and editorial updates",
      paragraphs: [
        "Some material on DataArena is written or edited by community authors and reviewers. Author names, editor credits, and optional LinkedIn links are displayed to promote transparency and learning attribution.",
        "Author content reflects the knowledge and perspective of the contributor at the time of writing. It does not necessarily represent the official position of DataArena.",
        "Administrators and editors may update published articles for clarity, correctness, structure, or policy compliance. Such updates are intended to improve educational value but do not create a warranty that the final article is perfect or production-ready.",
      ],
    },
    {
      title: "5. Interview preparation limitations",
      paragraphs: [
        "Interview-related content on DataArena is designed to help you study common concepts, practice explanations, and understand typical data engineering topics.",
        "We do not guarantee interview success, job offers, salary outcomes, hiring decisions, or performance in technical assessments. Employers use different evaluation methods, and results depend on many factors outside the Platform.",
      ],
    },
    {
      title: "6. Code samples, queries, and technical examples",
      paragraphs: [
        "Code blocks, SQL queries, scripts, configuration examples, and architecture diagrams are provided to support learning. They may be simplified for teaching purposes and may omit security controls, error handling, monitoring, cost controls, or compliance requirements needed in production systems.",
        "Do not copy technical examples directly into production without review. Examples may use sample data, permissive settings, or deprecated syntax for clarity.",
      ],
    },
    {
      title: "7. Practice labs and execution environments",
      paragraphs: [
        "Where practice labs or code execution features are offered, they are intended for learning and experimentation. Sandbox behavior may differ significantly from real production infrastructure.",
        "You should not execute untrusted code on systems you do not control. You are responsible for protecting your own devices, credentials, datasets, and development environments.",
        "If a practice feature allows you to run queries or scripts, results may be incomplete, mocked, or limited by sandbox restrictions.",
      ],
    },
    {
      title: "8. AI-assisted features",
      paragraphs: [
        "DataArena may offer AI-assisted features such as explanations, debugging help, or content suggestions. AI-generated output can be wrong, incomplete, biased, or misleading, even when it appears confident.",
        "AI responses are not a substitute for careful engineering judgment, official documentation, security review, or human mentorship.",
        "Do not submit passwords, API keys, private customer data, trade secrets, or other sensitive information into AI features. You remain responsible for any content you choose to submit or act upon.",
      ],
    },
    {
      title: "9. Third-party references",
      paragraphs: [
        "Articles and notes may mention third-party products, libraries, certifications, websites, or services. These references are provided for educational context.",
        "DataArena does not endorse every third-party resource mentioned in user or platform content and is not responsible for third-party availability, pricing, licensing, security, or policy changes.",
      ],
    },
    {
      title: "10. No warranty",
      paragraphs: [
        "To the fullest extent permitted by law, DataArena disclaims all warranties, express or implied, regarding the Platform and its content, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
        "Your use of the Platform and reliance on its content is at your own risk.",
      ],
    },
    {
      title: "11. Limitation of responsibility",
      paragraphs: [
        "DataArena is not responsible for losses or damages arising from your use of or reliance on Platform content, including project failures, data loss, downtime, security incidents, missed job opportunities, incorrect technical decisions, or compliance failures.",
        "This Disclaimer should be read together with our Terms of Service, which contain additional limitation of liability provisions.",
      ],
    },
    {
      title: "12. Questions",
      paragraphs: [
        "If you have questions about this Disclaimer, contact us through the Contact page.",
      ],
    },
  ],
};
