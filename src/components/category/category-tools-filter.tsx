"use client";

import React, { useId, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import {
  CategoryToolsGrid,
  GroupedCategoryTools,
  countGroupedCategoryTools,
  filterGroupedCategoryTools,
} from "./category-tools-grid";

interface CategoryToolsFilterProps {
  groupedTools: GroupedCategoryTools;
  showGroupHeaders: boolean;
  placeholder?: string;
  accessibleLabel?: string;
  emptySuggestions?: string;
}

/**
 * Reusable client-side filter wrapper that filters server-provided grouped category tools.
 */
export function CategoryToolsFilter({
  groupedTools,
  showGroupHeaders,
  placeholder = "Search tools...",
  accessibleLabel = "Search category tools",
  emptySuggestions = "Try another font name, keyword, or conversion direction.",
}: CategoryToolsFilterProps) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const statusId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const totalCount = useMemo(() => countGroupedCategoryTools(groupedTools), [groupedTools]);
  const filteredTools = useMemo(
    () => filterGroupedCategoryTools(groupedTools, query),
    [groupedTools, query]
  );
  const matchingCount = useMemo(() => countGroupedCategoryTools(filteredTools), [filteredTools]);
  const trimmedQuery = query.trim();

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-8">
      <div
        role="search"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm"
      >
        <div className="relative flex-1 w-full">
          <label htmlFor={inputId} className="sr-only">
            {accessibleLabel}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500"
          />
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="searchbox"
            aria-label={accessibleLabel}
            aria-describedby={statusId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query.length > 0) {
                e.preventDefault();
                setQuery("");
              }
            }}
            placeholder={placeholder}
            className="w-full h-11 pl-10 pr-11 rounded-xl bg-slate-50 dark:bg-[#080e22] border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-400 transition-all"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <p
          id={statusId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 px-1 sm:px-2 whitespace-nowrap"
        >
          {trimmedQuery
            ? `Showing ${matchingCount} of ${totalCount} ${totalCount === 1 ? "tool" : "tools"} for "${trimmedQuery}"`
            : `Showing ${totalCount} ${totalCount === 1 ? "tool" : "tools"}`}
        </p>
      </div>

      {matchingCount === 0 ? (
        <div
          role="status"
          className="rounded-[24px] bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center max-w-xl mx-auto shadow-sm"
        >
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
            {`No matching converters found for "${trimmedQuery}"`}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
            {emptySuggestions}
          </p>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            Clear search
          </button>
        </div>
      ) : (
        <CategoryToolsGrid groupedTools={filteredTools} showGroupHeaders={showGroupHeaders} />
      )}
    </div>
  );
}
