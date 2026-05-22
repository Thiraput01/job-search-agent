"use client";

import { SectionKey } from "@/lib/types";

interface TabNavProps {
  activeTab: SectionKey;
  onTabChange: (tab: SectionKey) => void;
  counts: Record<SectionKey, number>;
}

const TABS: { key: SectionKey; label: string; emoji: string }[] = [
  { key: "thai", label: "Thailand", emoji: "🇹🇭" },
  { key: "overseas", label: "Overseas", emoji: "✈️" },
  { key: "remote", label: "Remote", emoji: "🌏" },
];

export default function TabNav({ activeTab, onTabChange, counts }: TabNavProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Job sections">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium
              cursor-pointer select-none
              ${
                isActive
                  ? "bg-tab-active-bg text-tab-active-text shadow-sm"
                  : "bg-surface text-foreground border border-border hover:border-border-accent hover:shadow-sm"
              }
            `}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="text-base leading-none">{tab.emoji}</span>
            {tab.label}
            <span
              className={`
                ml-0.5 rounded-full px-1.5 py-0.5 text-xs
                ${isActive ? "bg-white/15 text-white" : "bg-tag-bg text-muted"}
              `}
            >
              {counts[tab.key]}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
