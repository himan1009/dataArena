import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  Bot,
  Code2,
  LayoutDashboard,
  Search,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

import { AppPage } from "@/components/ui/app-page";
import { Badge } from "@/components/ui/badge";
import { IconBox } from "@/components/ui/icon-box";
import { PageIntro } from "@/components/ui/page-intro";
import { requireUser } from "@/lib/auth-server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Dashboard",
};

const stats = [
  { label: "Topics started", value: "0", icon: BookOpen, tint: "gold" as const, valueClass: "stat-gold" },
  { label: "Problems solved", value: "0", icon: Code2, tint: "teal" as const, valueClass: "stat-teal" },
  { label: "Bookmarks", value: "0", icon: Bookmark, tint: "primary" as const, valueClass: "stat-primary" },
  { label: "Day streak", value: "0", icon: TrendingUp, tint: "violet" as const, valueClass: "stat-violet" },
];

const quickActions = [
  {
    title: "Notes",
    description: "Browse categories, topics, and published articles.",
    href: "/notes",
    icon: BookOpen,
    ready: true,
  },
  {
    title: "Practice",
    description: "SQL, Python, and PySpark labs.",
    href: "/practice",
    icon: Code2,
    ready: false,
  },
  {
    title: "Search",
    description: "Find topics and interview questions.",
    href: "/search",
    icon: Search,
    ready: false,
  },
  {
    title: "AI Copilot",
    description: "Get help on any page you're reading.",
    href: "/copilot",
    icon: Bot,
    ready: false,
  },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0];
  const greeting = firstName ? `Welcome back, ${firstName}` : "Welcome back";

  return (
    <AppPage>
      <PageIntro
        icon={LayoutDashboard}
        label="Dashboard"
        title={greeting}
        description="Pick up where you left off, or explore something new."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-panel p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <IconBox icon={stat.icon} size="sm" tint={stat.tint} />
            </div>
            <p className={cn("stat-value mt-4", stat.valueClass)}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5">
          <p className="section-label mb-2">Quick access</p>
          <h3 className="text-lg font-semibold">Where to go next</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="glass-panel glass-panel-hover group p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <IconBox icon={action.icon} size="md" />
                <div className="flex items-center gap-2">
                  {!action.ready && (
                    <Badge className="border-0 bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Soon
                    </Badge>
                  )}
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </div>
              <h4 className="mt-5 font-medium">{action.title}</h4>
              <p className="mt-1.5 text-sm text-muted-foreground">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="glass-panel p-6 sm:p-7">
        <p className="section-label mb-2">Roadmap</p>
        <h3 className="text-lg font-semibold">What&apos;s coming</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Features we&apos;re building next.
        </p>
        <div className="mt-6 space-y-3">
          {[
            { phase: "Now", text: "Notes, author workflow, admin tools" },
            { phase: "Next", text: "Search, bookmarks, SQL practice" },
            { phase: "Later", text: "AI copilot, interview bank, community" },
          ].map((item) => (
            <div key={item.phase} className="flex items-center gap-4">
              <Badge
                className={cn(
                  "min-w-[3.5rem] justify-center border-0 text-[11px] font-medium",
                  item.phase === "Now"
                    ? "badge-now"
                    : "bg-white/[0.05] text-muted-foreground",
                )}
              >
                {item.phase}
              </Badge>
              <span className="text-sm text-foreground/85">{item.text}</span>
            </div>
          ))}
        </div>
      </section>
    </AppPage>
  );
}
