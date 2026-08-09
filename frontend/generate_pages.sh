#!/bin/bash
declare -A pages=(
    ["app/projects/new/page.tsx"]="Create Project"
    ["app/projects/[id]/page.tsx"]="Project Dashboard"
    ["app/projects/[id]/upload/page.tsx"]="Upload Documents"
    ["app/projects/[id]/analysis/page.tsx"]="AI Analysis"
    ["app/projects/[id]/comparison/page.tsx"]="Supplier Comparison"
    ["app/projects/[id]/chat/page.tsx"]="Procurement Copilot"
    ["app/projects/[id]/report/page.tsx"]="Final Report"
    ["app/settings/page.tsx"]="User Settings"
)

for file in "${!pages[@]}"; do
    title="${pages[$file]}"
    cat << CODE > "$file"
import { ContentCard } from "@/components/ui/ContentCard";

export default function Page() {
  return (
    <div className="flex flex-col pt-12">
      <h1 className="text-[var(--text-heading)] font-medium text-[var(--color-ink-black)] tracking-[var(--text-heading--letter-spacing)] leading-[var(--text-heading--line-height)] mb-[var(--spacing-60)]">
        $title
      </h1>
      <ContentCard>
        <p className="text-[var(--text-body-lg)] text-[var(--color-stone-gray)]">This is the $title page.</p>
      </ContentCard>
    </div>
  );
}
CODE
done
