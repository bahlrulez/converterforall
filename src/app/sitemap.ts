import { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/seo/site-config'
import { getCanonicalToolSlugs, toolsDatabase } from '@/lib/tools-db'
import { getAllBlogSlugs, blogDatabase } from '@/lib/blog-data'
import { TOOLS } from '@/config/tools'
import {
  NOINDEX_CATEGORIES,
  PAGE_LASTMOD_DATES,
  TIER_C_NOINDEX_SLUGS,
  getPageLastModified,
  getToolLastModified
} from '@/config/sitemap-lastmod'

export const BASE_SITEMAP_ROUTES = [
  '',
  '/tools',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/accessibility',
  '/cookie-policy',
  '/editorial-policy',
  '/blog',
] as const

function getBlogLastModified(slug: string): Date {
  const post = blogDatabase[slug]
  if (post?.updatedAt) {
    const raw = post.updatedAt.includes('T') || post.updatedAt.includes('UTC') ? post.updatedAt : `${post.updatedAt} UTC`
    const parsed = new Date(raw)
    if (!isNaN(parsed.getTime())) return parsed
  }
  if (post?.date) {
    const raw = post.date.includes('T') || post.date.includes('UTC') ? post.date : `${post.date} UTC`
    const parsed = new Date(raw)
    if (!isNaN(parsed.getTime())) return parsed
  }
  return getPageLastModified(`/blog/${slug}`)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_ORIGIN
  
  const routes = BASE_SITEMAP_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: getPageLastModified(route || '/'),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Category routes: only indexable hubs; excluded hubs carry an explicit noindex directive.
  const noindexCatSet = new Set<string>(NOINDEX_CATEGORIES)
  const categoryRoutes = Object.keys(toolsDatabase)
    .filter((catSlug) => !noindexCatSet.has(catSlug))
    .map((categorySlug) => {
      const recordedLastModified = PAGE_LASTMOD_DATES[`/category/${categorySlug}`];
      return {
        url: `${baseUrl}/category/${categorySlug}`,
        ...(recordedLastModified ? { lastModified: new Date(`${recordedLastModified}T00:00:00Z`) } : {}),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      };
    })

  // Canonical Tool routes (Exclude Tier C noindexed tools and unverified font tools)
  const unverifiedSlugs = new Set([
    'chanakya-to-unicode',
    'unicode-to-chanakya'
  ])
  const dbSlugs = getCanonicalToolSlugs()
  const configSlugs = Object.values(TOOLS).map(t => t.path.replace(/^\//, ''))
  const toolSlugs = Array.from(new Set([...dbSlugs, ...configSlugs]))
    .filter((slug) => !TIER_C_NOINDEX_SLUGS.has(slug) && !unverifiedSlugs.has(slug))
  
  const toolRoutes = toolSlugs.map((slug) => {
    const lastModified = getToolLastModified(slug);
    return {
      url: `${baseUrl}/${slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  })

  // Blog routes
  const blogSlugs = getAllBlogSlugs()
  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: getBlogLastModified(slug),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...categoryRoutes, ...toolRoutes, ...blogRoutes]
}

