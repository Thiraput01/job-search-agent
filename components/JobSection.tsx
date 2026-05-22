"use client";

import { Job, SectionKey } from "@/lib/types";
import JobCard from "./JobCard";

interface JobSectionProps {
  jobs: Job[];
  sectionKey: SectionKey;
  lastUpdated: string;
  filteredCount: number;
  totalCount: number;
}

function formatUpdatedDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JobSection({
  jobs,
  sectionKey,
  lastUpdated,
  filteredCount,
  totalCount,
}: JobSectionProps) {
  const showVisaRelocation = sectionKey === "overseas";

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">
          <span className="font-medium text-foreground">{filteredCount}</span>
          {filteredCount !== totalCount && (
            <span className="text-muted"> of {totalCount}</span>
          )}{" "}
          listing{filteredCount !== 1 ? "s" : ""}
        </p>
        {lastUpdated && (
          <p className="text-sm text-muted">
            Updated {formatUpdatedDate(lastUpdated)}
          </p>
        )}
      </div>

      {/* Job cards grid */}
      {jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map((job, idx) => (
            <JobCard
              key={`${job.company}-${job.title}-${idx}`}
              job={job}
              showVisaRelocation={showVisaRelocation}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-sm font-medium text-foreground">
            No listings match your filters
          </p>
          <p className="mt-1 text-sm text-muted">
            Try removing some filters to see more results.
          </p>
        </div>
      )}
    </section>
  );
}
