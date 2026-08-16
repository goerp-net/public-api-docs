import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

interface SiteSeoOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  type?: 'website' | 'article'
}

export function useSiteSeo(options: SiteSeoOptions) {
  const { locale } = useI18n()
  const route = useRoute()
  const config = useRuntimeConfig()

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    ogTitle: () => toValue(options.title),
    ogDescription: () => toValue(options.description),
    ogType: options.type ?? 'website',
    ogUrl: () => `${String(config.public.siteUrl).replace(/\/$/, '')}${route.path}`,
    ogSiteName: 'daqiq API Documentation',
    ogLocale: () => (locale.value === 'ar' ? 'ar_SA' : 'en_US'),
    twitterCard: 'summary',
    twitterTitle: () => toValue(options.title),
    twitterDescription: () => toValue(options.description),
    robots: 'index, follow, max-image-preview:large',
  })
}

export function useDocStructuredData(page: {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
}) {
  const { locale } = useI18n()
  const config = useRuntimeConfig()
  const route = useRoute()

  useHead(() => {
    const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
    const pageUrl = `${siteUrl}${route.path}`
    const inLanguage = locale.value === 'ar' ? 'ar-SA' : 'en-US'

    return {
      script: [{
        type: 'application/ld+json',
        key: 'doc-schema',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: toValue(page.title),
          description: toValue(page.description),
          url: pageUrl,
          inLanguage,
          isPartOf: {
            '@type': 'WebSite',
            name: 'daqiq API Documentation',
            url: siteUrl,
          },
          publisher: {
            '@type': 'Organization',
            name: 'daqiq',
            url: 'https://daqiqerp.com',
          },
        }),
      }],
    }
  })
}
