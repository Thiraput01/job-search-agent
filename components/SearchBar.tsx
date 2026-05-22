"use client";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" to focus
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={`
        relative flex items-center rounded-xl border bg-surface
        transition-all duration-200
        ${
          focused
            ? "border-border-accent shadow-sm ring-1 ring-border-accent/30"
            : "border-border hover:border-border-accent/60"
        }
      `}
    >
      {/* Search icon */}
      <div className="pointer-events-none pl-3.5">
        <svg
          className={`h-4 w-4 transition-colors ${
            focused ? "text-accent" : "text-muted"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search jobs by title, company, or skill..."
        className="
          w-full bg-transparent px-3 py-2.5 text-sm text-foreground
          placeholder:text-muted/60 outline-none
        "
        aria-label="Search job listings"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="mr-2 rounded-md p-1 text-muted hover:text-foreground hover:bg-tag-bg cursor-pointer"
          aria-label="Clear search"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Keyboard hint */}
      {!value && !focused && (
        <div className="pointer-events-none mr-3">
          <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-tag-bg px-1.5 py-0.5 text-[10px] font-medium text-muted">
            /
          </kbd>
        </div>
      )}
    </div>
  );
}
