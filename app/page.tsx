import { getAllJobs } from "@/lib/parseJobs";
import JobListingsPage from "@/components/JobListingsPage";

export const dynamic = "force-dynamic";

/**
 * Compute a human-readable "last refreshed" timestamp from the most recent
 * posted_date across all sections.
 */
function computeLastRefreshed(lastUpdated: Record<string, string>): string {
  const allDates = Object.values(lastUpdated).filter(Boolean).sort().reverse();
  if (allDates.length === 0) return "unknown";

  const latest = new Date(allDates[0]);
  const now = new Date();
  const diffMs = now.getTime() - latest.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "just now";
  if (diffHours < 24) {
    return `today at ${latest.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  }

  return latest.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const { thai, overseas, remote, lastUpdated } = getAllJobs();
  const lastRefreshed = computeLastRefreshed(lastUpdated);

  return (
    <main className="flex-1">
      <JobListingsPage
        thai={thai}
        overseas={overseas}
        remote={remote}
        lastUpdated={lastUpdated}
        lastRefreshed={lastRefreshed}
      />
    </main>
  );
}
