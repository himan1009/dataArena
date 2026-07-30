# Data Arena - Practice Module (V1)
## Dynamic Practice Management & Editorial Workflow

> **Version:** V1  
> **Module:** Practice  
> **Scope:** Dynamic Practice Categories, Topics, Questions, Editorial Workflow

---

# 1. Objective

The Practice module provides a structured way for users to practice questions topic-wise across multiple domains.

Unlike a fixed implementation, the module is completely dynamic. Administrators can create new practice categories (such as SQL, DSA, Python, PySpark, etc.) without requiring any code changes.

Editors can contribute questions based on permissions granted by the Admin, while all published content remains under Admin control through an approval workflow.

---

# 2. Module Hierarchy

```
Practice

└── Category
      │
      ├── SQL
      ├── DSA
      ├── Python
      ├── PySpark
      ├── DBMS
      └── ...

            │
            ▼

         Topics

            │
            ▼

     Subtopics (Optional)

            │
            ▼

         Questions
```

The hierarchy is completely configurable by the Admin.

Nothing is hardcoded.

---

# 3. Example Structure

```
Practice

├── SQL
│     ├── Joins
│     │      ├── Inner Join
│     │      ├── Left Join
│     │      └── Right Join
│     │
│     ├── Window Functions
│     ├── CTE
│     └── Aggregation
│
└── DSA
      ├── Arrays
      ├── Linked List
      ├── Trees
      │      ├── Binary Tree
      │      ├── BST
      │      └── AVL Tree
      │
      ├── Graph
      └── Heap
```

Every topic or subtopic contains multiple questions.

---

# 4. User Roles

Only two roles are involved in Practice Management.

## Editor

Can add questions only if Admin has granted Question Upload permission.

Cannot approve.

Cannot publish.

Cannot edit published questions unless permitted.

Cannot create Categories or Topics.

---

## Admin

Has complete control.

Can

- Create Categories
- Edit Categories
- Delete Categories

- Create Topics
- Edit Topics
- Delete Topics

- Create Subtopics
- Edit Subtopics
- Delete Subtopics

- Add Questions

- Edit Questions

- Delete Questions

- Approve Questions

- Reject Questions

- Publish Questions

- Grant Question Upload Permission

- Remove Question Upload Permission

---

# 5. Integration With Existing Editorial System

The existing Editor role will be reused.

No separate Practice Editor role will exist.

Admin controls permissions independently.

Example

Editor A

```
Can Write Notes

Yes

Can Upload Questions

No
```

---

Editor B

```
Can Write Notes

Yes

Can Upload Questions

Yes
```

---

Editor C

```
Can Write Notes

No

Can Upload Questions

Yes
```

Writing permissions and Question Upload permissions are completely independent.

---

# 6. Practice Administration

Admin Dashboard

```
Practice

├── Categories
├── Topics
├── Questions
└── Pending Reviews
```

---

# 7. Category Management

Only Admin can create Practice Categories.

Examples

- SQL
- DSA
- Python
- PySpark
- Kafka
- Spark
- Snowflake
- DBMS

Adding a new category should never require development work.

---

## Category Form

Fields

```
Category Name *

Slug *

Description

Icon

Display Order

Status

Active / Inactive
```

---

# 8. Topic Management

Topics belong to a Category.

Example

```
SQL

↓

Topics

Joins

Window Functions

CTE

Aggregation

Views

Indexes
```

Another example

```
DSA

↓

Topics

Arrays

Trees

Graphs

Heap

Trie
```

---

## Topic Form

Fields

```
Category *

Topic Name *

Slug *

Description

Display Order

Status
```

---

# 9. Subtopic Management

Subtopics are optional.

Some Topics require them.

Some do not.

Example

```
Trees

↓

Binary Tree

BST

AVL Tree

Segment Tree
```

Example

```
Joins

↓

Inner Join

Left Join

Right Join

Self Join
```

If a Topic does not require subtopics, questions can be directly attached to the Topic.

---

## Subtopic Form

```
Category *

Topic *

Subtopic Name *

Slug *

Display Order

Status
```

---

# 10. Practice Question Workflow

Editor

↓

Create Question

↓

Draft

↓

Submit For Review

↓

Admin Review

↓

Approve

↓

Automatically Published

---

or

↓

Reject

---

# 11. Question Status

```
Draft

↓

Pending Review

↓

Published
```

or

```
Draft

↓

Pending Review

↓

Rejected
```

Approval automatically publishes the question.

No additional Publish button is required.

---

# 12. Add Question Screen

Editors with Question Upload permission can access the Add Question page.

---

## Fields

### Question Title *

Example

```
Department Highest Salary
```

---

### Platform *

Initially

```
LeetCode
```

The platform list can be expanded later.

---

### Question Link *

Direct URL to the original problem.

---

### Difficulty *

```
Easy

Medium

Hard
```

---

### Category *

Dropdown

Examples

```
SQL

DSA

Python

PySpark
```

---

### Topic *

Dropdown

Values depend on the selected Category.

Example

```
Joins

Window Functions

CTE
```

---

### Subtopic *(Optional)*

Dropdown

Values depend on the selected Topic.

Example

```
Left Join

Self Join
```

---

### Company Tags *(Optional)*

Editor enters

```
Amazon, Flipkart, Google, Microsoft
```

Backend automatically converts them into individual tags.

Frontend displays them separately.

---

### Estimated Time *(Optional)*

Example

```
20 Minutes
```

---

### Description *(Optional)*

Short note regarding the question.

---

### Action

```
Submit For Review
```

---

# 13. Automatic Fields

Editors never enter these values.

They are generated automatically.

---

## Added By

Automatically stores the logged-in Editor's name.

Example

```
Rahul Kumar
```

---

## Approved By

Automatically stores the approving Admin's name.

Only populated after approval.

---

## Created Date

Automatically generated.

---

## Updated Date

Automatically generated.

---

## Published Date

Automatically generated after approval.

---

# 14. Admin Review Screen

Admin sees every pending question.

Example

```
Department Highest Salary

Category

SQL

Topic

Joins

Difficulty

Medium

Platform

LeetCode

Added By

Rahul Kumar

Status

Pending Review
```

Available Actions

```
Approve

Reject

Edit
```

---

# 15. Publishing Logic

When Admin clicks

```
Approve
```

System automatically

- Changes Status to Published
- Stores Published Date
- Stores Approved By
- Makes the Question visible to users

No additional publish process exists.

---

# 16. Public Question Card

Users should only see useful information.

Example

```
Department Highest Salary

Medium

Platform

LeetCode

Category

SQL

Topic

Joins

Subtopic

Left Join

Company Tags

Amazon

Google

Adobe

Estimated Time

20 Minutes

Added By

Rahul Kumar

Solve →
```

Users never see

- Draft Status
- Reviewer Comments
- Internal Workflow
- Approval Details

---

# 17. Admin Editing

Admin can edit any question at any time.

Editable fields

- Title
- Platform
- Link
- Difficulty
- Category
- Topic
- Subtopic
- Company Tags
- Estimated Time
- Description

The original contributor (**Added By**) should always remain unchanged, even if the Admin edits the question later.

---

# 18. Permissions Summary

| Feature | Admin | Editor (Permission Enabled) | Editor (Permission Disabled) |
|----------|:----:|:---------------------------:|:----------------------------:|
| Create Category | ✅ | ❌ | ❌ |
| Edit Category | ✅ | ❌ | ❌ |
| Delete Category | ✅ | ❌ | ❌ |
| Create Topic | ✅ | ❌ | ❌ |
| Edit Topic | ✅ | ❌ | ❌ |
| Delete Topic | ✅ | ❌ | ❌ |
| Create Subtopic | ✅ | ❌ | ❌ |
| Edit Subtopic | ✅ | ❌ | ❌ |
| Delete Subtopic | ✅ | ❌ | ❌ |
| Add Question | ✅ | ✅ | ❌ |
| Edit Own Draft | ✅ | ✅ | ❌ |
| Submit Question | ✅ | ✅ | ❌ |
| Approve Question | ✅ | ❌ | ❌ |
| Reject Question | ✅ | ❌ | ❌ |
| Edit Published Question | ✅ | ❌ | ❌ |
| Delete Question | ✅ | ❌ | ❌ |

---

# 19. Initial Scope (V1)

Included

- Dynamic Practice Categories
- Dynamic Topics
- Optional Subtopics
- SQL Practice
- DSA Practice
- Editor Question Submission
- Admin Approval Workflow
- Automatic Publishing
- Company Tags
- Difficulty Levels
- Topic-wise Organization
- Added By
- Approved By
- LeetCode Link Redirection
- Independent Question Upload Permission

---

# 20. Future Enhancements (Out of Scope for V1)

- Multiple Coding Platforms
- Company-wise Filters
- Difficulty Filters
- Search
- Bookmark Questions
- User Progress Tracking
- Editorial Solutions
- Hints
- Video Explanations
- AI Recommended Questions
- Question Analytics
- Company Frequency Analytics
- Trending Questions
- Recently Added Questions
- Related Questions
- User Discussions
- Upvotes & Reports