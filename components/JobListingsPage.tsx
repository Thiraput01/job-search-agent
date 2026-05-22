"use client";

import { useState, useMemo } from "react";
import { Job, SectionKey } from "@/lib/types";
import TabNav from "./TabNav";
import FilterBar from "./FilterBar";
import JobSection from "./JobSection";

interface JobListingsPageProps {
  thai: Job[];
  overseas: Job[];
  remote: Job[];
  lastUpdated: Record<SectionKey, string>;
  lastRefreshed: string;
}

/**
 * Extract unique tags from a list of jobs, sorted by frequency (most common first).
 */
function extractTags(jobs: Job[]): string[] {
  const freq = new Map<string, number>();
  for (const job of jobs) {
    for (const tag of job.tags) {
      const lower = tag.toLowerCase();
      freq.set(lower, (freq.get(lower) ?? 0) + 1);
    }
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}

export default function JobListingsPage({
  thai,
  overseas,
  remote,
  lastUpdated,
  lastRefreshed,
}: JobListingsPageProps) {
  const [activeTab, setActiveTab] = useState<SectionKey>("thai");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const allJobs: Record<SectionKey, Job[]> = { thai, overseas, remote };
  const currentJobs = allJobs[activeTab];

  // All unique tags across ALL sections (so filters persist across tabs)
  const allTags = useMemo(() => {
    return extractTags([...thai, ...overseas, ...remote]);
  }, [thai, overseas, remote]);

  // Filter jobs by active tags
  const filteredJobs = useMemo(() => {
    if (activeFilters.length === 0) return currentJobs;
    return currentJobs.filter((job) =>
      activeFilters.some((filter) =>
        job.tags.map((t) => t.toLowerCase()).includes(filter)
      )
    );
  }, [currentJobs, activeFilters]);

  // Counts per section (unfiltered, for the tab badges)
  const counts: Record<SectionKey, number> = {
    thai: thai.length,
    overseas: overseas.length,
    remote: remote.length,
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Page header */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Job listings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Last refreshed by agent: {lastRefreshed}
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-4">
        <TabNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            // Don't reset filters on tab change so users can cross-compare
          }}
          counts={counts}
        />
      </div>

      {/* Filters */}
      <div className="mb-5">
        <FilterBar
          tags={allTags}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
        />
      </div>

      {/* Job listings */}
      <JobSection
        jobs={filteredJobs}
        sectionKey={activeTab}
        lastUpdated={lastUpdated[activeTab]}
        filteredCount={filteredJobs.length}
        totalCount={currentJobs.length}
      />
    </div>
  );
}
