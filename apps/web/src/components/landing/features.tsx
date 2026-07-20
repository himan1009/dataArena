"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Bookmark,
  FileText,
  Search,
  Terminal,
  TrendingUp,
} from "lucide-react";

import { IconBox } from "@/components/ui/icon-box";
import { PageContainer, Section } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const tints = ["gold", "teal", "primary", "violet", "gold", "teal"] as const;

const features = [
  {
    icon: FileText,
    title: "Structured Notes",
    description:
      "Learning hubs with markdown, code blocks, and interview-ready explanations — not scattered blog posts.",
    span: "lg:col-span-2",
    status: "Live",
  },
  {
    icon: Terminal,
    title: "Practice Labs",
    description:
      "Run SQL, Python, and PySpark exercises against real-world scenarios.",
    span: "",
    status: "Next",
  },
  {
    icon: Bot,
    title: "AI Copilot",
    description:
      "Ask questions, get explanations, and debug queries without leaving the page.",
    span: "",
    status: "Next",
  },
  {
    icon: Search,
    title: "Global Search",
    description:
      "Find notes, practice problems, and interview questions in one search bar.",
    span: "lg:col-span-2",
    status: "Planned",
  },
  {
    icon: Bookmark,
    title: "Bookmarks & Progress",
    description:
      "Save articles and pick up exactly where you stopped.",
    span: "",
    status: "Planned",
  },
  {
    icon: TrendingUp,
    title: "Interview Prep",
    description:
      "Role-specific questions and author credits that stay on your profile.",
    span: "",
    status: "Live",
  },
];

export function Features() {
  return (
    <Section id="features" className="border-t border-border">
      <PageContainer size="wide">
        <SectionHeader
          align="center"
          label="Capabilities"
          title="Built for the work you actually do"
          description="Every tool in DataArena maps to a real part of a data engineer's day — learning, building, interviewing, and shipping."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className={`glass-panel glass-panel-hover flex flex-col p-6 ${feature.span}`}
            >
              <div className="flex items-start justify-between gap-3">
                <IconBox icon={feature.icon} size="md" tint={tints[index % tints.length]} />
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    feature.status === "Live"
                      ? "badge-live"
                      : "border-border bg-white/[0.02] text-muted-foreground",
                  )}
                >
                  {feature.status}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
