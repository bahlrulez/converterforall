import { NextRequest, NextResponse } from "next/server";
import { getToolReviewStats, saveToolReview, incrementHelpfulCount } from "@/lib/reviews-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolSlug = searchParams.get("toolSlug");

    if (!toolSlug) {
      return NextResponse.json(
        { error: "Missing toolSlug parameter" },
        { status: 400 }
      );
    }

    const stats = await getToolReviewStats(toolSlug);
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/reviews:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolSlug, rating, comment, userName, userEmail, feedbackType, deviceInfo, action, reviewId } = body;

    // Handle helpful upvotes
    if (action === "helpful" && reviewId && toolSlug) {
      const newCount = await incrementHelpfulCount(reviewId, toolSlug);
      return NextResponse.json({ success: true, helpfulCount: newCount });
    }

    if (!toolSlug) {
      return NextResponse.json(
        { error: "toolSlug is required" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Valid rating between 1 and 5 is required" },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide your feedback or comments" },
        { status: 400 }
      );
    }

    // Basic length check
    if (comment.length > 2000) {
      return NextResponse.json(
        { error: "Feedback comment cannot exceed 2000 characters" },
        { status: 400 }
      );
    }

    const savedReview = await saveToolReview({
      toolSlug,
      rating: Number(rating),
      comment: comment.trim(),
      userName: userName ? String(userName).slice(0, 80) : undefined,
      userEmail: userEmail ? String(userEmail).slice(0, 120) : undefined,
      feedbackType: feedbackType ? String(feedbackType).slice(0, 50) : undefined,
      deviceInfo: deviceInfo ? String(deviceInfo).slice(0, 200) : undefined,
    });

    const updatedStats = await getToolReviewStats(toolSlug);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your feedback has been recorded.",
        review: savedReview,
        stats: updatedStats,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/reviews:", error);
    return NextResponse.json(
      { error: "Unable to process feedback submission at this time" },
      { status: 500 }
    );
  }
}
