// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    './modules/search-index',
  ],

  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',

  app: {
    head: {
      title: 'daqiq API Documentation',
      meta: [
        { name: 'description', content: 'Public API documentation for daqiq ERP integrations.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', dir: 'ltr', file: 'en.json' },
      { code: 'ar', language: 'ar-SA', name: 'العربية', dir: 'rtl', file: 'ar.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    langDir: '../i18n/locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'daqiq_docs_locale',
      redirectOn: 'root',
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-dark',
            dark: 'github-dark',
            light: 'github-light',
          },
        },
      },
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/en', '/ar'],
    },
  },
})
