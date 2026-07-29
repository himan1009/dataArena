"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { roleLevelLabels, type RoleLevel } from "@/lib/interview-experiences-api";

export function InterviewBrowseFilters({
  companies,
  roles,
}: {
  companies: string[];
  roles: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [company, setCompany] = useState(searchParams.get("company") ?? "");
  const [role, setRole] = useState(searchParams.get("role") ?? "");
  const [roleLevel, setRoleLevel] = useState(
    searchParams.get("roleLevel") ?? "",
  );

  const apply = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (company) params.set("company", company);
    if (role) params.set("role", role);
    if (roleLevel) params.set("roleLevel", roleLevel);
    const query = params.toString();
    router.push(query ? `/interviews?${query}` : "/interviews");
  };

  return (
    <div className="glass-panel grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="interview-search">Search</Label>
        <Input
          id="interview-search"
          className="surface-input"
          placeholder="Company, role, keywords..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Company</Label>
        <SelectField
          value={company}
          options={[
            { value: "", label: "All companies" },
            ...companies.map((item) => ({ value: item, label: item })),
          ]}
          onValueChange={setCompany}
          placeholder="All companies"
        />
      </div>
      <div className="space-y-2">
        <Label>Job role</Label>
        <SelectField
          value={role}
          options={[
            { value: "", label: "All job roles" },
            ...roles.map((item) => ({ value: item, label: item })),
          ]}
          onValueChange={setRole}
          placeholder="All job roles"
        />
      </div>
      <div className="space-y-2">
        <Label>Role level</Label>
        <SelectField
          value={roleLevel}
          options={[
            { value: "", label: "All role levels" },
            ...Object.entries(roleLevelLabels).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
          onValueChange={(value) => setRoleLevel(value as RoleLevel | "")}
          placeholder="All role levels"
        />
      </div>
      <Button className="sm:col-span-2 lg:col-span-5 w-fit" onClick={apply}>
        <Search className="size-4" />
        Apply filters
      </Button>
    </div>
  );
}
