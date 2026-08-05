export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim().toLowerCase()
  const locale = String(query.locale || 'en')

  if (!q || q.length < 2) {
    return []
  }

  const collection = locale === 'ar' ? 'docs_ar' : 'docs_en'
  const pages = await queryCollection(event, collection)
    .select('title', 'path', 'description')
    .all()

  return pages
    .filter((page) => {
      const haystack = `${page.title} ${page.description || ''} ${page.path}`.toLowerCase()
      return haystack.includes(q)
    })
    .slice(0, 12)
    .map(page => ({
      title: page.title,
      path: page.path.replace(`/${locale}`, '') || '/getting-started',
      description: page.description,
    }))
})
