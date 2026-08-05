import { defineNuxtModule } from '@nuxt/kit'
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'

type SearchIndexEntry = {
  title: string
  path: string
  description?: string
  body: string
}

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

function parseMarkdownFile(filePath: string, locale: string, contentRoot: string): SearchIndexEntry {
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
    .map(filePath => parseMarkdownFile(filePath, locale, contentRoot))
    .sort((a, b) => a.title.localeCompare(b.title))
}

export default defineNuxtModule({
  meta: {
    name: 'search-index',
  },
  setup(_options, nuxt) {
    nuxt.hooks.hook('build:before', () => {
      const publicDir = join(nuxt.options.rootDir, 'public')
      mkdirSync(publicDir, { recursive: true })

      for (const locale of ['en', 'ar']) {
        const index = buildLocaleIndex(nuxt.options.rootDir, locale)
        writeFileSync(
          join(publicDir, `search-index.${locale}.json`),
          JSON.stringify(index),
        )
      }
    })
  },
})
