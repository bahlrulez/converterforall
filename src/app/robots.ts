import { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/seo/site-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/og',
        '/og/',
      ],
      disallow: [
        '/api/', 
        '/private/',
        '/admin/'
      ],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  }
}
