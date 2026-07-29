# Data Arena V1 -- Interview Experiences Module Architecture

> **Version:** V1\
> **Prepared By:** Principal Solution Architect Perspective\
> **Purpose:** Define the functional architecture and workflow for the
> Interview Experiences module. This document intentionally avoids
> database schema and infrastructure-level design. The focus is on user
> flow, review workflow, frontend, and admin experience.

------------------------------------------------------------------------

# 1. Vision

The Interview Experiences module allows community members to share real
interview experiences while ensuring that every published experience is
manually reviewed by the Data Arena team.

The primary goals are:

-   Build trust with authentic experiences.
-   Create valuable preparation content.
-   Maintain content quality through manual review.
-   Keep the workflow simple and manageable for V1.

------------------------------------------------------------------------

# 2. Scope (V1)

Included:

-   Browse interview experiences
-   Search and filters
-   Submit interview experience
-   Save draft
-   Manual review by admin
-   Publish approved experiences
-   Request changes
-   Reject submissions
-   Report published content

------------------------------------------------------------------------

# 3. High-Level Workflow

``` text
User
  │
  ▼
Create Interview Experience
  │
  ▼
Save Draft (Optional)
  │
  ▼
Submit for Review
  │
  ▼
Pending Review
  │
  ▼
Admin Reviews
  ├───────────────┬────────────────┐
  ▼               ▼                ▼
Approve     Needs Changes      Reject
  │               │                │
Published     User Updates     End Process
                  │
                  ▼
           Submit Again
```

------------------------------------------------------------------------

# 4. User Journey

## Step 1 -- Discover

Users visit the Interview Experiences section from the navigation or
homepage.

Visible elements:

-   Search bar
-   Featured companies
-   Latest interview experiences
-   Company filters
-   Role filters
-   Experience-level filters
-   "Share Your Interview Experience" CTA

------------------------------------------------------------------------

## Step 2 -- Read

Each published experience contains:

-   Title
-   Company
-   Role
-   Experience level
-   Interview year
-   Result
-   Overview
-   Interview rounds
-   Questions asked
-   Preparation tips
-   Final advice
-   Related experiences
-   Report button

------------------------------------------------------------------------

## Step 3 -- Contribute

Only logged-in users can create a submission.

Users can:

-   Create
-   Save draft
-   Edit draft
-   Preview
-   Submit

------------------------------------------------------------------------

# 5. Submission Wizard

## Section 1 -- Basic Information

Capture:

-   Company
-   Role
-   Experience level
-   Interview year
-   Location (optional)
-   Result
-   Title

------------------------------------------------------------------------

## Section 2 -- Interview Overview

Short summary describing the overall hiring process.

------------------------------------------------------------------------

## Section 3 -- Interview Rounds

Users can add multiple rounds.

Each round should include:

-   Round name
-   Round type
-   Duration
-   Difficulty
-   Questions asked
-   Candidate experience
-   Outcome

Support:

**+ Add Another Round**

------------------------------------------------------------------------

## Section 4 -- Preparation Tips

Questions such as:

-   What helped most?
-   Important topics
-   Resources used

------------------------------------------------------------------------

## Section 5 -- Final Advice

Free-form guidance for future candidates.

------------------------------------------------------------------------

## Section 6 -- Preview

Render the experience exactly as it will appear after publishing.

Actions:

-   Save Draft
-   Submit for Review

------------------------------------------------------------------------

# 6. Draft Management

Users should always be able to:

-   Save drafts
-   Resume later
-   Edit drafts before submission

Once submitted:

-   Editing is locked.
-   Status becomes **Pending Review**.

------------------------------------------------------------------------

# 7. Submission Statuses

Only five statuses are required.

  Status           Description
  ---------------- -------------------------
  Draft            User is still writing
  Pending Review   Awaiting admin review
  Needs Changes    Admin requested updates
  Published        Publicly visible
  Rejected         Submission declined

------------------------------------------------------------------------

# 8. User Dashboard

Sections:

-   My Drafts
-   Pending Review
-   Needs Changes
-   Published
-   Rejected

Each item should display:

-   Company
-   Role
-   Last updated
-   Current status

------------------------------------------------------------------------

# 9. Admin Dashboard

## Dashboard

Cards:

-   Pending Reviews
-   Published Experiences
-   Needs Changes
-   Rejected

------------------------------------------------------------------------

## Review Queue

Columns:

-   Company
-   Role
-   Author
-   Submitted date
-   Status

Clicking a row opens the full submission.

------------------------------------------------------------------------

## Review Screen

Display the submission exactly as readers will see it.

Admin actions:

-   Approve
-   Needs Changes
-   Reject
-   Delete

When selecting **Needs Changes**, the admin adds a review note
explaining what must be updated.

------------------------------------------------------------------------

# 10. User Notifications

Trigger notifications when:

-   Submission approved
-   Submission rejected
-   Changes requested

Example:

> Your interview experience has been approved and is now live.

------------------------------------------------------------------------

# 11. Public Experience Page

Visible sections:

1.  Header
2.  Overview
3.  Interview Timeline
4.  Interview Rounds
5.  Questions Asked
6.  Preparation Tips
7.  Final Advice
8.  Related Experiences
9.  Report Experience

------------------------------------------------------------------------

# 12. Report Experience

Readers can report content for:

-   Incorrect information
-   Spam
-   Offensive content
-   Duplicate

Reports are reviewed manually by the admin.

------------------------------------------------------------------------

# 13. Content Guidelines

Display before submission:

-   Share only your own interview experience.
-   Avoid confidential information.
-   Do not mention interviewer personal details.
-   Keep the experience factual and respectful.

------------------------------------------------------------------------

# 14. Permissions

## Guest

-   Browse
-   Search
-   Read

------------------------------------------------------------------------

## Logged-in User

-   Submit
-   Save draft
-   Edit draft
-   Track status

------------------------------------------------------------------------

## Admin

-   Review submissions
-   Approve
-   Request changes
-   Reject
-   Delete
-   Review reports

------------------------------------------------------------------------

# 15. V1 Success Criteria

A successful V1 should allow contributors to submit structured interview
experiences, allow administrators to review every submission before
publication, and provide readers with a clean, searchable collection of
high-quality interview experiences. The architecture intentionally
prioritizes simplicity, quality control, and maintainability over
automation so that future enhancements can be added without redesigning
the workflow.
