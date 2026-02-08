import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/uuid',
    '/password',
    '/json',
    '/base64',
    '/jwt',
    '/epoch',
    '/hash',
    '/regex',
    '/diff',
    '/url',
    '/color',
    '/editor',
    '/http',
    '/crontab',
    '/image',
    '/sql',
  ].map((route) => ({
    url: `https://labs.zekhoi.dev${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
