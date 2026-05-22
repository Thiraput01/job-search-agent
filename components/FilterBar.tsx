"use client";

export type SortOrder = "newest" | "oldest";

interface FilterBarProps {
  tags: string[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  sortOrder: SortOrder;
  onSortChange: (sort: SortOrder) => void;
}

export default function FilterBar({
  tags,
  activeFilters,
  onFilterChange,
  sortOrder,
  onSortChange,
}: FilterBarProps) {
  const isAllActive = activeFilters.length === 0;

  function toggleFilter(tag: string) {
    if (activeFilters.includes(tag)) {
      onFilterChange(activeFilters.filter((f) => f !== tag));
    } else {
      onFilterChange([...activeFilters, tag]);
    }
  }

  function clearFilters() {
    onFilterChange([]);
  }

  return (
    <div className="space-y-3">
      {/* Tag filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted mr-1">Filter:</span>

        <button
          onClick={clearFilters}
          className={`
            inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
            cursor-pointer select-none
            ${
              isAllActive
                ? "bg-filter-active-bg text-filter-active-text"
                : "bg-surface text-muted border border-border hover:border-border-accent"
            }
          `}
        >
          All
        </button>

        {tags.map((tag) => {
          const isActive = activeFilters.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleFilter(tag)}
              className={`
                inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
                cursor-pointer select-none
                ${
                  isActive
                    ? "bg-filter-active-bg text-filter-active-text"
                    : "bg-surface text-muted border border-border hover:border-border-accent"
                }
              `}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Sort row */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted mr-1">Sort:</span>

        <button
          onClick={() => onSortChange("newest")}
          className={`
            inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium
            cursor-pointer select-none
            ${
              sortOrder === "newest"
                ? "bg-filter-active-bg text-filter-active-text"
                : "bg-surface text-muted border border-border hover:border-border-accent"
            }
          `}
        >
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
              d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
            />
          </svg>
          Newest first
        </button>

        <button
          onClick={() => onSortChange("oldest")}
          className={`
            inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium
            cursor-pointer select-none
            ${
              sortOrder === "oldest"
                ? "bg-filter-active-bg text-filter-active-text"
                : "bg-surface text-muted border border-border hover:border-border-accent"
            }
          `}
        >
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
              d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
            />
          </svg>
          Oldest first
        </button>
      </div>
    </div>
  );
}
