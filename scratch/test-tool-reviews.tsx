import React from "react";
import ReactDOMServer from "react-dom/server";
import { ToolReviews } from "../src/components/tools/tool-reviews";

function runTest() {
  console.log("Running ToolReviews component test...");

  // Test 1: Render with zero reviews
  const htmlZero = ReactDOMServer.renderToString(
    <ToolReviews
      toolSlug="test-slug"
      toolTitle="Test Tool"
      initialStats={{
        totalReviews: 0,
        averageRating: 0,
        percentRecommended: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        reviews: [],
      }}
    />
  );

  if (htmlZero.includes("No reviews yet") && htmlZero.includes("Be the first to share your experience with this tool")) {
    console.log("✅ PASS: Empty state renders correctly when totalReviews === 0");
  } else {
    console.error("❌ FAIL: Empty state did not render for zero reviews");
    process.exit(1);
  }

  // Test 2: Render with reviews
  const htmlWithReviews = ReactDOMServer.renderToString(
    <ToolReviews
      toolSlug="test-slug"
      toolTitle="Test Tool"
      initialStats={{
        totalReviews: 1,
        averageRating: 5,
        percentRecommended: 100,
        distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
        reviews: [],
      }}
    />
  );

  if (htmlWithReviews.includes("Overall Rating") && htmlWithReviews.includes("community reviews")) {
    console.log("✅ PASS: Breakdown state renders correctly when totalReviews > 0");
  } else {
    console.error("❌ FAIL: Breakdown state did not render for > 0 reviews");
    process.exit(1);
  }
}

runTest();
