"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  Code2,
} from "lucide-react";

import { PageContainer } from "@/components/ui/page-container";
import { buttonVariants } from "@/components/ui/button";
import type { AuthUser } from "@/lib/api";
import { cn } from "@/lib/utils";

const stats = [
  { value: "4+", label: "Topic categories", valueClass: "stat-gold" },
  { value: "10+", label: "Open write topics", valueClass: "stat-teal" },
  { value: "1", label: "Platform", valueClass: "stat-primary" },
];

const highlights = [
  "Structured notes with code and diagrams",
  "SQL, Python, and PySpark practice labs",
  "Interview questions and author publishing",
  "AI assistant built into your workflow",
];

export function Hero({ user }: { user: AuthUser | null }) {
  return (
    <section className="relative pt-12 pb-10 sm:pt-20 sm:pb-14">
      <PageContainer size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            <p className="section-label mb-5">Data engineering platform</p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Learn data engineering.{" "}
              <span className="gradient-text">One workspace.</span>
            </h1>

            <p className="prose-muted mx-auto mt-5 max-w-xl lg:mx-0">
              Notes, practice labs, interview prep, and AI — organized for
              engineers who want to move fast without losing depth.
            </p>

            <ul className="mx-auto mt-7 max-w-xl space-y-2.5 text-left lg:mx-0">
              {highlights.map((item, i) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      i % 2 === 0 ? "text-gold" : "text-teal",
                    )}
                  />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              {user ? (
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ size: "lg" }), "min-w-[180px] gap-2")}
                >
                  Go to dashboard
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className={cn(buttonVariants({ size: "lg" }), "min-w-[180px] gap-2")}
                  >
                    Create free account
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" }),
                      "min-w-[140px] border-white/[0.1] bg-transparent",
                    )}
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-5 border-t border-border pt-8 lg:mx-0 mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className={cn("stat-value", stat.valueClass)}>{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="glass-panel p-6 sm:p-7">
              <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Workspace</p>
                  <p className="mt-0.5 font-medium">DataArena</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-gold/60" />
                  <span className="size-2 rounded-full bg-teal/60" />
                  <span className="size-2 rounded-full bg-primary" />
                </div>
              </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: BookOpen, label: "Notes", value: "Categories & articles", tint: "gold" as const },
                    { icon: Code2, label: "Practice", value: "SQL · Python · Spark", tint: "teal" as const },
                    { icon: Bot, label: "AI Copilot", value: "Explain & debug", tint: "primary" as const },
                    { icon: BookOpen, label: "Write", value: "Publish & get credit", tint: "violet" as const },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <item.icon
                        className={cn(
                          "size-4",
                          item.tint === "gold" && "text-gold",
                          item.tint === "teal" && "text-teal",
                          item.tint === "primary" && "text-primary",
                          item.tint === "violet" && "text-violet",
                        )}
                      />
                    <p className="mt-2.5 text-sm font-medium">{item.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 rounded-lg border border-gold/15 bg-gradient-to-r from-gold-muted via-primary/[0.06] to-teal-muted px-4 py-3 text-sm text-muted-foreground">
                Stop switching between docs, LeetCode, and ChatGPT. Do the work here.
              </p>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
}
