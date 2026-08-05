export interface NavItem {
  slug: string
  titleKey: string
}

export interface NavSection {
  titleKey: string
  items: NavItem[]
}

export const docsNavigation: NavSection[] = [
  {
    titleKey: 'nav.gettingStarted',
    items: [
      { slug: 'getting-started', titleKey: 'nav.overview' },
      { slug: 'authentication', titleKey: 'nav.authentication' },
      { slug: 'scopes', titleKey: 'nav.scopes' },
      { slug: 'integration-checklist', titleKey: 'nav.checklist' },
    ],
  },
  {
    titleKey: 'nav.guides',
    items: [
      { slug: 'guides/errors', titleKey: 'nav.errors' },
      { slug: 'guides/rate-limits', titleKey: 'nav.rateLimits' },
      { slug: 'guides/pagination', titleKey: 'nav.pagination' },
      { slug: 'guides/idempotency', titleKey: 'nav.idempotency' },
      { slug: 'guides/compatibility', titleKey: 'nav.compatibility' },
    ],
  },
  {
    titleKey: 'nav.apiReference',
    items: [
      { slug: 'api-reference/ping', titleKey: 'nav.ping' },
      { slug: 'api-reference/orders', titleKey: 'nav.orders' },
      { slug: 'api-reference/products', titleKey: 'nav.products' },
      { slug: 'api-reference/stock', titleKey: 'nav.stock' },
      { slug: 'api-reference/inventory', titleKey: 'nav.inventory' },
      { slug: 'api-reference/customers', titleKey: 'nav.customers' },
    ],
  },
]
