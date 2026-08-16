<script setup lang="ts">
import { docsNavigation } from '~/utils/navigation'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

function isActive(slug: string) {
  const target = localePath(`/${slug}`)
  return route.path === target || route.path.startsWith(`${target}/`)
}
</script>

<template>
  <aside class="hidden w-64 shrink-0 lg:block">
    <nav class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-e border-zinc-200 pe-4 dark:border-surface-border">
      <div v-for="section in docsNavigation" :key="section.titleKey" class="mb-6">
        <h4 class="mb-2 text-start text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {{ t(section.titleKey) }}
        </h4>
        <ul class="space-y-1">
          <li v-for="item in section.items" :key="item.slug">
            <NuxtLink
              :to="localePath(`/${item.slug}`)"
              class="block rounded-md px-3 py-1.5 text-start text-[1rem] leading-snug transition"
              :class="isActive(item.slug)
                ? 'font-semibold text-[1.26rem] text-zinc-900 underline decoration-brand decoration-2 underline-offset-4 dark:text-zinc-100'
                : 'font-normal text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-surface-elevated dark:hover:text-zinc-100'"
            >
              {{ t(item.titleKey) }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>
