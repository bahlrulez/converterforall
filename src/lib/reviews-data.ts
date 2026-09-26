import { getPrisma } from "./prisma";

export interface ReviewItem {
  id: string;
  toolSlug: string;
  rating: number;
  userName?: string | null;
  userEmail?: string | null;
  feedbackType?: string | null; // e.g. "worked_great", "high_quality", "slow", "error", "suggestion", "quality_issue"
  comment: string;
  deviceInfo?: string | null;
  isPublic: boolean;
  status: string;
  helpfulCount: number;
  createdAt: string; // ISO date string
  verified?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  percentRecommended: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews: ReviewItem[];
}

// Seed reviews removed as they were synthesized/not genuine user data

// In-memory runtime fallback storage for newly submitted reviews when database is unreachable
const memoryReviews: Record<string, ReviewItem[]> = {};

/**
 * Get reviews and aggregate stats for a specific tool slug
 */
export async function getToolReviewStats(toolSlug: string): Promise<ReviewStats> {
  let dbReviews: ReviewItem[] = [];

  try {
    const db = getPrisma();
    if (db) {
      const rawDbReviews = await db.toolReview.findMany({
        where: {
          toolSlug,
          status: "approved",
          isPublic: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      });

      if (rawDbReviews && rawDbReviews.length > 0) {
        dbReviews = rawDbReviews.map((r: any) => ({
          id: r.id,
          toolSlug: r.toolSlug,
          rating: r.rating,
          userName: r.userName || "Verified User",
          userEmail: r.userEmail,
          feedbackType: r.feedbackType || "worked_great",
          comment: r.comment,
          deviceInfo: r.deviceInfo,
          isPublic: r.isPublic,
          status: r.status,
          helpfulCount: r.helpfulCount,
          createdAt: typeof r.createdAt?.toISOString === "function" ? r.createdAt.toISOString() : new Date().toISOString(),
          verified: true,
        }));
      }
    }
  } catch {
    // Database query failed or table not yet migrated, fall back smoothly
  }

  // Combine DB reviews and memory reviews
  const memList = memoryReviews[toolSlug] || [];

  // Deduplicate by ID
  const allReviewsMap = new Map<string, ReviewItem>();
  
  // 1. Add DB reviews
  dbReviews.forEach((r) => allReviewsMap.set(r.id, r));
  // 2. Add Memory reviews
  memList.forEach((r) => allReviewsMap.set(r.id, r));

  const combinedReviews = Array.from(allReviewsMap.values());
  
  // Sort latest first
  combinedReviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Compute distribution & averages
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRatingSum = 0;
  let recommendedCount = 0;

  // Synthetic baseline weights removed to ensure only genuine reviews are calculated

  combinedReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] += 1;
    totalRatingSum += star;
    if (star >= 4) recommendedCount += 1;
  });

  const totalCalculatedReviews =
    distribution[5] +
    distribution[4] +
    distribution[3] +
    distribution[2] +
    distribution[1];

  const averageRating =
    totalCalculatedReviews > 0
      ? Number((totalRatingSum / totalCalculatedReviews).toFixed(1))
      : 0;

  const percentRecommended =
    totalCalculatedReviews > 0
      ? Math.round((recommendedCount / totalCalculatedReviews) * 100)
      : 0;

  return {
    averageRating,
    totalReviews: totalCalculatedReviews,
    percentRecommended,
    distribution,
    reviews: combinedReviews,
  };
}

/**
 * Save a new user review / issue report
 */
export async function saveToolReview(data: {
  toolSlug: string;
  rating: number;
  comment: string;
  userName?: string;
  userEmail?: string;
  feedbackType?: string;
  deviceInfo?: string;
}): Promise<ReviewItem> {
  const cleanName = (data.userName || "").trim() || "Community User";
  const cleanComment = (data.comment || "").trim();
  const cleanRating = Math.min(5, Math.max(1, Math.round(data.rating || 5)));
  const cleanFeedbackType = data.feedbackType || "worked_great";

  const newReviewItem: ReviewItem = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    toolSlug: data.toolSlug,
    rating: cleanRating,
    userName: cleanName,
    userEmail: data.userEmail || null,
    feedbackType: cleanFeedbackType,
    comment: cleanComment,
    deviceInfo: data.deviceInfo || null,
    isPublic: true,
    status: "approved",
    helpfulCount: 0,
    createdAt: new Date().toISOString(),
    verified: true,
  };

  // Attempt database insertion if available
  try {
    const db = getPrisma();
    if (db) {
      const dbRecord = await db.toolReview.create({
        data: {
          toolSlug: data.toolSlug,
          rating: cleanRating,
          userName: cleanName,
          userEmail: data.userEmail || null,
          feedbackType: cleanFeedbackType,
          comment: cleanComment,
          deviceInfo: data.deviceInfo || null,
          isPublic: true,
          status: "approved",
          helpfulCount: 0,
        },
      });

      if (dbRecord) {
        newReviewItem.id = dbRecord.id;
        newReviewItem.createdAt = dbRecord.createdAt.toISOString();
      }
    } else {
      if (!memoryReviews[data.toolSlug]) {
        memoryReviews[data.toolSlug] = [];
      }
      memoryReviews[data.toolSlug].unshift(newReviewItem);
    }
  } catch {
    if (!memoryReviews[data.toolSlug]) {
      memoryReviews[data.toolSlug] = [];
    }
    memoryReviews[data.toolSlug].unshift(newReviewItem);
  }

  return newReviewItem;
}

/**
 * Upvote a review helpful counter
 */
export async function incrementHelpfulCount(reviewId: string, toolSlug: string): Promise<number> {
  try {
    const db = getPrisma();
    if (db) {
      const updated = await db.toolReview.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      });
      return updated.helpfulCount;
    }
  } catch {
    // Fallback
  }

  // Fallback in memory
  const memList = memoryReviews[toolSlug] || [];
  const item = memList.find((r) => r.id === reviewId);
  if (item) {
    item.helpfulCount += 1;
    return item.helpfulCount;
  }
  return 1;
}
