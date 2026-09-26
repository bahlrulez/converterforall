import { getToolReviewStats, saveToolReview } from "../src/lib/reviews-data";

async function runTests() {
  console.log("Running reviews data tests...");
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, msg: string) => {
    if (condition) {
      console.log(`✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${msg}`);
      failed++;
    }
  };

  try {
    const slug = `test-tool-${Date.now()}`;
    
    // A. zero real reviews -> no aggregateRating data (stats are 0)
    const zeroStats = await getToolReviewStats(slug);
    assert(zeroStats.totalReviews === 0, "A. totalReviews should be 0 when no reviews exist");
    assert(zeroStats.averageRating === 0, "A. averageRating should be 0 when no reviews exist");
    assert(zeroStats.percentRecommended === 0, "A. percentRecommended should be 0 when no reviews exist");
    assert(zeroStats.distribution[5] === 0, "D. synthetic baseWeights cannot affect result (5 stars is 0)");

    // B. one real 5-star review -> ratingValue = 5, count = 1
    await saveToolReview({
      toolSlug: slug,
      rating: 5,
      comment: "Amazing tool",
    });
    
    const oneStats = await getToolReviewStats(slug);
    assert(oneStats.totalReviews === 1, "B. totalReviews should be 1 after one review");
    assert(oneStats.averageRating === 5, "B. averageRating should be 5 after one 5-star review");
    
    // C. multiple real ratings -> correct weighted average
    await saveToolReview({
      toolSlug: slug,
      rating: 1,
      comment: "Terrible tool",
    });
    await saveToolReview({
      toolSlug: slug,
      rating: 3,
      comment: "Okay tool",
    });

    const multiStats = await getToolReviewStats(slug);
    assert(multiStats.totalReviews === 3, "C. totalReviews should be 3");
    // (5 + 1 + 3) / 3 = 9 / 3 = 3
    assert(multiStats.averageRating === 3, "C. averageRating should be 3.0");

    console.log(`\nTest Summary: ${passed} passed, ${failed} failed`);
    
    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
}

runTests();
