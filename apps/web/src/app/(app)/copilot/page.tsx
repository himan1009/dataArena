import { Bot } from "lucide-react";

import { ComingSoon } from "@/components/app/coming-soon";

export const metadata = {
  title: "AI Copilot",
};

export default function CopilotPage() {
  return (
    <ComingSoon
      icon={Bot}
      title="AI Copilot"
      description="Contextual AI assistant on every page — explain code, generate quizzes, debug queries, and more."
      features={[
        "Explain selected text or code",
        "Generate quizzes from articles",
        "Debug SQL, Python, and PySpark",
        "Multi-provider support (OpenAI, Gemini, Claude)",
      ]}
    />
  );
}
