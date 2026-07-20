import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const categories = [
  {
    name: "SQL & Databases",
    slug: "sql-databases",
    description: "Queries, indexing, optimization, warehouse design",
    icon: "Database",
    sortOrder: 1,
    topics: [
      {
        name: "Introduction to SQL",
        slug: "introduction-to-sql",
        description: "Core SQL concepts every data engineer needs",
        articles: [
          {
            title: "SELECT fundamentals",
            slug: "select-fundamentals",
            content: `# SELECT Fundamentals

SQL starts with reading data. The \`SELECT\` statement is how you query tables in a relational database.

## Basic syntax

\`\`\`sql
SELECT column1, column2
FROM table_name
WHERE condition;
\`\`\`

## Key ideas

- **Projection** — choose which columns to return
- **Filtering** — use \`WHERE\` to narrow rows
- **Ordering** — use \`ORDER BY\` for sorted results

## Example

\`\`\`sql
SELECT customer_id, total_amount
FROM orders
WHERE total_amount > 100
ORDER BY total_amount DESC
LIMIT 10;
\`\`\`

> Tip: Always inspect row counts and null behavior when writing production queries.
`,
          },
          {
            title: "JOINs explained",
            slug: "joins-explained",
            content: `# JOINs Explained

JOINs combine rows from multiple tables based on related keys.

## Common join types

| Join | Purpose |
|------|---------|
| INNER JOIN | Only matching rows |
| LEFT JOIN | All left rows + matches |
| RIGHT JOIN | All right rows + matches |
| FULL OUTER JOIN | All rows from both sides |

## Example

\`\`\`sql
SELECT u.name, o.order_id
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
\`\`\`

Use LEFT JOIN when you need to keep rows even if there is no match on the other side.
`,
          },
        ],
      },
      {
        name: "Indexing Basics",
        slug: "indexing-basics",
        description: "How indexes speed up queries and when they hurt",
        articles: [
          {
            title: "B-tree indexes",
            slug: "b-tree-indexes",
            content: `# B-tree Indexes

Most relational databases use **B-tree indexes** by default.

## When indexes help

- Equality filters: \`WHERE user_id = 42\`
- Range scans: \`WHERE created_at >= '2026-01-01'\`
- Ordered reads with matching sort keys

## Trade-offs

- Faster reads
- Slower writes (index maintenance)
- Extra storage

\`\`\`sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
\`\`\`
`,
          },
        ],
      },
    ],
  },
  {
    name: "Python for DE",
    slug: "python-for-de",
    description: "Pandas, scripting, ETL patterns, pipelines",
    icon: "Workflow",
    sortOrder: 2,
    topics: [
      {
        name: "Pandas Essentials",
        slug: "pandas-essentials",
        description: "DataFrames, transforms, and cleaning patterns",
        articles: [
          {
            title: "Working with DataFrames",
            slug: "working-with-dataframes",
            content: `# Working with DataFrames

Pandas is the workhorse library for tabular data in Python.

\`\`\`python
import pandas as pd

df = pd.read_csv("events.csv")
summary = (
    df.groupby("country")["revenue"]
      .sum()
      .sort_values(ascending=False)
)
\`\`\`

## Common operations

- \`df.head()\` — preview rows
- \`df.info()\` — schema and nulls
- \`df.fillna()\` — handle missing values
`,
          },
        ],
      },
    ],
  },
  {
    name: "Big Data & Spark",
    slug: "big-data-spark",
    description: "PySpark, distributed computing, lakehouse",
    icon: "Server",
    sortOrder: 3,
    topics: [
      {
        name: "PySpark Fundamentals",
        slug: "pyspark-fundamentals",
        description: "RDDs, DataFrames, and distributed transforms",
        articles: [
          {
            title: "Your first Spark job",
            slug: "your-first-spark-job",
            content: `# Your First Spark Job

PySpark lets you process large datasets across a cluster.

\`\`\`python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("dataarena-demo").getOrCreate()
df = spark.read.parquet("s3://bucket/events/")
df.groupBy("event_type").count().show()
\`\`\`

## Core concepts

- **Lazy evaluation** — transformations build a plan
- **Partitions** — data split for parallelism
- **Actions** — trigger execution (\`count\`, \`show\`, \`write\`)
`,
          },
        ],
      },
    ],
  },
  {
    name: "Cloud & Orchestration",
    slug: "cloud-orchestration",
    description: "AWS, Airflow, dbt, production architecture",
    icon: "Cloud",
    sortOrder: 4,
    topics: [
      {
        name: "Airflow Introduction",
        slug: "airflow-introduction",
        description: "DAGs, operators, and scheduling pipelines",
        articles: [
          {
            title: "What is a DAG?",
            slug: "what-is-a-dag",
            content: `# What is a DAG?

In Apache Airflow, a **DAG** (Directed Acyclic Graph) defines a workflow.

\`\`\`python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

with DAG("daily_etl", start_date=datetime(2026, 1, 1), schedule="@daily"):
    extract = PythonOperator(task_id="extract", python_callable=extract_fn)
    transform = PythonOperator(task_id="transform", python_callable=transform_fn)
    load = PythonOperator(task_id="load", python_callable=load_fn)

    extract >> transform >> load
\`\`\`

DAGs should be **idempotent** and **observable** in production.
`,
          },
        ],
      },
    ],
  },
];

async function main() {
  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        sortOrder: category.sortOrder,
        published: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        sortOrder: category.sortOrder,
        published: true,
      },
    });

    for (const [topicIndex, topic] of category.topics.entries()) {
      const createdTopic = await prisma.topic.upsert({
        where: {
          categoryId_slug: {
            categoryId: createdCategory.id,
            slug: topic.slug,
          },
        },
        update: {
          name: topic.name,
          description: topic.description,
          sortOrder: topicIndex + 1,
          published: true,
        },
        create: {
          categoryId: createdCategory.id,
          name: topic.name,
          slug: topic.slug,
          description: topic.description,
          sortOrder: topicIndex + 1,
          published: true,
        },
      });

      for (const [articleIndex, article] of topic.articles.entries()) {
        await prisma.article.upsert({
          where: {
            topicId_slug: {
              topicId: createdTopic.id,
              slug: article.slug,
            },
          },
          update: {
            title: article.title,
            content: article.content,
            sortOrder: articleIndex + 1,
            published: true,
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
          create: {
            topicId: createdTopic.id,
            title: article.title,
            slug: article.slug,
            content: article.content,
            sortOrder: articleIndex + 1,
            published: true,
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        });
      }
    }
  }

  const passwordHash = await bcrypt.hash("password123", 12);
  const editors = [
    {
      email: "priya@dataarena.dev",
      name: "Priya Sharma",
      linkedinUrl: "https://www.linkedin.com/in/priya-sharma",
    },
    {
      email: "rahul@dataarena.dev",
      name: "Rahul Mehta",
      linkedinUrl: "https://www.linkedin.com/in/rahul-mehta",
    },
    {
      email: "ananya@dataarena.dev",
      name: "Ananya Patel",
      linkedinUrl: "https://www.linkedin.com/in/ananya-patel",
    },
  ];

  for (const editor of editors) {
    await prisma.user.upsert({
      where: { email: editor.email },
      update: {
        name: editor.name,
        role: "EDITOR",
        linkedinUrl: editor.linkedinUrl,
      },
      create: {
        email: editor.email,
        name: editor.name,
        passwordHash,
        role: "EDITOR",
        linkedinUrl: editor.linkedinUrl,
      },
    });
  }

  const openTopics = [
    {
      categorySlug: "sql-databases",
      name: "Window Functions Deep Dive",
      slug: "window-functions-deep-dive",
      description: "ROW_NUMBER, RANK, LAG, LEAD and analytic patterns",
    },
    {
      categorySlug: "sql-databases",
      name: "Query Optimization Patterns",
      slug: "query-optimization-patterns",
      description: "Execution plans, statistics, and tuning strategies",
    },
    {
      categorySlug: "python-for-de",
      name: "ETL Scripting Patterns",
      slug: "etl-scripting-patterns",
      description: "Reusable Python patterns for ingestion pipelines",
    },
    {
      categorySlug: "python-for-de",
      name: "Data Quality Checks",
      slug: "data-quality-checks",
      description: "Validation frameworks and anomaly detection basics",
    },
    {
      categorySlug: "big-data-spark",
      name: "Partitioning Strategies",
      slug: "partitioning-strategies",
      description: "Shuffle reduction and partition tuning in Spark",
    },
    {
      categorySlug: "big-data-spark",
      name: "Spark Join Optimization",
      slug: "spark-join-optimization",
      description: "Broadcast joins, salting, and skew handling",
    },
    {
      categorySlug: "cloud-orchestration",
      name: "dbt Fundamentals",
      slug: "dbt-fundamentals",
      description: "Models, tests, and documentation in dbt",
    },
    {
      categorySlug: "cloud-orchestration",
      name: "AWS S3 Data Lake Basics",
      slug: "aws-s3-data-lake-basics",
      description: "Bucket layout, partitioning, and ingestion patterns",
    },
    {
      categorySlug: "sql-databases",
      name: "Data Warehouse Modeling",
      slug: "data-warehouse-modeling",
      description: "Star schema, snowflake, and fact/dimension design",
    },
    {
      categorySlug: "python-for-de",
      name: "API Ingestion with Python",
      slug: "api-ingestion-with-python",
      description: "Pulling data from REST APIs into your pipeline",
    },
  ];

  for (const [index, topic] of openTopics.entries()) {
    const category = await prisma.category.findUnique({
      where: { slug: topic.categorySlug },
    });

    if (!category) continue;

    await prisma.topic.upsert({
      where: {
        categoryId_slug: {
          categoryId: category.id,
          slug: topic.slug,
        },
      },
      update: {
        name: topic.name,
        description: topic.description,
        openForAuthors: true,
        status: "OPEN",
        published: true,
        sortOrder: index + 20,
      },
      create: {
        categoryId: category.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        openForAuthors: true,
        status: "OPEN",
        published: true,
        sortOrder: index + 20,
      },
    });
  }

  const priya = await prisma.user.findUnique({ where: { email: "priya@dataarena.dev" } });
  const etlTopic = await prisma.topic.findFirst({
    where: { slug: "etl-scripting-patterns" },
  });

  if (priya && etlTopic) {
    await prisma.article.upsert({
      where: {
        topicId_slug: {
          topicId: etlTopic.id,
          slug: "python-etl-starter-guide",
        },
      },
      update: {
        title: "Python ETL Starter Guide",
        content: `# Python ETL Starter Guide

This is a **dummy submission** waiting for admin review.

## Pipeline outline

1. Extract from source API
2. Validate schema
3. Transform records
4. Load into warehouse

\`\`\`python
def run_pipeline():
    raw = extract()
    clean = transform(raw)
    load(clean)
\`\`\`

> Submitted by Priya for review demo purposes.
`,
        authorId: priya.id,
        status: "SUBMITTED",
        published: false,
        submittedAt: new Date(),
      },
      create: {
        topicId: etlTopic.id,
        authorId: priya.id,
        title: "Python ETL Starter Guide",
        slug: "python-etl-starter-guide",
        content: `# Python ETL Starter Guide

This is a **dummy submission** waiting for admin review.

## Pipeline outline

1. Extract from source API
2. Validate schema
3. Transform records
4. Load into warehouse

\`\`\`python
def run_pipeline():
    raw = extract()
    clean = transform(raw)
    load(clean)
\`\`\`

> Submitted by Priya for review demo purposes.
`,
        status: "SUBMITTED",
        published: false,
        submittedAt: new Date(),
      },
    });

    await prisma.topic.update({
      where: { id: etlTopic.id },
      data: {
        claimedById: priya.id,
        status: "IN_PROGRESS",
      },
    });
  }

  console.log("Notes seed data applied.");
  console.log("Demo editors: priya@dataarena.dev / rahul@dataarena.dev / ananya@dataarena.dev");
  console.log("Password for all demo editors: password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
