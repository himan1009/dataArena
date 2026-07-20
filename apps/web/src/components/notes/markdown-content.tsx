import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-5 text-3xl font-semibold tracking-tight text-foreground">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight text-foreground">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-3 mt-10 text-xl font-semibold tracking-tight text-foreground">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-5 text-[15px] leading-8 text-muted-foreground">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-muted-foreground">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-7">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-5 border-l-2 border-accent/40 pl-5 text-[15px] leading-8 text-muted-foreground">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="font-medium text-primary underline-offset-4 hover:underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  code: ({
    className,
    children,
  }: {
    className?: string;
    children?: React.ReactNode;
  }) => {
    const isBlock = className?.includes("language-");

    if (isBlock) {
      return <code className={className}>{children}</code>;
    }

    return (
      <code className="rounded-md border border-white/[0.08] bg-white/[0.05] px-1.5 py-0.5 font-mono text-sm text-primary">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="mb-5 overflow-x-auto rounded-2xl border border-white/[0.08] bg-black/35 p-5 font-mono text-sm leading-7 text-foreground">
      {children}
    </pre>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-left font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border border-white/[0.08] px-3 py-2 text-muted-foreground">{children}</td>
  ),
};

export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl glass-panel p-8 sm:p-10", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function ArticleNav({
  categorySlug,
  topicSlug,
  articles,
  currentSlug,
}: {
  categorySlug: string;
  topicSlug: string;
  articles: Array<{ slug: string; title: string }>;
  currentSlug: string;
}) {
  const currentIndex = articles.findIndex((article) => article.slug === currentSlug);
  const previous = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : null;

  if (!previous && !next) {
    return null;
  }

  return (
    <div className="mt-10 grid gap-4 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/notes/${categorySlug}/${topicSlug}/${previous.slug}`}
          className="glass-panel glass-panel-hover p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Previous
          </p>
          <p className="mt-1 font-medium">{previous.title}</p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/notes/${categorySlug}/${topicSlug}/${next.slug}`}
          className="glass-panel glass-panel-hover p-4 text-right sm:col-start-2"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Next
          </p>
          <p className="mt-1 font-medium">{next.title}</p>
        </Link>
      ) : null}
    </div>
  );
}
