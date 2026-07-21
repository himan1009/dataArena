import { cookies } from "next/headers";

import { getBackendUrl } from "@/lib/proxy";

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  topicCount: number;
};

export type TopicSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
};

export type ArticleSummary = {
  id: string;
  title: string;
  slug: string;
  sortOrder?: number;
  updatedAt?: string;
};

export type CategoryDetail = CategorySummary & {
  topics: TopicSummary[];
};

export type TopicDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  articles: ArticleSummary[];
};

export type ArticleDetail = {
  id: string;
  title: string;
  slug: string;
  content: string;
  updatedAt: string;
  publishedAt?: string | null;
  adminEditedAt?: string | null;
  editorEditedAt?: string | null;
  lastEditedByRole?: string | null;
  lastEditorNameSnapshot?: string | null;
  lastEditor?: {
    id: string;
    name: string | null;
    email: string;
    linkedinUrl: string | null;
  } | null;
  author?: {
    id: string;
    name: string | null;
    email: string;
    linkedinUrl: string | null;
  } | null;
  topic: {
    id: string;
    name: string;
    slug: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    articles: ArticleSummary[];
  };
};

class NotesApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "NotesApiError";
  }
}

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

async function fetchNotesApi<T>(path: string): Promise<T> {
  const cookieHeader = await getCookieHeader();

  try {
    const response = await fetch(getBackendUrl(`/notes${path}`), {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof data.message === "string"
          ? data.message
          : "Failed to load notes content";
      throw new NotesApiError(message, response.status);
    }

    return data as T;
  } catch (error) {
    if (error instanceof NotesApiError) {
      throw error;
    }

    throw new NotesApiError(
      "Cannot reach the API server. Make sure it is running on port 4000.",
      503,
    );
  }
}

export async function getCategories() {
  const data = await fetchNotesApi<{ categories: CategorySummary[] }>(
    "/categories",
  );
  return data.categories;
}

export async function getCategory(slug: string) {
  const data = await fetchNotesApi<{ category: CategoryDetail }>(
    `/categories/${slug}`,
  );
  return data.category;
}

export async function getTopic(categorySlug: string, topicSlug: string) {
  const data = await fetchNotesApi<{ topic: TopicDetail }>(
    `/categories/${categorySlug}/topics/${topicSlug}`,
  );
  return data.topic;
}

export async function getArticle(
  categorySlug: string,
  topicSlug: string,
  articleSlug: string,
) {
  const data = await fetchNotesApi<{ article: ArticleDetail }>(
    `/categories/${categorySlug}/topics/${topicSlug}/articles/${articleSlug}`,
  );
  return data.article;
}

export async function getAdminCategories() {
  const data = await fetchNotesApi<{
    categories: Array<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
      published: boolean;
      sortOrder: number;
      topics: Array<{
        id: string;
        name: string;
        slug: string;
        published: boolean;
        openForAuthors: boolean;
      }>;
      _count: { topics: number };
    }>;
  }>("/admin/categories");

  return data.categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    published: category.published,
    sortOrder: category.sortOrder,
    topicCount: category._count.topics,
    topics: category.topics,
  }));
}

export { NotesApiError };
