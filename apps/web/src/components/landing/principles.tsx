"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Brain,
  Code2,
  MessageSquare,
  RefreshCw,
  Rocket,
  Wrench,
} from "lucide-react";

import { PageContainer, Section } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import type { AuthUser } from "@/lib/api";
import { getAuthGatedHref } from "@/lib/auth-links";
import { cn } from "@/lib/utils";

const principles = [
  {
    icon: BookOpen,
    label: "Learn",
    detail: "Theory and reference material",
    color: "text-gold",
    href: "/notes",
  },
  { icon: Code2, label: "Practice", detail: "Curated questions by category and topic", color: "text-teal", href: "/practice" },
  { icon: Wrench, label: "Build", detail: "Production patterns and pipelines", color: "text-primary" },
  { icon: RefreshCw, label: "Revise", detail: "Review and retain what matters", color: "text-violet" },
  {
    icon: MessageSquare,
    label: "Interview",
    detail: "Community interview experiences",
    color: "text-gold",
    href: "/interviews",
  },
  { icon: Rocket, label: "Create", detail: "Write and publish your work", color: "text-teal" },
  { icon: Brain, label: "Grow", detail: "Keep improving over time", color: "text-primary" },
] as const;

export function Principles({ user }: { user: AuthUser | null }) {
  return (
    <Section id="principles">
      <PageContainer size="wide">
        <SectionHeader
          align="center"
          label="Method"
          title="Seven stages. One clear path."
          description="From fundamentals to production readiness — each stage builds on the last."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {principles.map((item, index) => {
            const href = "href" in item && item.href ? getAuthGatedHref(user, item.href) : null;

            const card = (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                className={cn(
                  "glass-panel flex items-start gap-3.5 p-5",
                  href && "glass-panel-hover group cursor-pointer",
                )}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02]">
                  <item.icon className={cn("size-4", item.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{item.label}</p>
                    {href && (
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </motion.div>
            );

            if (!href) {
              return <div key={item.label}>{card}</div>;
            }

            return (
              <Link key={item.label} href={href} className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </PageContainer>
    </Section>
  );
}
