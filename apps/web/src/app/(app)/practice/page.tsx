import { Code2 } from "lucide-react";

import { ComingSoonPage } from "@/components/app/coming-soon-page";

export const metadata = {
  title: "Practice",
};

export default function PracticePage() {
  return (
    <ComingSoonPage
      icon={Code2}
      title="Practice"
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
