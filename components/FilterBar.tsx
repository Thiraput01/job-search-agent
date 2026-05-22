"use client";

interface FilterBarProps {
  tags: string[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export default function FilterBar({
  tags,
  activeFilters,
  onFilterChange,
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

  if (tags.length === 0) return null;

  return (
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
  );
}
