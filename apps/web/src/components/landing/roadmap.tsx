"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { PageContainer, Section } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const phases = [
  {
    phase: "Now",
    title: "Core platform",
    summary: "Auth, content, and author workflow",
    items: ["User roles & auth", "Notes & topics CMS", "Author write & review", "Admin panel"],
    active: true,
  },
  {
    phase: "Next",
    title: "Engagement",
    summary: "Search, practice, and retention",
    items: ["Global search", "SQL practice sandbox", "Bookmarks & progress", "AI copilot v1"],
    active: false,
  },
  {
    phase: "Later",
    title: "Scale",
    summary: "Community and advanced tools",
    items: ["Interview question bank", "Community features", "Premium tier", "Mobile app"],
    active: false,
  },
];

export function Roadmap() {
  return (
    <Section id="roadmap" className="border-t border-border">
      <PageContainer size="wide">
        <SectionHeader
          align="center"
          label="Roadmap"
          title="Shipping in focused phases"
          description="We release working features — not slide decks. Each phase makes the platform more useful."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className={cn(
                "glass-panel flex flex-col p-6",
                phase.active && "border-gold/25",
              )}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <Badge
                  className={cn(
                    "border-0 text-[11px] font-medium",
                    phase.active
                      ? "badge-now"
                      : "bg-white/[0.05] text-muted-foreground",
                  )}
                >
                  {phase.phase}
                </Badge>
                <span className="text-sm font-medium">{phase.title}</span>
              </div>

              <p className="text-sm text-muted-foreground">{phase.summary}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-foreground/85"
                  >
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        phase.active ? "bg-gold" : "bg-white/20",
                      )}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
