type SearchResult = {
  title: string
  path: string
  description?: string
}

type PagefindModule = {
  init: () => Promise<void>
  search: (query: string) => Promise<{
    results: Array<{
      data: () => Promise<{
        url: string
        excerpt?: string
        meta?: { title?: string, description?: string }
      }>
    }>
  }>
}

let pagefindModule: PagefindModule | null | undefined

async function getPagefind() {
  if (!import.meta.client) {
    return null
  }

  if (pagefindModule !== undefined) {
    return pagefindModule
  }

  try {
    const module = await import(/* @vite-ignore */ '/pagefind/pagefind.js') as PagefindModule
    await module.init()
    pagefindModule = module
    return module
  } catch {
    pagefindModule = null
    return null
  }
}

function toSearchResult(
  item: { url: string, excerpt?: string, meta?: { title?: string, description?: string } },
  locale: string,
): SearchResult {
  const path = item.url.replace(`/${locale}`, '') || '/getting-started'

  return {
    title: item.meta?.title || path,
    path,
    description: item.meta?.description || item.excerpt,
  }
}

export function useDocsSearch() {
  async function searchDocs(query: string, locale: string): Promise<SearchResult[]> {
    const q = query.trim()
    if (q.length < 2) {
      return []
    }

    const pagefind = await getPagefind()
    if (pagefind) {
      const response = await pagefind.search(q)
      const items = await Promise.all(response.results.slice(0, 24).map(result => result.data()))

      return items
        .filter(item => item.url.includes(`/${locale}/`))
        .slice(0, 12)
        .map(item => toSearchResult(item, locale))
    }

    return $fetch<SearchResult[]>('/api/search', {
      query: { q, locale },
    })
  }

  return { searchDocs }
}
