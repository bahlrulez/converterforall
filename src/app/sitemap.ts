import { MetadataRoute } from 'next'
import { getCanonicalToolSlugs, toolsDatabase } from '@/lib/tools-db'
import { getAllBlogSlugs, blogDatabase } from '@/lib/blog-data'
import { TOOLS } from '@/config/tools'
import { 
  NOINDEX_CATEGORIES, 
  TIER_C_NOINDEX_SLUGS, 
  getPageLastModified,
  getToolLastModified
} from '@/config/sitemap-lastmod'

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
  const baseUrl = 'https://www.converterforall.com'
  
  // Base routes
  const basePaths = [
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
  ]

  const routes = basePaths.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: getPageLastModified(route || '/'),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Category routes (Only indexable categories; exclude 5 Tier C noindexed category hubs)
  const noindexCatSet = new Set<string>(NOINDEX_CATEGORIES)
  const categoryRoutes = Object.keys(toolsDatabase)
    .filter((catSlug) => !noindexCatSet.has(catSlug))
    .map((categorySlug) => ({
      url: `${baseUrl}/category/${categorySlug}`,
      lastModified: getPageLastModified(`/category/${categorySlug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

  // Canonical Tool routes (Exclude Tier C noindexed tools and unverified font tools)
  const unverifiedSlugs = new Set([
    'chanakya-to-unicode',
    'unicode-to-chanakya',
    'unicode-to-asees',
    'unicode-to-joy'
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

