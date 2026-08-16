import { defineNuxtModule } from '@nuxt/kit'
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'

type SearchIndexEntry = {
  title: string
  path: string
  description?: string
  body: string
}

const LOCALES = ['en', 'ar'] as const

function walkMarkdownFiles(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath))
      continue
    }

    if (entry.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

function parseMarkdownFile(filePath: string, contentRoot: string): SearchIndexEntry {
  const raw = readFileSync(filePath, 'utf8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)

  const frontmatter = match?.[1] ?? ''
  const body = match?.[2] ?? raw

  const title = frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim()
    || basename(filePath, '.md')
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim()

  const slug = relative(contentRoot, filePath)
    .replace(/\\/g, '/')
    .replace(/\.md$/, '')

  return {
    title,
    path: `/${slug}`,
    description,
    body: body.replace(/[:{}[\]()!#>*_`~-]/g, ' ').replace(/\s+/g, ' ').trim(),
  }
}

function buildLocaleIndex(rootDir: string, locale: string): SearchIndexEntry[] {
  const contentRoot = join(rootDir, 'content', locale)

  return walkMarkdownFiles(contentRoot)
    .map(filePath => parseMarkdownFile(filePath, contentRoot))
    .sort((a, b) => a.title.localeCompare(b.title))
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildSitemap(siteUrl: string, rootDir: string) {
  const base = siteUrl.replace(/\/$/, '')
  const docPaths = new Set<string>()

  for (const locale of LOCALES) {
    for (const entry of buildLocaleIndex(rootDir, locale)) {
      docPaths.add(entry.path)
    }
  }

  const routes = [
    ...LOCALES.map(locale => `/${locale}`),
    ...[...docPaths].flatMap(path => LOCALES.map(locale => `/${locale}${path}`)),
  ]

  const urlEntries = routes.map((routePath) => {
    const loc = `${base}${routePath}`
    const suffix = routePath.replace(/^\/(en|ar)/, '') || ''
    const alternates = LOCALES.map(locale => (
      `    <xhtml:link rel="alternate" hreflang="${locale === 'en' ? 'en' : 'ar'}" href="${base}/${locale}${suffix}" />`
    )).join('\n')

    const priority = suffix === '' ? '1.0' : suffix === '/getting-started' ? '0.9' : '0.7'

    return [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      alternates,
      '    <xhtml:link rel="alternate" hreflang="x-default" href="' + escapeXml(`${base}/en${suffix}`) + '" />',
      '    <changefreq>weekly</changefreq>',
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urlEntries.join('\n'),
    '</urlset>',
  ].join('\n')
}

function buildRobots(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '')

  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${base}/sitemap.xml`,
  ].join('\n')
}

export default defineNuxtModule({
  meta: {
    name: 'search-index',
  },
  setup(_options, nuxt) {
    nuxt.hooks.hook('build:before', () => {
      const publicDir = join(nuxt.options.rootDir, 'public')
      mkdirSync(publicDir, { recursive: true })

      const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://docs.daqiqerp.com'

      for (const locale of LOCALES) {
        const index = buildLocaleIndex(nuxt.options.rootDir, locale)
        writeFileSync(
          join(publicDir, `search-index.${locale}.json`),
          JSON.stringify(index),
        )
      }

      writeFileSync(join(publicDir, 'sitemap.xml'), buildSitemap(siteUrl, nuxt.options.rootDir))
      writeFileSync(join(publicDir, 'robots.txt'), buildRobots(siteUrl))
    })
  },
})
