import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', 
        '/private/',
        '/_next/static/media/',
        '/*.woff2$',
        '/*.woff$',
        '/*.ttf$',
        '/*.eot$'
      ],
    },
    sitemap: 'https://converterforall.com/sitemap.xml',
  }
}
