import { test, expect } from "@playwright/test";
import { toolsDatabase } from "../src/lib/tools-db";
import {
  filterGroupedCategoryTools,
  countGroupedCategoryTools,
  GroupedCategoryTools,
} from "../src/components/category/category-tools-grid";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3005";

test.describe("Category-Specific Search on /category/fonts", () => {
  test("1. Search helper normalizes case, spaces, and hyphens across title, description, and slug", () => {
    const sampleGroups: GroupedCategoryTools = {
      Punjabi: [
        {
          slug: "asees-to-unicode",
          title: "Asees to Unicode Converter",
          description: "Convert Asees-encoded Punjabi text into Gurmukhi Unicode.",
        },
        {
          slug: "unicode-to-asees",
          title: "Unicode to Asees Converter",
          description: "Convert pasted Unicode Punjabi text into character codes for Asees.",
        },
        {
          slug: "unicode-to-joy",
          title: "Unicode to Joy Converter",
          description: "Convert pasted Unicode Punjabi text into character codes for Joy.",
        },
        {
          slug: "anmollipi-to-unicode",
          title: "AnmolLipi to Unicode Converter",
          description: "Convert AnmolLipi-encoded Punjabi text into Gurmukhi Unicode.",
        },
        {
          slug: "gurbani-akhar-to-unicode",
          title: "Gurbani Akhar to Unicode Converter",
          description: "Convert pasted text intended for GurbaniLipi profile into Unicode.",
        },
      ],
      Hindi: [
        {
          slug: "krutidev-to-unicode",
          title: "Kruti Dev to Unicode Converter",
          description: "Convert legacy Kruti Dev 010 font text to standard Unicode.",
        },
      ],
    };

    const aseesFiltered = filterGroupedCategoryTools(sampleGroups, "unicode to asees");
    expect(Object.keys(aseesFiltered)).toEqual(["Punjabi"]);
    expect(aseesFiltered.Punjabi.map((t) => t.slug)).toEqual(["unicode-to-asees"]);

    const joinedAnmol = filterGroupedCategoryTools(sampleGroups, "Anmol Lipi");
    expect(joinedAnmol.Punjabi.map((t) => t.slug)).toEqual(["anmollipi-to-unicode"]);

    const joinedGurbani = filterGroupedCategoryTools(sampleGroups, "GurbaniAkhar");
    expect(joinedGurbani.Punjabi.map((t) => t.slug)).toEqual(["gurbani-akhar-to-unicode"]);

    const separatedGurbani = filterGroupedCategoryTools(sampleGroups, "Gurbani Akhar");
    expect(separatedGurbani.Punjabi.map((t) => t.slug)).toEqual(["gurbani-akhar-to-unicode"]);

    const hyphenFiltered = filterGroupedCategoryTools(sampleGroups, "unicode-to-joy");
    expect(hyphenFiltered.Punjabi.map((t) => t.slug)).toEqual(["unicode-to-joy"]);

    const descFiltered = filterGroupedCategoryTools(sampleGroups, "010 font text");
    expect(Object.keys(descFiltered)).toEqual(["Hindi"]);
    expect(descFiltered.Hindi.map((t) => t.slug)).toEqual(["krutidev-to-unicode"]);

    const emptyFiltered = filterGroupedCategoryTools(sampleGroups, "unmatched-term");
    expect(countGroupedCategoryTools(emptyFiltered)).toBe(0);
  });

  test("2. Desktop /category/fonts filters converters immediately, preserves links/metadata, and handles empty/clear", async ({
    page,
  }) => {
    const totalFontTools = Object.keys(toolsDatabase.fonts).length;

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/category/fonts`);

    // Metadata and canonical preserved
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.converterforall.com/category/fonts"
    );

    const searchInput = page.getByPlaceholder("Search font converters...");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("aria-label", "Search font converters");

    const grid = page.getByTestId("category-tools-grid");
    const status = page.locator('[role="status"][aria-live="polite"]');
    await expect(status).toContainText(`Showing ${totalFontTools} tools`);

    // 2.1 Search "Asees"
    await searchInput.fill("Asees");
    await expect(grid.locator('a[href="/asees-to-unicode"]')).toBeVisible();
    await expect(grid.locator('a[href="/unicode-to-asees"]')).toBeVisible();
    await expect(grid.locator('a[href="/unicode-to-joy"]')).toHaveCount(0);
    await expect(status).toContainText('for "Asees"');

    // 2.2 Search "unicode to joy" (space vs hyphen normalization)
    await searchInput.fill("unicode to joy");
    await expect(grid.locator('a[href="/unicode-to-joy"]')).toBeVisible();
    await expect(grid.locator('a[href="/joy-to-unicode"]')).toHaveCount(0);
    await expect(status).toContainText(`Showing 1 of ${totalFontTools} tools for "unicode to joy"`);

    // 2.3 Search "AnmolLipi" & separated "Anmol Lipi" (both directions appear)
    await searchInput.fill("AnmolLipi");
    await expect(grid.locator('a[href="/anmollipi-to-unicode"]')).toBeVisible();
    await expect(grid.locator('a[href="/unicode-to-anmollipi"]')).toBeVisible();

    await searchInput.fill("Anmol Lipi");
    await expect(grid.locator('a[href="/anmollipi-to-unicode"]')).toBeVisible();
    await expect(grid.locator('a[href="/unicode-to-anmollipi"]')).toBeVisible();

    // 2.3b Search joined "GurbaniAkhar" & separated "Gurbani Akhar"
    await searchInput.fill("GurbaniAkhar");
    await expect(grid.locator('a[href="/gurbani-akhar-to-unicode"]')).toBeVisible();
    await expect(grid.locator('a[href="/asees-to-unicode"]')).toHaveCount(0);

    await searchInput.fill("Gurbani Akhar");
    await expect(grid.locator('a[href="/gurbani-akhar-to-unicode"]')).toBeVisible();

    // 2.4 Search unmatched term -> empty state
    await searchInput.fill("no-matching-font-xyz");
    await expect(status).toContainText(`Showing 0 of ${totalFontTools} tools for "no-matching-font-xyz"`);
    await expect(page.getByText('No matching converters found for "no-matching-font-xyz"')).toBeVisible();
    await expect(grid).toHaveCount(0);

    // 2.5 Clear search via button -> all original cards return
    await page.getByRole("button", { name: "Clear search" }).first().click();
    await expect(searchInput).toHaveValue("");
    await expect(status).toContainText(`Showing ${totalFontTools} tools`);
    await expect(grid.locator('a[href="/krutidev-to-unicode"]')).toBeVisible();
    await expect(grid.locator('a[href="/unicode-to-raavi"]')).toBeVisible();

    // 2.6 Escape key clears active query
    await searchInput.fill("Satluj");
    await expect(grid.locator('a[href="/satluj-to-unicode"]')).toBeVisible();
    await expect(grid.locator('a[href="/asees-to-unicode"]')).toHaveCount(0);
    await searchInput.press("Escape");
    await expect(searchInput).toHaveValue("");
    await expect(status).toContainText(`Showing ${totalFontTools} tools`);
  });

  test("3. Mobile /category/fonts renders cleanly without horizontal overflow and filters accurately", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/category/fonts`);

    const searchInput = page.getByPlaceholder("Search font converters...");
    await expect(searchInput).toBeVisible();

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasOverflow).toBe(false);

    const grid = page.getByTestId("category-tools-grid");
    await searchInput.fill("unicode to asees");
    await expect(grid.locator('a[href="/unicode-to-asees"]')).toBeVisible();
    await expect(grid.locator('a[href="/asees-to-unicode"]')).toHaveCount(0);
  });

  test("4. Other category pages do not show font-specific search and retain card grids", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/category/utilities`);
    await expect(page.getByPlaceholder("Search font converters...")).toHaveCount(0);
    await expect(page.getByTestId("category-tools-grid").locator('a[href="/qr-generator"]')).toBeVisible();

    await page.goto(`${BASE_URL}/category/developer`);
    await expect(page.getByPlaceholder("Search font converters...")).toHaveCount(0);
    await expect(page.getByTestId("category-tools-grid").locator("h2", { hasText: "Tokens & Security" })).toBeVisible();
    await expect(page.getByTestId("category-tools-grid").locator('a[href="/jwt-decoder"]')).toBeVisible();
  });
});
