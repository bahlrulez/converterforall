import { MetadataRoute } from 'next'
import { getCanonicalToolSlugs, toolsDatabase } from '@/lib/tools-db'
import { getAllBlogSlugs } from '@/lib/blog-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.converterforall.com'
  
  // Base routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/accessibility',
    '/cookie-policy',
    '/editorial-policy',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Category routes
  const categoryRoutes = Object.keys(toolsDatabase).map((categorySlug) => ({
    url: `${baseUrl}/category/${categorySlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Canonical Tool routes (Only unique primary tools, no duplicate alias spam)
  const toolSlugs = getCanonicalToolSlugs()
  const toolRoutes = toolSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Blog routes
  const blogSlugs = getAllBlogSlugs()
  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...categoryRoutes, ...toolRoutes, ...blogRoutes]
}
