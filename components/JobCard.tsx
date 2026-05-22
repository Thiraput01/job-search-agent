"use client";

import { Job } from "@/lib/types";

interface JobCardProps {
  job: Job;
  showVisaRelocation?: boolean;
}

/**
 * Determine whether a job was posted within the last 2 days.
 */
function isNew(postedDate: string): boolean {
  if (!postedDate) return false;
  const posted = new Date(postedDate);
  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 2;
}

/**
 * Format a date string like "22 May 2026".
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JobCard({ job, showVisaRelocation }: JobCardProps) {
  const jobIsNew = isNew(job.posted_date);

  return (
    <article
      className={`
        group relative rounded-xl border bg-surface p-5 sm:p-6
        hover:shadow-md hover:border-border-accent
        ${jobIsNew ? "border-border-accent" : "border-border"}
      `}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground leading-snug truncate">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted">
            {job.company}
            {job.location && (
              <>
                {" "}
                <span className="text-border">·</span>{" "}
                {job.location.split(",")[0]}
              </>
            )}
          </p>
        </div>

        {jobIsNew && (
          <span className="inline-flex items-center rounded-full bg-badge-new-bg px-2.5 py-0.5 text-xs font-medium text-badge-new-text shrink-0">
            New
          </span>
        )}
      </div>

      {/* Meta pills */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
        {job.type && (
          <span className="inline-flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            {job.type}
          </span>
        )}
        {job.experience && (
          <span className="inline-flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {job.experience}
          </span>
        )}
        {showVisaRelocation && job.visa_support && (
          <span className="inline-flex items-center gap-1 text-accent">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
              />
            </svg>
            Visa
          </span>
        )}
        {showVisaRelocation && job.relocation && (
          <span className="inline-flex items-center gap-1 text-accent">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
              />
            </svg>
            Relocation
          </span>
        )}
      </div>

      {/* Tags */}
      {job.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-tag-bg px-2 py-0.5 text-xs font-medium text-tag-text"
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </span>
          ))}
        </div>
      )}

      {/* Description preview */}
      {job.description && (
        <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-2">
          {job.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted">
          Posted {formatDate(job.posted_date)}
        </span>
        <a
          href={job.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-1.5 rounded-lg border border-border
            bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground
            hover:bg-surface-hover hover:border-border-accent
            active:scale-[0.98]
          "
        >
          View listing
          <svg
            className="h-3.5 w-3.5 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}
