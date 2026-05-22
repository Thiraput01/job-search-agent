"use client";

import { useState, useMemo } from "react";
import { Job, SectionKey } from "@/lib/types";
import TabNav from "./TabNav";
import SearchBar from "./SearchBar";
import FilterBar, { SortOrder } from "./FilterBar";
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

/**
 * Check whether a job matches a search query.
 * Searches across title, company, location, tags, and description.
 */
function matchesSearch(job: Job, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  const searchable = [
    job.title,
    job.company,
    job.location,
    job.type,
    job.experience,
    job.description,
    ...job.tags,
  ]
    .join(" ")
    .toLowerCase();

  // Support multi-word search: all tokens must match
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((token) => searchable.includes(token));
}

/**
 * Sort jobs by posted_date.
 */
function sortJobs(jobs: Job[], order: SortOrder): Job[] {
  return [...jobs].sort((a, b) => {
    const dateA = a.posted_date || "0000-00-00";
    const dateB = b.posted_date || "0000-00-00";
    return order === "newest"
      ? dateB.localeCompare(dateA)
      : dateA.localeCompare(dateB);
  });
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const allJobs: Record<SectionKey, Job[]> = { thai, overseas, remote };
  const currentJobs = allJobs[activeTab];

  // All unique tags across ALL sections (so filters persist across tabs)
  const allTags = useMemo(() => {
    return extractTags([...thai, ...overseas, ...remote]);
  }, [thai, overseas, remote]);

  // Pipeline: filter by tags → filter by search → sort
  const processedJobs = useMemo(() => {
    let result = currentJobs;

    // Tag filter
    if (activeFilters.length > 0) {
      result = result.filter((job) =>
        activeFilters.some((filter) =>
          job.tags.map((t) => t.toLowerCase()).includes(filter)
        )
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter((job) => matchesSearch(job, searchQuery));
    }

    // Sort
    result = sortJobs(result, sortOrder);

    return result;
  }, [currentJobs, activeFilters, searchQuery, sortOrder]);

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

      {/* Search bar */}
      <div className="mb-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Filters & Sort */}
      <div className="mb-5">
        <FilterBar
          tags={allTags}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </div>

      {/* Job listings */}
      <JobSection
        jobs={processedJobs}
        sectionKey={activeTab}
        lastUpdated={lastUpdated[activeTab]}
        filteredCount={processedJobs.length}
        totalCount={currentJobs.length}
      />
    </div>
  );
}
