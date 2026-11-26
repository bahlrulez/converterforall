import { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo/site-config";
import { INDEXABLE_PATHS } from "@/lib/seo-allowlist";
import { blogDatabase } from "@/lib/blog-data";
import {
  PAGE_LASTMOD_DATES,
  getPageLastModified,
  getToolLastModified,
} from "@/config/sitemap-lastmod";

export const BASE_SITEMAP_ROUTES = [
  "",
  "/tools",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
] as const;

function getBlogLastModified(slug: string): Date {
  const post = blogDatabase[slug];
  if (post?.updatedAt) {
    const raw =
      post.updatedAt.includes("T") || post.updatedAt.includes("UTC")
        ? post.updatedAt
        : `${post.updatedAt} UTC`;
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  if (post?.date) {
    const raw =
      post.date.includes("T") || post.date.includes("UTC")
        ? post.date
        : `${post.date} UTC`;
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return getPageLastModified(`/blog/${slug}`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_ORIGIN;

  return INDEXABLE_PATHS.map((path) => {
    const cleanPath = path === "/" ? "" : path;
    const url = `${baseUrl}${cleanPath}`;

    if (path.startsWith("/blog/")) {
      const slug = path.replace("/blog/", "");
      return {
        url,
        lastModified: getBlogLastModified(slug),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    }

    if (
      path === "/" ||
      path === "/tools" ||
      path === "/blog" ||
      path === "/about" ||
      path === "/contact" ||
      path === "/privacy" ||
      path === "/terms"
    ) {
      return {
        url,
        lastModified: getPageLastModified(path),
        changeFrequency: "weekly" as const,
        priority: path === "/" ? 1 : 0.8,
      };
    }

    if (path.startsWith("/category/")) {
      const recorded = PAGE_LASTMOD_DATES[path];
      return {
        url,
        ...(recorded ? { lastModified: new Date(`${recorded}T00:00:00Z`) } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      };
    }

    const slug = path.replace(/^\//, "");
    const lastModified =
      getToolLastModified(slug) ||
      (PAGE_LASTMOD_DATES[path] ? getPageLastModified(path) : undefined);

    return {
      url,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    };
  });
}
