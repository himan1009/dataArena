"use client";

import { motion } from "framer-motion";
import {
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
import { cn } from "@/lib/utils";

const principles = [
  { icon: BookOpen, label: "Learn", detail: "Theory and reference material", color: "text-gold" },
  { icon: Code2, label: "Practice", detail: "Hands-on labs and exercises", color: "text-teal" },
  { icon: Wrench, label: "Build", detail: "Production patterns and pipelines", color: "text-primary" },
  { icon: RefreshCw, label: "Revise", detail: "Review and retain what matters", color: "text-violet" },
  { icon: MessageSquare, label: "Interview", detail: "Questions for real roles", color: "text-gold" },
  { icon: Rocket, label: "Create", detail: "Write and publish your work", color: "text-teal" },
  { icon: Brain, label: "Grow", detail: "Keep improving over time", color: "text-primary" },
];

export function Principles() {
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
          {principles.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="glass-panel flex items-start gap-3.5 p-5"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02]">
                <item.icon className={cn("size-4", item.color)} />
              </div>
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
