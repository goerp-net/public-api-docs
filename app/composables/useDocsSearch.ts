type SearchResult = {
  title: string
  path: string
  description?: string
}

type SearchIndexEntry = SearchResult & {
  body: string
}

const indexCache: Partial<Record<string, SearchIndexEntry[]>> = {}

async function getStaticIndex(locale: string) {
  if (indexCache[locale]) {
    return indexCache[locale]!
  }

  try {
    indexCache[locale] = await $fetch<SearchIndexEntry[]>(`/search-index.${locale}.json`)
    return indexCache[locale]!
  } catch {
    return null
  }
}

function searchStaticIndex(index: SearchIndexEntry[], query: string): SearchResult[] {
  const q = query.toLowerCase()

  return index
    .filter((entry) => {
      const haystack = `${entry.title} ${entry.description || ''} ${entry.path} ${entry.body}`.toLowerCase()
      return haystack.includes(q)
    })
    .slice(0, 12)
    .map(({ title, path, description }) => ({ title, path, description }))
}

export function useDocsSearch() {
  async function searchDocs(query: string, locale: string): Promise<SearchResult[]> {
    const q = query.trim()
    if (q.length < 2) {
      return []
    }

    const staticIndex = await getStaticIndex(locale)
    if (staticIndex) {
      return searchStaticIndex(staticIndex, q)
    }

    return $fetch<SearchResult[]>('/api/search', {
      query: { q, locale },
    })
  }

  return { searchDocs }
}
