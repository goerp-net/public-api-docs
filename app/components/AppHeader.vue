<script setup lang="ts">
import { Moon, Sun, ExternalLink } from 'lucide-vue-next'

const { locale, locales, t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const colorMode = useColorMode()

const otherLocale = computed(() =>
  locales.value.find(l => l.code !== locale.value),
)

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-surface-border dark:bg-surface/90">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <div class="flex items-center gap-6">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5">
          <img
            src="/logo.svg"
            alt="daqiq"
            class="hidden h-7 w-auto sm:dark:block"
            height="28"
          >
          <img
            src="/logo-light.svg"
            alt="daqiq"
            class="hidden h-7 w-auto sm:block sm:dark:hidden"
            height="28"
          >
          <span class="text-lg font-semibold sm:hidden">{{ t('brand') }}</span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/getting-started')"
          class="hidden text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:inline"
        >
          {{ t('documentation') }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <DocsSearch />

        <NuxtLink
          v-if="otherLocale"
          :to="switchLocalePath(otherLocale.code)"
          class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-surface-elevated"
        >
          {{ otherLocale.name }}
        </NuxtLink>

        <button
          type="button"
          class="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-surface-elevated"
          :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <Sun v-if="colorMode.value === 'dark'" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>

        <a
          href="https://app.daqiqerp.com"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-surface-elevated sm:inline-flex"
        >
          {{ t('dashboard') }}
          <ExternalLink class="h-4 w-4" />
        </a>
      </div>
    </div>
  </header>
</template>
