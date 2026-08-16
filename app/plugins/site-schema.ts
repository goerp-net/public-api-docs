export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')

  useHead({
    script: [{
      type: 'application/ld+json',
      key: 'site-schema',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'daqiq API Documentation',
        url: siteUrl,
        inLanguage: ['en-US', 'ar-SA'],
        publisher: {
          '@type': 'Organization',
          name: 'daqiq',
          url: 'https://daqiqerp.com',
        },
      }),
    }],
  })
})
