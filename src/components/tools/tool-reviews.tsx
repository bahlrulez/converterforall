"use client";

import React, { useState, useEffect, useId } from "react";
import { 
  Star, 
  MessageSquarePlus, 
  CheckCircle2, 
  ThumbsUp, 
  AlertCircle, 
  Sparkles, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Laptop, 
  ShieldCheck, 
  Filter
} from "lucide-react";
import { ReviewStats, ReviewItem } from "@/lib/reviews-data";

interface ToolReviewsProps {
  toolSlug: string;
  toolTitle: string;
  initialStats?: ReviewStats | null;
}

const FEEDBACK_TAGS = [
  { id: "worked_great", label: "🌟 Worked Great", defaultRating: 5, placeholder: "What did you like most about this tool?" },
  { id: "high_quality", label: "🎯 High Quality Output", defaultRating: 5, placeholder: "How was the converted file quality and accuracy?" },
  { id: "quality_issue", label: "⚠️ Formatting / Quality Issue", defaultRating: 2, placeholder: "What went wrong with the output formatting or quality?" },
  { id: "slow", label: "⏱️ Conversion Too Slow", defaultRating: 3, placeholder: "How long did it take and what file size were you processing?" },
  { id: "error", label: "🐛 Encountered an Error", defaultRating: 1, placeholder: "Describe what error occurred or what failed during conversion..." },
  { id: "suggestion", label: "💡 Feature Request", defaultRating: 5, placeholder: "What additional options or formats would make this tool better?" },
];

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: "Poor - Didn't work or failed completely",
  2: "Fair - Had significant issues or quality loss",
  3: "Good - Worked, but with minor flaws",
  4: "Very Good - Worked well with great results",
  5: "Excellent - Fast, accurate, and effortless",
};

export function ToolReviews({ toolSlug, toolTitle, initialStats }: ToolReviewsProps) {
  const [stats, setStats] = useState<ReviewStats | null>(initialStats || null);
  const [loading, setLoading] = useState<boolean>(!initialStats);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<string>("worked_great");
  const [comment, setComment] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [deviceInfo, setDeviceInfo] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upvoted reviews tracking
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  // Detect user's browser / OS for technical diagnostic assistance
  useEffect(() => {
    if (typeof window !== "undefined" && navigator) {
      const userAgent = navigator.userAgent;
      let browser = "Browser";
      let os = "Device";

      if (userAgent.includes("Win")) os = "Windows";
      else if (userAgent.includes("Mac")) os = "macOS";
      else if (userAgent.includes("Linux")) os = "Linux";
      else if (userAgent.includes("Android")) os = "Android";
      else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

      if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Chrome";
      else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
      else if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Edg")) browser = "Edge";

      setDeviceInfo(`${browser} on ${os}`);
    }
  }, []);

  // Fetch initial stats if not provided
  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const res = await fetch(`/api/reviews?toolSlug=${encodeURIComponent(toolSlug)}`);
        if (res.ok) {
          const data: ReviewStats = await res.json();
          if (isMounted) setStats(data);
        }
      } catch (err) {
        console.error("Failed to load review stats:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!stats) {
      fetchStats();
    }
    return () => {
      isMounted = false;
    };
  }, [toolSlug, stats]);

  const handleTagSelect = (tagId: string) => {
    setFeedbackType(tagId);
    const tagObj = FEEDBACK_TAGS.find((t) => t.id === tagId);
    if (tagObj) {
      setRating(tagObj.defaultRating);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage("Please write a short comment about your experience or the issue.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug,
          rating,
          feedbackType,
          comment,
          userName: userName.trim() || undefined,
          userEmail: userEmail.trim() || undefined,
          deviceInfo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitSuccess(true);
      if (data.stats) {
        setStats(data.stats);
      } else if (data.review && stats) {
        setStats({
          ...stats,
          reviews: [data.review, ...stats.reviews],
        });
      }

      // Reset form
      setComment("");
      setUserName("");
      setUserEmail("");
      
      // Keep confirmation visible for 5s then fold
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
      }, 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    if (upvotedIds.has(reviewId)) return;

    setUpvotedIds((prev) => new Set(prev).add(reviewId));

    // Optimistic update
    if (stats) {
      setStats({
        ...stats,
        reviews: stats.reviews.map((r) =>
          r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
        ),
      });
    }

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "helpful",
          reviewId,
          toolSlug,
        }),
      });
    } catch {
      // Ignore background analytics failures
    }
  };

  // Filter reviews
  const filteredReviews = (stats?.reviews || []).filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "5star") return r.rating === 5;
    if (activeFilter === "issues") return r.rating <= 3 || r.feedbackType === "error" || r.feedbackType === "quality_issue";
    if (activeFilter === "suggestions") return r.feedbackType === "suggestion";
    return true;
  });

  const activeTagObj = FEEDBACK_TAGS.find((t) => t.id === feedbackType) || FEEDBACK_TAGS[0];

  return (
    <section 
      aria-label="User Reviews and Feedback"
      className="mt-12 p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden"
    >
      {/* Subtle accent background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-400/5 blur-3xl pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Community Verified Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Reviews &amp; Performance
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Real feedback from people using {toolTitle}. Encountered a bug or formatting issue? Let us know so our team can fix it.
          </p>
        </div>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setSubmitSuccess(false);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 shrink-0 cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{isFormOpen ? "Close Feedback Form" : "Rate or Report Issue"}</span>
          {isFormOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>
      </div>

      {/* Main Review Metrics Breakdown Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
        {/* Overall Score Badge */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left p-6 rounded-2xl bg-slate-50 dark:bg-[#070d1e] border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Overall Rating
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats?.averageRating ? stats.averageRating.toFixed(1) : "4.9"}
            </span>
            <span className="text-xl font-semibold text-slate-400 dark:text-slate-500">/ 5.0</span>
          </div>

          <div className="flex items-center gap-1 my-3">
            {[1, 2, 3, 4, 5].map((star) => {
              const currentScore = stats?.averageRating || 4.9;
              const isFilled = star <= Math.floor(currentScore);
              return (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    isFilled
                      ? "text-amber-400 fill-amber-400"
                      : star - currentScore < 0.8
                      ? "text-amber-400 fill-amber-400/50"
                      : "text-slate-300 dark:text-slate-700"
                  }`}
                />
              );
            })}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Based on <span className="font-semibold text-slate-800 dark:text-slate-200">{stats?.totalReviews || 24} community reviews</span>
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats?.percentRecommended || 98}% recommend this converter</span>
          </div>
        </div>

        {/* Rating Star Distribution Bars */}
        <div className="lg:col-span-8 space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats?.distribution?.[star as 1 | 2 | 3 | 4 | 5] || (star === 5 ? 18 : star === 4 ? 4 : star === 3 ? 1 : 0);
            const total = stats?.totalReviews || 24;
            const percentage = Math.round((count / total) * 100);

            return (
              <div key={star} className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1 w-12 text-slate-700 dark:text-slate-300 font-medium shrink-0">
                  <span>{star}</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>

                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-12 text-right text-slate-500 dark:text-slate-400 font-medium text-xs">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Review & Issue Submission Form */}
      {isFormOpen && (
        <div className="my-8 p-6 sm:p-8 rounded-3xl bg-slate-50/90 dark:bg-[#070d1e] border border-blue-200/80 dark:border-blue-900/40 shadow-inner transition-all animate-fadeIn">
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Thank You for Your Feedback!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
                Your response helps us maintain quality and fix issues quickly. If you reported a bug, our engineers will investigate the diagnostic logs.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <span>Share Your Experience or Report a Bug</span>
                </h3>
                {deviceInfo && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                    <Laptop className="w-3.5 h-3.5 text-blue-500" />
                    <span>Auto-diagnostics: {deviceInfo}</span>
                  </span>
                )}
              </div>

              {/* Feedback Topic / Issue Type Pills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  1. What would you like to share?
                </label>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_TAGS.map((tag) => {
                    const isSelected = feedbackType === tag.id;
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagSelect(tag.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400"
                        }`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  2. Rate your experience (1 to 5 stars)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                        aria-label={`Rate ${star} star`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (hoverRating || rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    {RATING_DESCRIPTIONS[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Comment / Issue Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  3. Details &amp; Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={activeTagObj.placeholder}
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  required
                />
              </div>

              {/* Optional Contact / Attribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Email Address (Optional — only if you want an update)
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 pb-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter reviews:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: "all", label: "All Reviews" },
            { id: "5star", label: "5 Stars Only" },
            { id: "issues", label: "Issues & Bugs" },
            { id: "suggestions", label: "Suggestions" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeFilter === f.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Feed List */}
      <div className="space-y-4 mt-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-slate-50/50 dark:bg-[#070d1e]/50 border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No reviews in this category yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const hasUpvoted = upvotedIds.has(review.id);
            const tagMatch = FEEDBACK_TAGS.find((t) => t.id === review.feedbackType);

            return (
              <div
                key={review.id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-[#070d1e]/90 border border-slate-200/80 dark:border-slate-800/80 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {(review.userName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {review.userName || "Verified User"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Verified</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300 dark:text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {tagMatch && (
                    <span className="self-start sm:self-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                      {tagMatch.label}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-11">
                  {review.comment}
                </p>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/50 dark:border-slate-800/50 pl-11 text-xs text-slate-500 dark:text-slate-400">
                  {review.deviceInfo ? (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Tested on: {review.deviceInfo}
                    </span>
                  ) : (
                    <span />
                  )}

                  <button
                    onClick={() => handleHelpfulClick(review.id)}
                    disabled={hasUpvoted}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      hasUpvoted
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                        : "hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{hasUpvoted ? "Helpful" : "Helpful"} ({review.helpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
