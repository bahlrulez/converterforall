import React from "react";
import Link from "next/link";
import {
  Layout,
  FileType,
  Image as ImageIcon,
  Combine,
  Scissors,
  Wrench,
  FileText,
  Code2,
  KeyRound,
  Eraser,
  Camera,
  Presentation,
} from "lucide-react";

export interface CategoryToolCardItem {
  slug: string;
  title: string;
  description: string;
  theme?: string;
  iconName?: string;
}

export type GroupedCategoryTools = Record<string, CategoryToolCardItem[]>;

function getIconComponent(iconName: string, className: string = "h-6 w-6") {
  switch (iconName) {
    case "Code2":
      return <Code2 className={className} />;
    case "Eraser":
      return <Eraser className={className} />;
    case "Camera":
      return <Camera className={className} />;
    case "FileStack":
      return <Combine className={className} />;
    case "Scissors":
      return <Scissors className={className} />;
    case "Zap":
      return <Layout className={className} />;
    case "Lock":
    case "Unlock":
      return <KeyRound className={className} />;
    case "Image":
      return <ImageIcon className={className} />;
    case "FileText":
      return <FileText className={className} />;
    case "Presentation":
      return <Presentation className={className} />;
    case "FileSpreadsheet":
      return <FileType className={className} />;
    case "FileCode":
      return <Code2 className={className} />;
    case "Video":
    case "Music":
      return <Layout className={className} />;
    case "Type":
      return <FileType className={className} />;
    case "Wrench":
    default:
      return <Wrench className={className} />;
  }
}

function getThemeStyles(theme?: string) {
  switch (theme) {
    case "cyan":
      return "from-cyan-500 to-blue-500 text-cyan-50 bg-cyan-500/10 ring-cyan-500/30";
    case "purple":
      return "from-purple-500 to-pink-500 text-purple-50 bg-purple-500/10 ring-purple-500/30";
    case "amber":
      return "from-amber-400 to-orange-500 text-amber-50 bg-amber-500/10 ring-amber-500/30";
    case "orange":
      return "from-orange-400 to-red-500 text-orange-50 bg-orange-500/10 ring-orange-500/30";
    case "pink":
      return "from-pink-400 to-rose-500 text-pink-50 bg-pink-500/10 ring-pink-500/30";
    case "teal":
      return "from-teal-400 to-emerald-500 text-teal-50 bg-teal-500/10 ring-teal-500/30";
    case "yellow":
      return "from-yellow-400 to-amber-500 text-yellow-50 bg-yellow-500/10 ring-yellow-500/30";
    case "blue":
      return "from-blue-500 to-indigo-500 text-blue-50 bg-blue-500/10 ring-blue-500/30";
    case "red":
      return "from-red-500 to-rose-500 text-red-50 bg-red-500/10 ring-red-500/30";
    case "emerald":
      return "from-emerald-400 to-teal-500 text-emerald-50 bg-emerald-500/10 ring-emerald-500/30";
    case "sky":
      return "from-sky-400 to-blue-500 text-sky-50 bg-sky-500/10 ring-sky-500/30";
    case "slate":
    default:
      return "from-slate-500 to-slate-600 text-slate-50 bg-slate-500/10 ring-slate-500/30";
  }
}

export function cleanCardTitle(title: string): string {
  let clean = title.replace(/^Convert /i, "");
  if (clean.includes(" – ")) clean = clean.split(" – ")[0];
  else if (clean.includes(" - ")) clean = clean.split(" - ")[0];
  else if (clean.includes(" — ")) clean = clean.split(" — ")[0];
  clean = clean.replace(/^Free Online /i, "");
  return clean.trim();
}

export function normalizeCategorySearchText(value: string): string {
  return value.toLowerCase().replace(/[-_\s]+/g, " ").trim();
}

export function compactCategorySearchText(value: string): string {
  return value.toLowerCase().replace(/[-_\s]+/g, "");
}

export function matchesCategoryToolQuery(tool: CategoryToolCardItem, query: string): boolean {
  const rawQuery = query.toLowerCase().trim();
  if (!rawQuery) return true;

  const normQuery = normalizeCategorySearchText(rawQuery);
  const compactQuery = compactCategorySearchText(rawQuery);
  const fields = [tool.title, tool.description, tool.slug];

  return fields.some((field) => {
    const lowerField = field.toLowerCase();
    if (lowerField.includes(rawQuery)) return true;
    if (normQuery.length > 0 && normalizeCategorySearchText(lowerField).includes(normQuery)) {
      return true;
    }
    return compactQuery.length > 0 && compactCategorySearchText(lowerField).includes(compactQuery);
  });
}

export function filterGroupedCategoryTools(
  groupedTools: GroupedCategoryTools,
  query: string
): GroupedCategoryTools {
  if (!query.trim()) return groupedTools;

  const filtered: GroupedCategoryTools = {};
  for (const [groupName, tools] of Object.entries(groupedTools)) {
    const matches = tools.filter((tool) => matchesCategoryToolQuery(tool, query));
    if (matches.length > 0) {
      filtered[groupName] = matches;
    }
  }
  return filtered;
}

export function countGroupedCategoryTools(groupedTools: GroupedCategoryTools): number {
  return Object.values(groupedTools).reduce((sum, items) => sum + items.length, 0);
}

interface CategoryToolsGridProps {
  groupedTools: GroupedCategoryTools;
  showGroupHeaders: boolean;
}

/**
 * Shared server-and-client safe grouped tool card grid for category pages.
 */
export function CategoryToolsGrid({ groupedTools, showGroupHeaders }: CategoryToolsGridProps) {
  const groups = Object.keys(groupedTools);

  return (
    <div data-testid="category-tools-grid" className="space-y-12 md:space-y-16">
      {groups.map((groupName) => (
        <div key={groupName}>
          {showGroupHeaders && (
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                {groupName}
              </h2>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {groupedTools[groupName].map((tool) => {
              const colorConfig = getThemeStyles(tool.theme);
              const [gradientFrom, gradientTo] = colorConfig.split(" ");

              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="group flex flex-col items-center text-center rounded-[24px] bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800/80 p-5 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-300 relative overflow-hidden hover:-translate-y-1"
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradientFrom} ${gradientTo} pointer-events-none`}
                  />

                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-[18px] mb-4 flex items-center justify-center shadow-sm bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white ring-1 ring-white/20 dark:ring-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10`}
                  >
                    {getIconComponent(tool.iconName || "Settings")}
                  </div>

                  <h3 className="font-bold text-[14px] md:text-[15px] text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight relative z-10 w-full line-clamp-2">
                    {cleanCardTitle(tool.title)}
                  </h3>

                  <p className="hidden md:block text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 relative z-10">
                    {tool.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
