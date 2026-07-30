"use client";

import { useState, type KeyboardEvent } from "react";
import { Building2, Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SUGGESTED_COMPANIES = [
  "Amazon",
  "Google",
  "Microsoft",
  "Meta",
  "Apple",
  "Netflix",
  "Uber",
  "Airbnb",
  "LinkedIn",
  "Salesforce",
  "Adobe",
  "Flipkart",
  "Swiggy",
  "Goldman Sachs",
  "JPMorgan",
];

export function CompanyTagInput({
  tags,
  onChange,
  maxTags = 12,
  className,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  className?: string;
}) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      setInput("");
      return;
    }
    if (tags.length >= maxTags) return;
    onChange([...tags, value]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag));
  };

  const toggleSuggestion = (company: string) => {
    if (tags.some((tag) => tag.toLowerCase() === company.toLowerCase())) {
      removeTag(tags.find((tag) => tag.toLowerCase() === company.toLowerCase())!);
      return;
    }
    addTag(company);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(input);
    }
    if (event.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const availableSuggestions = SUGGESTED_COMPANIES.filter(
    (company) => !tags.some((tag) => tag.toLowerCase() === company.toLowerCase()),
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 transition-colors focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10",
          tags.length >= maxTags && "opacity-90",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-foreground"
            >
              <Building2 className="size-3.5 text-primary" />
              {tag}
              <button
                type="button"
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
          {tags.length < maxTags && (
            <div className="flex min-w-[12rem] flex-1 items-center gap-2">
              <Plus className="size-4 shrink-0 text-muted-foreground" />
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addTag(input)}
                placeholder={tags.length === 0 ? "Type company name and press Enter" : "Add another"}
                className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>
          )}
        </div>
      </div>

      {availableSuggestions.length > 0 && tags.length < maxTags && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Quick add
          </p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map((company) => (
              <button
                key={company}
                type="button"
                onClick={() => toggleSuggestion(company)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground"
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Optional. Tap a suggestion or type a company name and press Enter. Up to {maxTags} companies.
      </p>
    </div>
  );
}

export function CompanyTagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          className="gap-1.5 border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
        >
          <Building2 className="size-3 text-primary/80" />
          {tag}
        </Badge>
      ))}
    </div>
  );
}
