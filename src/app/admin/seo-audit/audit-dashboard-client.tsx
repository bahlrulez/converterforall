"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  X, 
  ChevronRight,
  Filter,
  Sparkles,
  Info
} from "lucide-react";
import { CompleteSeoAuditDataset, ToolSeoInventoryItem } from "@/lib/seo/types";

export function AuditDashboardClient({ data }: { data: CompleteSeoAuditDataset }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTab, setSelectedTab] = useState<"all" | "canonical" | "alias" | "thin" | "weak-links">("all");
  const [selectedTool, setSelectedTool] = useState<ToolSeoInventoryItem | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"inventory" | "system">("inventory");

  const { summary, systemInspection, inventory } = data;

  // Filter items
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      // Tab filter
      if (selectedTab === "canonical" && item.isAlias) return false;
      if (selectedTab === "alias" && !item.isAlias) return false;
      if (selectedTab === "thin" && !item.isThinContent) return false;
      if (selectedTab === "weak-links" && item.incomingInternalLinkCount >= 3) return false;

      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = item.toolName.toLowerCase().includes(query);
        const matchesSlug = item.urlPath.toLowerCase().includes(query);
        const matchesH1 = item.currentH1.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSlug && !matchesH1 && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [inventory, selectedTab, selectedCategory, searchQuery]);

  // Export JSON function
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `converterforall-seo-audit-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, slug: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Top Admin Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">SEO Tool Inventory &amp; Intelligence Audit</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  INTERNAL ADMIN
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  NOINDEX
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live inspection of all {summary.totalToolPagesDiscovered} tool pages across 7 categories • Audited on {new Date(data.auditTimestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setActiveView(activeView === "inventory" ? "system" : "inventory")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeView === "system"
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {activeView === "system" ? "← Back to Inventory" : "Inspect SEO System"}
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-950"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* KPI Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tools</div>
            <div className="text-2xl font-black text-white mt-1">{summary.totalToolPagesDiscovered}</div>
            <div className="text-[10px] text-slate-500 mt-1">{summary.totalCanonicalTools} Canonical / {summary.totalAliasRoutes} Aliases</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Indexable</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{summary.totalIndexablePages}</div>
            <div className="text-[10px] text-slate-500 mt-1">{summary.totalNoindexPages} Aliases (Noindex/Alt)</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Thin Content</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{summary.pagesWithThinContent}</div>
            <div className="text-[10px] text-slate-500 mt-1">&lt;250w or fallback template</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Weak Linking</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{summary.pagesWithWeakInternalLinking}</div>
            <div className="text-[10px] text-slate-500 mt-1">&lt;3 inbound internal links</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Duplicate Titles</div>
            <div className="text-2xl font-black text-purple-400 mt-1">{summary.pagesWithDuplicateTitles.length}</div>
            <div className="text-[10px] text-slate-500 mt-1">Shared by alias routes</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Avg Word Count</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">{summary.averageWordCount}</div>
            <div className="text-[10px] text-slate-500 mt-1">Words of visible copy</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Avg SEO Score</div>
            <div className="text-2xl font-black text-blue-400 mt-1">{summary.averageSeoScore}/100</div>
            <div className="text-[10px] text-slate-500 mt-1">Sitewide health index</div>
          </div>
        </div>

        {activeView === "system" ? (
          /* SYSTEM INSPECTION TAB */
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>Sitewide Technical SEO Architecture Inspection</span>
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Audit of robots.txt, dynamic sitemaps, canonical alternates, JSON-LD structured schemas, and tracking tags.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sitemap */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sitemap Implementation</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Healthy ({systemInspection.sitemap.totalUrls} URLs)
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p>• Base routes: <span className="text-white font-medium">{systemInspection.sitemap.urlCountsByType.baseRoutes}</span></p>
                    <p>• Category hub routes: <span className="text-white font-medium">{systemInspection.sitemap.urlCountsByType.categoryRoutes}</span></p>
                    <p>• Canonical tool routes: <span className="text-white font-medium">{systemInspection.sitemap.urlCountsByType.toolRoutes}</span></p>
                    <p>• Blog article routes: <span className="text-white font-medium">{systemInspection.sitemap.urlCountsByType.blogRoutes}</span></p>
                    <p className="text-[11px] text-emerald-400/90 pt-2 border-t border-slate-800">
                      ✓ Aliases are strictly excluded from sitemap.ts, preventing duplicate submission.
                    </p>
                  </div>
                </div>

                {/* Robots.txt */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Robots.txt Directives</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Active
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p>• User-Agent: <span className="text-white font-medium">* (All crawlers allowed)</span></p>
                    <p>• Disallow rules: <span className="text-white font-mono text-[11px]">{systemInspection.robotsTxt.disallowedPaths.join(", ")}</span></p>
                    <p>• Sitemap link: <span className="text-blue-400 font-mono text-[11px]">{systemInspection.robotsTxt.sitemapUrl}</span></p>
                    {systemInspection.robotsTxt.issues.map((iss, i) => (
                      <p key={i} className="text-[11px] text-amber-400/90 pt-2 border-t border-slate-800">
                        ⚠ {iss}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Canonical Strategy */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Canonical Strategy</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Alias Risk Detected
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p>• Base domain: <span className="text-white font-medium">{systemInspection.canonicalStrategy.baseUrl}</span></p>
                    <p>• Self-referential on primary tools: <span className="text-emerald-400 font-medium">Yes</span></p>
                    {systemInspection.canonicalStrategy.issues.map((iss, i) => (
                      <p key={i} className="text-[11px] text-rose-400/90 pt-2 border-t border-slate-800 leading-relaxed">
                        🚨 {iss}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Schema & Analytics */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Schemas &amp; Verification</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Verified
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p>• Google Analytics ID: <span className="text-white font-mono text-[11px]">{systemInspection.analyticsAndSearchConsole.googleAnalyticsId}</span></p>
                    <p>• Search Console Tag: <span className="text-white font-mono text-[11px]">{systemInspection.analyticsAndSearchConsole.googleSiteVerification}</span></p>
                    <p>• BreadcrumbList Schema: <span className="text-emerald-400">Emitted on all tools</span></p>
                    <p>• SoftwareApplication Schema: <span className="text-emerald-400">Emitted with 0-dollar free offer</span></p>
                    {systemInspection.schemaGeneration.issues.map((iss, i) => (
                      <p key={i} className="text-[11px] text-cyan-400/90 pt-2 border-t border-slate-800">
                        💡 {iss}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* INVENTORY LISTING & SEARCH */
          <div>
            {/* Filter Pills & Search Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="w-full md:w-96 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by tool name, slug, format..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories ({summary.totalToolPagesDiscovered})</option>
                    <option value="image">Image ({summary.categoryBreakdown["image"] || 0})</option>
                    <option value="document">Document / PDF ({summary.categoryBreakdown["document"] || 0})</option>
                    <option value="audio">Audio ({summary.categoryBreakdown["audio"] || 0})</option>
                    <option value="video">Video ({summary.categoryBreakdown["video"] || 0})</option>
                    <option value="fonts">Fonts ({summary.categoryBreakdown["fonts"] || 0})</option>
                    <option value="developer">Data &amp; Code ({summary.categoryBreakdown["developer"] || 0})</option>
                    <option value="utilities">Utilities ({summary.categoryBreakdown["utilities"] || 0})</option>
                  </select>

                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    Showing <span className="text-white font-bold">{filteredInventory.length}</span> tools
                  </span>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedTab("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedTab === "all"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  All ({inventory.length})
                </button>
                <button
                  onClick={() => setSelectedTab("canonical")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedTab === "canonical"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  Canonical Tools ({summary.totalCanonicalTools})
                </button>
                <button
                  onClick={() => setSelectedTab("alias")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedTab === "alias"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  Aliases &amp; Redirects ({summary.totalAliasRoutes})
                </button>
                <button
                  onClick={() => setSelectedTab("thin")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedTab === "thin"
                      ? "bg-amber-600 text-white shadow"
                      : "bg-slate-950 text-amber-400 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  Thin Content ({summary.pagesWithThinContent})
                </button>
                <button
                  onClick={() => setSelectedTab("weak-links")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedTab === "weak-links"
                      ? "bg-rose-600 text-white shadow"
                      : "bg-slate-950 text-rose-400 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  Weak Inbound Links ({summary.pagesWithWeakInternalLinking})
                </button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Tool Name &amp; Path</th>
                      <th className="py-3.5 px-3">Category</th>
                      <th className="py-3.5 px-3">Direction</th>
                      <th className="py-3.5 px-3">Score</th>
                      <th className="py-3.5 px-3">Words</th>
                      <th className="py-3.5 px-3">Inbound</th>
                      <th className="py-3.5 px-3">Content</th>
                      <th className="py-3.5 px-3">Indexability</th>
                      <th className="py-3.5 px-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredInventory.map((item) => {
                      const scoreColor =
                        item.seoHealthScore >= 80
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : item.seoHealthScore >= 65
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          : "text-rose-400 bg-rose-500/10 border-rose-500/20";

                      const wordsColor =
                        item.wordCount >= 400
                          ? "text-emerald-400"
                          : item.wordCount >= 250
                          ? "text-slate-300"
                          : "text-amber-400 font-semibold";

                      return (
                        <tr key={item.urlPath} className="hover:bg-slate-800/40 transition-colors">
                          {/* Tool Name & Slug */}
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-bold text-white truncate">{item.toolName}</div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                              <span>{item.urlPath}</span>
                              <button
                                onClick={() => copyToClipboard(`https://www.converterforall.com${item.urlPath}`, item.urlPath)}
                                className="text-slate-500 hover:text-slate-300"
                                title="Copy URL"
                              >
                                {copiedSlug === item.urlPath ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3 capitalize">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                              {item.category}
                            </span>
                          </td>

                          {/* Direction */}
                          <td className="py-3 px-3 text-[11px] font-medium text-slate-400">
                            {item.primaryConversionDirection}
                          </td>

                          {/* SEO Score */}
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${scoreColor}`}>
                              {item.seoHealthScore}
                            </span>
                          </td>

                          {/* Word Count */}
                          <td className={`py-3 px-3 text-[11px] ${wordsColor}`}>
                            {item.wordCount}w
                          </td>

                          {/* Inbound Links */}
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                              item.incomingInternalLinkCount < 3 ? "text-rose-400" : "text-slate-300"
                            }`}>
                              <LinkIcon className="w-3 h-3" />
                              {item.incomingInternalLinkCount}
                            </span>
                          </td>

                          {/* Content Quality */}
                          <td className="py-3 px-3">
                            {item.isThinContent ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Thin
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Unique
                              </span>
                            )}
                          </td>

                          {/* Indexability */}
                          <td className="py-3 px-3">
                            {item.isAlias ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                Alias
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Indexable
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedTool(item)}
                              className="px-3 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                            >
                              Inspect →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED 26-POINT INSPECTION MODAL */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedTool(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{selectedTool.toolName}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Score: {selectedTool.seoHealthScore}/100
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                  <span>https://www.converterforall.com{selectedTool.urlPath}</span>
                  <a
                    href={selectedTool.urlPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Page</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Issues Alert Box if present */}
            {selectedTool.issues.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Technical SEO Flags ({selectedTool.issues.length})</span>
                </h3>
                <ul className="space-y-1 text-xs text-rose-300">
                  {selectedTool.issues.map((iss, i) => (
                    <li key={i}>• {iss}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 26-Point Data Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Box 1: Route & Canonical */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-300 text-xs border-b border-slate-800 pb-1.5 uppercase tracking-wider">
                  Routing &amp; Canonical
                </div>
                <div><span className="text-slate-500">Path:</span> <span className="font-mono text-white">{selectedTool.urlPath}</span></div>
                <div><span className="text-slate-500">Canonical Tag:</span> <span className="font-mono text-blue-400 break-all">{selectedTool.canonicalUrl}</span></div>
                <div><span className="text-slate-500">Is Alias:</span> <span className="text-white">{selectedTool.isAlias ? `Yes (Target: /${selectedTool.canonicalTargetSlug})` : "No (Canonical)"}</span></div>
                <div><span className="text-slate-500">Indexability:</span> <span className="text-white capitalize">{selectedTool.indexability}</span></div>
                <div><span className="text-slate-500">Robots Directives:</span> <span className="text-slate-300 font-mono text-[11px]">{selectedTool.robotsDirectives}</span></div>
              </div>

              {/* Box 2: Metadata & On-Page Headings */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-300 text-xs border-b border-slate-800 pb-1.5 uppercase tracking-wider">
                  On-Page Headings &amp; Meta
                </div>
                <div><span className="text-slate-500">H1 Tag:</span> <span className="font-semibold text-white">{selectedTool.currentH1}</span></div>
                <div><span className="text-slate-500">Title Tag:</span> <span className="text-slate-200">{selectedTool.currentTitle}</span></div>
                <div><span className="text-slate-500">Meta Description:</span> <span className="text-slate-300 leading-relaxed block mt-0.5">{selectedTool.currentMetaDescription}</span></div>
              </div>

              {/* Box 3: Technical Conversion Specs */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-300 text-xs border-b border-slate-800 pb-1.5 uppercase tracking-wider">
                  Technical Conversion Specs
                </div>
                <div><span className="text-slate-500">Direction:</span> <span className="font-semibold text-white">{selectedTool.primaryConversionDirection}</span></div>
                <div><span className="text-slate-500">Tool Type:</span> <span className="text-white capitalize">{selectedTool.toolType}</span></div>
                <div><span className="text-slate-500">Processing Location:</span> <span className="text-emerald-400">{selectedTool.processingLocation}</span></div>
                <div><span className="text-slate-500">Requires File Upload:</span> <span className="text-white">{selectedTool.requiresFileUpload ? "Yes" : "No (Interactive UI/Inputs)"}</span></div>
                <div><span className="text-slate-500">Supported Input:</span> <span className="text-slate-300 font-mono text-[11px]">{selectedTool.supportedInputFormats.join(", ") || "N/A"}</span></div>
                <div><span className="text-slate-500">Supported Output:</span> <span className="text-slate-300 font-mono text-[11px]">{selectedTool.supportedOutputFormats.join(", ") || "N/A"}</span></div>
              </div>

              {/* Box 4: Content Depth & FAQs */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-300 text-xs border-b border-slate-800 pb-1.5 uppercase tracking-wider">
                  Content Depth &amp; Structure
                </div>
                <div><span className="text-slate-500">Meaningful Word Count:</span> <span className="font-bold text-white">{selectedTool.wordCount} words</span></div>
                <div><span className="text-slate-500">Unique SEO Content:</span> <span className={selectedTool.hasUniqueSeoContent ? "text-emerald-400" : "text-amber-400"}>{selectedTool.hasUniqueSeoContent ? "Yes (Handcrafted)" : "No (Generic Fallback)"}</span></div>
                <div><span className="text-slate-500">Content Sections:</span> <span className="text-white">{selectedTool.faqSections.length} sections</span></div>
                <div><span className="text-slate-500">Structured Data Schemas:</span> <span className="text-white font-mono text-[11px]">{selectedTool.structuredDataTypes.join(", ")}</span></div>
                <div><span className="text-slate-500">Breadcrumb Hierarchy:</span> <span className="text-slate-300">{selectedTool.breadcrumbStructure.map(b => b.name).join(" > ")}</span></div>
              </div>

              {/* Box 5: Internal Links Graph (Span 2) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 md:col-span-2 space-y-3">
                <div className="font-bold text-slate-300 text-xs border-b border-slate-800 pb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Internal Link Graph</span>
                  <span>{selectedTool.incomingInternalLinkCount} Inbound / {selectedTool.outgoingInternalLinkCount} Outbound</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-semibold mb-1 block">Inbound Links ({selectedTool.incomingInternalLinks.length}):</span>
                    <ul className="space-y-1 text-[11px] text-slate-300 max-h-36 overflow-y-auto">
                      {selectedTool.incomingInternalLinks.map((link, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-slate-500 capitalize">[{link.sourceType}]</span>
                          <span>{link.anchorText}</span>
                        </li>
                      ))}
                      {selectedTool.incomingInternalLinks.length === 0 && (
                        <li className="text-rose-400">No direct inbound links found.</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold mb-1 block">Related Tools Linked Out ({selectedTool.relatedTools.length}):</span>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {selectedTool.relatedTools.map((rel, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                          /{rel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 6: Visible Content Sections (Span 2) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 md:col-span-2 space-y-3">
                <div className="font-bold text-slate-300 text-xs border-b border-slate-800 pb-1.5 uppercase tracking-wider">
                  Visible Page Sections ({selectedTool.faqSections.length})
                </div>
                <div className="space-y-2">
                  {selectedTool.faqSections.map((sec, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="font-bold text-white text-xs mb-1 flex items-center justify-between">
                        <span>{sec.title}</span>
                        {sec.questionCount > 0 && (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            ~{sec.questionCount} Questions
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {sec.contentSnippet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Close CTA */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTool(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
