<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
import { siteConfig } from '~/utils/site'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <footer class="border-t border-zinc-200 bg-zinc-50 dark:border-surface-border dark:bg-surface-card">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div class="grid gap-8 sm:grid-cols-3">
        <div>
          <h3 class="mb-4 text-start text-sm font-semibold">{{ t('footer.documentation') }}</h3>
          <ul class="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <NuxtLink :to="localePath('/getting-started')" class="transition hover:text-zinc-900 hover:underline hover:decoration-brand hover:decoration-2 hover:underline-offset-2 dark:hover:text-zinc-100">
                {{ t('nav.overview') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/authentication')" class="transition hover:text-zinc-900 hover:underline hover:decoration-brand hover:decoration-2 hover:underline-offset-2 dark:hover:text-zinc-100">
                {{ t('nav.authentication') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/api-reference/orders')" class="transition hover:text-zinc-900 hover:underline hover:decoration-brand hover:decoration-2 hover:underline-offset-2 dark:hover:text-zinc-100">
                {{ t('nav.orders') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 text-start text-sm font-semibold">{{ t('footer.guides') }}</h3>
          <ul class="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <NuxtLink :to="localePath('/guides/errors')" class="transition hover:text-zinc-900 hover:underline hover:decoration-brand hover:decoration-2 hover:underline-offset-2 dark:hover:text-zinc-100">
                {{ t('nav.errors') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/guides/rate-limits')" class="transition hover:text-zinc-900 hover:underline hover:decoration-brand hover:decoration-2 hover:underline-offset-2 dark:hover:text-zinc-100">
                {{ t('nav.rateLimits') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/guides/pagination')" class="transition hover:text-zinc-900 hover:underline hover:decoration-brand hover:decoration-2 hover:underline-offset-2 dark:hover:text-zinc-100">
                {{ t('nav.pagination') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 text-start text-sm font-semibold">{{ t('footer.resources') }}</h3>
          <ul class="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <a
                :href="siteConfig.dashboardUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 transition hover:text-zinc-900 hover:underline hover:decoration-brand hover:decoration-2 hover:underline-offset-2 dark:hover:text-zinc-100"
              >
                {{ t('dashboard') }}
                <ExternalLink class="h-3.5 w-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500 dark:border-surface-border">
        © {{ new Date().getFullYear() }} {{ t('footer.copyright') }}
      </div>
    </div>
  </footer>
</template>
