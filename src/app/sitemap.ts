import { MetadataRoute } from 'next'
import { getAllToolSlugs } from '@/lib/tools-db'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://converterforall.com'
  
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

  // Tool routes
  const toolSlugs = getAllToolSlugs()
  const toolRoutes = toolSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...routes, ...toolRoutes]
}
