import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Job, SectionKey, SECTIONS } from "./types";

const JOBS_DIR = path.join(process.cwd(), "jobs");

/**
 * Parse a single .md file containing multiple job listings separated by `---`.
 *
 * The file format uses YAML frontmatter blocks. Each listing is wrapped by a
 * pair of `---` delimiters (opening + closing), so consecutive listings produce
 * a blank segment between the closing `---` of one and the opening `---` of the
 * next. We split on blank-line-surrounded `---` lines and parse each chunk.
 */
function parseJobFile(filename: string): Job[] {
  const filePath = path.join(JOBS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  // Split on lines that are just `---` surrounded by blank lines (the separator
  // between listings). We keep the `---` for gray-matter by re-adding them.
  const chunks = raw
    .split(/\n---\s*\n\s*\n---\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const jobs: Job[] = [];

  for (const chunk of chunks) {
    // Ensure the chunk starts with `---` for gray-matter
    const normalized = chunk.startsWith("---") ? chunk : `---\n${chunk}`;

    try {
      const { data, content } = matter(normalized);

      if (!data.title) continue; // skip empty / malformed blocks

      jobs.push({
        title: data.title ?? "",
        company: data.company ?? "",
        location: data.location ?? "",
        type: data.type ?? "",
        experience: data.experience ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        source_url: data.source_url ?? "#",
        posted_date: data.posted_date
          ? new Date(data.posted_date).toISOString().split("T")[0]
          : "",
        visa_support: data.visa_support ?? false,
        relocation: data.relocation ?? false,
        description: content.trim(),
      });
    } catch {
      // Skip unparseable blocks
      continue;
    }
  }

  return jobs;
}

export interface AllJobs {
  thai: Job[];
  overseas: Job[];
  remote: Job[];
  lastUpdated: Record<SectionKey, string>;
}

/**
 * Read all 3 markdown files and return structured data for the UI.
 */
export function getAllJobs(): AllJobs {
  const result: Record<SectionKey, Job[]> = {
    thai: [],
    overseas: [],
    remote: [],
  };

  const lastUpdated: Record<SectionKey, string> = {
    thai: "",
    overseas: "",
    remote: "",
  };

  for (const section of SECTIONS) {
    const jobs = parseJobFile(section.filename);
    result[section.key] = jobs;

    // Compute last updated from the most recent posted_date
    if (jobs.length > 0) {
      const dates = jobs
        .map((j) => j.posted_date)
        .filter(Boolean)
        .sort()
        .reverse();
      lastUpdated[section.key] = dates[0] ?? "";
    }
  }

  return { ...result, lastUpdated };
}
