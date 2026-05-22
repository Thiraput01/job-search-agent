export interface Job {
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  tags: string[];
  source_url: string;
  posted_date: string;
  visa_support: boolean;
  relocation: boolean;
  description: string;
}

export type SectionKey = "thai" | "overseas" | "remote";

export interface SectionMeta {
  key: SectionKey;
  label: string;
  emoji: string;
  filename: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    key: "thai",
    label: "Thailand",
    emoji: "🇹🇭",
    filename: "job_posting_thai.md",
  },
  {
    key: "overseas",
    label: "Overseas",
    emoji: "✈️",
    filename: "job_posting_overseas.md",
  },
  {
    key: "remote",
    label: "Remote",
    emoji: "🌏",
    filename: "job_posting_remote.md",
  },
];
