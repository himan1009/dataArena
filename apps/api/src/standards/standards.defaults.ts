import { WritingStandardKey } from '@prisma/client';

export type WritingStandardDefault = {
  key: WritingStandardKey;
  title: string;
  content: string;
};

/** Bump when default content changes so existing DB rows refresh on startup. */
export const WRITING_STANDARDS_CONTENT_VERSION = 2;

export const WRITING_STANDARD_DEFAULTS: WritingStandardDefault[] = [
  {
    key: WritingStandardKey.MANDATORY,
    title: 'Mandatory Article Requirements',
    content: `# Data Arena — Mandatory Article Requirements

> **Publish gate:** An article must **not** be submitted or published unless every requirement below is clearly present in the article. These are non-negotiable checkpoints for editors and admin reviewers.

---

## Mandatory publish gate (quick check)

Before you submit, confirm your article contains **all** of the following sections (use these headings or clearly equivalent sections):

1. **What is it?** — plain definition
2. **Why does it matter?** — problem and motivation
3. **When to use it** — use cases + when **not** to use it
4. **How it works** — internal flow / mechanics
5. **How to use it** — practical steps or examples
6. **Real-world usage** — production or interview relevance
7. **Common mistakes** — pitfalls and misconceptions
8. **Key takeaways** — short summary at the end

If any section is missing, the article is **not ready**.

---

## 1. What is it? (Definition — required)

**You must include:**
- A clear definition of the concept in simple language (2–4 sentences minimum).
- What category it belongs to (e.g. storage, transformation, orchestration, SQL concept).
- What problem space it sits in before any syntax or code appears.

**Do not:**
- Start with code, commands, or configuration.
- Assume the reader already knows the term.

**Example pattern:**
> *"Apache Airflow is a workflow orchestration platform used to schedule, monitor, and manage data pipelines. It helps teams run dependent tasks in the correct order and retry failures automatically."*

---

## 2. Why does it matter? (Motivation — required)

**You must include:**
- The real problem this concept solves.
- Why teams use it instead of manual scripts or simpler alternatives.
- What breaks or becomes painful without it (at least one concrete pain point).

**Mention explicitly:**
- Business or engineering pain (reliability, scale, maintainability, cost, latency).
- Why this concept exists in modern data engineering.

---

## 3. When to use it (Use cases — required)

**You must include:**
- **At least 2 valid use cases** where this concept is the right choice.
- **At least 1 situation where it should NOT be used** (limitations, anti-patterns, or better alternatives).
- Clear signals that help a reader decide: *"Use this when… / Avoid this when…"*

**Format tip:** Use a small table or bullet list titled **When to use** and **When to avoid**.

---

## 4. Build intuition before implementation (Required order)

**You must:**
- Explain the idea in words **before** showing syntax, queries, or code.
- Use an analogy, scenario, or step-by-step narrative where helpful.
- Show *what happens* conceptually before *how to write it*.

**Rule:** No code block may appear before the reader understands what the code is trying to accomplish.

---

## 5. How it works (Internals & flow — required)

**You must include:**
- The internal working, lifecycle, or data flow (even at a high level).
- Key components, stages, or actors involved.
- How input becomes output (step-by-step or diagram).

**Acceptable formats:**
- Numbered flow (Step 1 → Step 2 → Step 3)
- Architecture-style explanation
- Mermaid-style description in prose (diagram optional but encouraged)

**A reader should be able to explain the mechanism in an interview after reading this section.**

---

## 6. Define every technical term (Glossary rule — required)

**You must:**
- Define **every new keyword** the first time it appears (acronyms, product names, jargon).
- Expand acronyms on first use (e.g. *OLAP (Online Analytical Processing)*).
- Avoid chained undefined terms (don't use term B in the definition of term A if B was never explained).

**If the article introduces 5+ terms, add a short "Key terms" subsection.**

---

## 7. Purposeful examples (Code & examples — required)

**Every example or code snippet must have:**
1. **Purpose** — what concept this example teaches (state it in one sentence above the code).
2. **The example itself** — realistic, minimal, and correct.
3. **Explanation after** — what each important line/part does and what output to expect.

**You must include:**
- At least **one complete worked example** (not only fragments).
- Expected output or result when applicable (table, log line, or described outcome).

**Do not:**
- Paste large code blocks without explanation.
- Use pseudo-code unless labeled as pseudo-code.

---

## 8. Real-world relevance (Production context — required)

**You must connect the topic to at least one of:**
- Production data pipeline scenarios
- Cloud or warehouse environments (e.g. S3, BigQuery, Spark, Kafka) when relevant
- Team workflows (ingestion, modeling, testing, deployment)
- Interview or on-the-job situations

**State clearly:** *"In production, teams typically use this when…"*

---

## 9. Visuals when they improve clarity (Required when applicable)

**You must add a diagram, table, or flowchart when:**
- The concept involves multiple components or systems
- You compare two or more options
- A sequence of steps is easier to see than to read in prose

**Minimum:** If the topic is architectural or multi-step, include **at least one** visual or structured table.

---

## 10. Performance & trade-offs (Required when relevant)

**When the topic affects scale, speed, cost, or resources, you must mention:**
- Performance characteristics or bottlenecks
- Trade-offs (simplicity vs scale, cost vs speed)
- Optimization considerations or best practices

**If not relevant** (e.g. a basic SQL keyword), state briefly: *"Performance is not a primary concern for this concept at introductory level."*

---

## 11. Common mistakes & edge cases (Required section)

**You must include a dedicated section covering:**
- At least **3 common mistakes** or misconceptions
- At least **1 edge case** or limitation readers often miss
- What goes wrong and how to avoid it

**Suggested heading:** \`## Common mistakes\` or \`## Pitfalls to avoid\`

---

## 12. Compare related concepts (Required when alternatives exist)

**If similar tools or concepts exist, you must:**
- Name the alternatives
- Explain **differences** (not just definitions)
- Give guidance: **"Choose X when… / Choose Y when…"**

**Examples:** batch vs stream, DELETE vs TRUNCATE, Parquet vs CSV, Airflow vs Dagster.

If no close alternative exists, state that explicitly.

---

## 13. Logical flow (Article structure — required)

**The article must follow this progression:**
1. Definition & motivation (What + Why)
2. When to use / avoid
3. Intuition & how it works
4. Examples & usage
5. Mistakes, comparisons, performance (as applicable)
6. Key takeaways

**Do not jump** from advanced topic back to basics without signposting.

---

## 14. Beginner-friendly language (Required tone)

**You must:**
- Use short paragraphs (3–5 sentences max in most cases).
- Prefer simple words first, then introduce technical terms with definitions.
- Write so a motivated beginner with basic data/SQL knowledge can follow.

**Technical accuracy is mandatory — simplicity must not mean incorrectness.**

---

## 15. Key takeaways (Required closing section)

**End every article with a \`## Key takeaways\` section containing:**
- **5–8 bullet points** summarizing the most important ideas
- No new concepts introduced in the takeaway section
- Actionable memory hooks for revision and interviews

---

# Golden rule — five questions every article must answer

An admin or reviewer will check that a reader can answer **all five** after reading your article:

| # | Question | Where it must appear |
|---|----------|----------------------|
| 1 | **What is it?** | Opening definition section |
| 2 | **Why does it exist?** | Motivation / problem section |
| 3 | **How does it work?** | Internals / flow section |
| 4 | **When should it be used?** | Use cases + anti-patterns |
| 5 | **How is it used in real systems?** | Examples + production context |

**If you cannot point to a section for each row, the article is not publish-ready.**

---

# Pre-submit checklist (editors)

Copy this list into your draft review notes and tick each item:

- [ ] Definition appears before any code
- [ ] Why / problem is explained with a real pain point
- [ ] When to use **and** when to avoid are both covered
- [ ] How it works (flow or components) is explained
- [ ] Every new term is defined on first use
- [ ] At least one full example has purpose + code + explanation
- [ ] Production or real-world context is included
- [ ] Common mistakes section has 3+ items
- [ ] Related concepts compared (or noted as N/A)
- [ ] Key takeaways section at the end (5–8 bullets)
- [ ] Golden rule: all 5 questions answered in the article`,
  },
  {
    key: WritingStandardKey.ESSENTIAL,
    title: 'Essential Writing Guidelines',
    content: `# Data Arena — Essential Writing Guidelines

> **Purpose:** These guidelines define *how* to write on Data Arena — tone, structure, formatting, and clarity. Follow them together with the **Mandatory Article Requirements** so every article feels consistent, trustworthy, and easy to learn from.

---

## How to use these guidelines

- **Mandatory requirements** = what sections and content must exist (publish gate).
- **Essential guidelines** = how to write those sections well (quality and style).
- Read mandatory first when outlining; use essential while drafting and editing.

---

## 1. Write for the reader, not for yourself

**Do:**
- Assume the reader is smart but **new to this specific topic**.
- Explain *why* each paragraph exists — if it doesn't teach something, remove it.
- Use "you" and direct language: *"When you run this query…"*

**Don't:**
- Show off with unnecessary complexity.
- Skip steps you find "obvious" — they rarely are for beginners.
- Write for impressing seniors; write for **teaching learners**.

---

## 2. One idea per section

Each \`##\` heading should cover **one core idea only**.

**Good structure:**
\`\`\`
## What is a surrogate key?
(paragraphs only about definition)

## Why surrogate keys matter in warehouses
(paragraphs only about motivation)

## When to use surrogate keys
(use cases only)
\`\`\`

**Bad structure:** Mixing definition, syntax, and performance in one long section with no subheadings.

**Rule of thumb:** If you need "also" or "another thing" mid-section, start a new heading.

---

## 3. Explain before you show

**Order within every section:**
1. Concept in plain English
2. Why it matters in that context
3. Then code, syntax, config, or CLI

**For SQL articles:** Describe the business question before the SELECT.

**For pipeline articles:** Describe the data movement before the tool configuration.

**Never** drop a code block and say "this does X" without prior context.

---

## 4. Learning progression: simple → advanced

Build confidence in layers:

| Stage | What to cover |
|-------|----------------|
| **Level 1** | Definition, one simple example |
| **Level 2** | How it works, typical use case |
| **Level 3** | Edge cases, performance, comparisons |
| **Level 4** | Production patterns, interview depth (if topic allows) |

Mark advanced sections clearly: *"Going deeper:"* or \`### Advanced note\` so beginners can skip without getting lost.

---

## 5. Clear, concise paragraphs

- **Target:** 2–4 sentences per paragraph.
- **One main point** per paragraph.
- **Active voice** where possible: *"Airflow schedules the task"* not *"The task is scheduled by Airflow."*
- Cut filler: "It is important to note that", "In today's world", "Basically".

**Test:** Read each paragraph aloud. If you run out of breath, split it.

---

## 6. Headings that teach

Headings are navigation **and** learning aids.

**Use:**
- Descriptive headings: \`## How Kafka retains messages\`
- Parallel structure in lists of sections
- \`##\` for main sections, \`###\` for subtopics — don't skip levels

**Avoid:**
- Vague headings: \`## More info\`, \`## Details\`, \`## Other things\`
- Clickbait or joke headings that hide the topic

---

## 7. Terminology & jargon discipline

- Define acronyms **on first use**: *ETL (Extract, Transform, Load)*.
- Use **one term consistently** — don't switch between "record", "row", and "entry" for the same thing unless you explain the difference.
- If a term has multiple meanings in industry, say which meaning **you** use in this article.

**Bold** the term the first time you define it: **idempotent** — *an operation that produces the same result if run once or multiple times.*

---

## 8. Code blocks & examples — Data Arena standard

**Every code block should:**
- Use the correct language label (sql, python, bash, etc.)
- Stay as short as possible while remaining runnable or realistic
- Include comments only where they add teaching value (not line-by-line noise)

**After every code block, include:**
1. What it demonstrates
2. What output or behavior to expect
3. One common mistake to avoid with this pattern

**Sample data:** Prefer realistic names (\`orders\`, \`customer_id\`) over \`foo\` / \`bar\` unless teaching abstraction.

---

## 9. Tables & comparisons

When comparing options, use a table:

| Aspect | Option A | Option B |
|--------|----------|----------|
| Best for | … | … |
| Trade-off | … | … |

Tables are required when you discuss **two or more** tools or approaches at the same level of depth.

---

## 10. Production context — make it concrete

Ground abstract ideas in scenarios readers recognize:

- *"A retail company ingests daily sales from stores into a lake…"*
- *"Before a deploy, the analytics team needs to backfill three months of data…"*

Mention **who** cares (analyst, engineer, platform team) and **what breaks** if done wrong.

---

## 11. Visual thinking

Plan visuals while outlining, not after drafting.

**Use a diagram or table when:**
- Data moves between systems
- A process has 4+ steps
- You compare architectures

**In prose, signal visuals:** *"The flow below shows…"* even if the diagram is added later.

---

## 12. Technical accuracy — verify before submit

Before submission, double-check:
- [ ] Commands and syntax match the stated version or engine
- [ ] SQL runs logically (correct JOINs, no ambiguous columns)
- [ ] No outdated practices presented as current best practice without a note
- [ ] Links to docs or related Data Arena topics are correct

**If unsure,** say *"behavior may vary by version"* rather than stating false certainty.

---

## 13. Professional, educational tone

- Neutral and objective — no hype (*"revolutionary", "game-changing"*).
- No sarcasm or memes in technical explanations.
- Acknowledge trade-offs honestly; no silver bullets.

**Good:** *"Spark works well for large distributed transforms but adds operational overhead for small jobs."*

**Bad:** *"Spark is always the best choice for everything."*

---

## 14. Self-contained articles

A reader should understand **this topic's fundamentals** without leaving Data Arena for the core explanation.

**You may link** to prerequisite topics (e.g. "understand JOINs first") but must still give enough context to orient the reader.

**Minimum context rule:** If you mention a prerequisite, include 1–2 sentences reminding what it is.

---

## 15. Connect the learning path

At the end (before or after Key takeaways), when relevant, add:

**Related topics on Data Arena:**
- Prerequisites readers should know first
- Follow-up topics for deeper learning

This helps readers continue without dead ends.

---

## Recommended article template

Use this outline as a starting skeleton:

\`\`\`
# [Topic title]

## What is [topic]?
(definition)

## Why [topic] matters
(problem + motivation)

## When to use [topic]
(use cases + when to avoid)

## How [topic] works
(flow / components)

## How to use [topic]
(examples with explanation)

## Real-world usage
(production scenario)

## Common mistakes
(3+ pitfalls)

## [Topic] vs alternatives
(comparison, if applicable)

## Key takeaways
(5–8 bullets)
\`\`\`

---

## Final review checklist (before submit)

Answer **yes** to every question before sending to admin review:

**Clarity**
- [ ] Can a beginner follow the article without guessing missing steps?
- [ ] Is every section title descriptive?
- [ ] Is every code block explained?

**Completeness**
- [ ] Do all mandatory sections exist?
- [ ] Are all five golden-rule questions answered?

**Quality**
- [ ] Did I remove repetition and filler?
- [ ] Is terminology consistent throughout?
- [ ] Would I recommend this article to someone learning this topic for the first time?

**Data Arena fit**
- [ ] Does the article match the topic brief and category?
- [ ] Is the tone professional and educational?
- [ ] Are related Data Arena topics linked where helpful?

---

## Editor mindset

You are not just documenting a feature — you are **designing a learning experience**. Every section should answer: *"What will the reader understand after this that they didn't understand before?"*

If the answer is unclear, rewrite the section.`,
  },
];
