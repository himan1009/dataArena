import { Code2 } from "lucide-react";

import { ComingSoon } from "@/components/app/coming-soon";

export const metadata = {
  title: "Practice",
};

export default function PracticePage() {
  return (
    <ComingSoon
      icon={Code2}
      title="Practice Engine"
      description="Hands-on SQL, Python, and PySpark exercises built for real data engineering workflows."
      features={[
        "SQL lab with sample datasets",
        "Python for Data Engineers challenges",
        "PySpark practice environment",
        "AI-assisted debugging for failed submissions",
      ]}
    />
  );
}
