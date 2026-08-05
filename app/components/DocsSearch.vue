<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { searchDocs } = useDocsSearch()
const open = useState('docs-search-open', () => false)
const query = ref('')
const results = ref<Array<{ title: string; path: string; description?: string }>>([])
const loading = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | undefined

async function runSearch() {
  const q = query.value.trim()
  if (q.length < 2) {
    results.value = []
    return
  }

  loading.value = true
  try {
    results.value = await searchDocs(q, locale.value)
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

watch(query, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(runSearch, 200)
})

watch(open, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      document.getElementById('docs-search-input')?.focus()
    })
  } else {
    query.value = ''
    results.value = []
  }
})

function toggleSearch() {
  open.value = !open.value
}

function closeSearch() {
  open.value = false
}
</script>

<template>
  <div>
    <button
      type="button"
      class="hidden items-center gap-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:border-surface-border dark:text-zinc-400 dark:hover:bg-surface-elevated sm:inline-flex"
      @click="toggleSearch"
    >
      <Search class="h-4 w-4" />
      <span>{{ t('search') }}</span>
      <kbd class="hidden rounded border border-zinc-300 px-1.5 py-0.5 text-[10px] font-medium lg:inline dark:border-surface-border">/</kbd>
    </button>

    <button
      type="button"
      class="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-surface-elevated sm:hidden"
      :aria-label="t('search')"
      @click="toggleSearch"
    >
      <Search class="h-5 w-5" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
        @click.self="closeSearch"
      >
        <div class="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
          <div class="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
            <Search class="h-5 w-5 shrink-0 text-zinc-500" />
            <input
              id="docs-search-input"
              v-model="query"
              type="search"
              :placeholder="t('search')"
              class="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
            >
            <button
              type="button"
              class="rounded p-1 text-zinc-500 hover:text-zinc-300"
              @click="closeSearch"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div class="max-h-80 overflow-y-auto p-2">
            <p v-if="loading" class="px-3 py-6 text-center text-sm text-zinc-500">...</p>
            <p v-else-if="query.trim().length >= 2 && results.length === 0" class="px-3 py-6 text-center text-sm text-zinc-500">
              {{ t('searchNoResults') }}
            </p>
            <p v-else-if="query.trim().length < 2" class="px-3 py-6 text-center text-sm text-zinc-500">
              {{ t('searchHint') }}
            </p>
            <NuxtLink
              v-for="item in results"
              :key="item.path"
              :to="localePath(item.path)"
              class="block rounded-lg px-3 py-2.5 transition hover:bg-zinc-800"
              @click="closeSearch"
            >
              <div class="font-medium text-zinc-100">{{ item.title }}</div>
              <div v-if="item.description" class="mt-0.5 line-clamp-2 text-sm text-zinc-500">
                {{ item.description }}
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
