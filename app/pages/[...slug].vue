<script setup lang="ts">
definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { locale } = useI18n()

const slug = computed(() => {
  const param = route.params.slug
  if (!param) return ''
  return Array.isArray(param) ? param.join('/') : param
})

const collection = computed(() => (locale.value === 'ar' ? 'docs_ar' : 'docs_en'))
const contentPath = computed(() => `/${locale.value}/${slug.value}`)

const { data: page } = await useAsyncData(
  () => `doc-${locale.value}-${slug.value}`,
  () => queryCollection(collection.value).path(contentPath.value).first(),
  { watch: [locale, slug] },
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} · daqiq API` : 'daqiq API',
  description: () => page.value?.description ?? '',
})
</script>

<template>
  <article v-if="page" class="text-start">
    <header class="mb-8 border-b border-zinc-200 pb-6 dark:border-surface-border">
      <h1 class="text-3xl font-bold tracking-tight">{{ page.title }}</h1>
      <p v-if="page.description" class="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        {{ page.description }}
      </p>
    </header>
    <div class="docs-prose">
      <ContentRenderer :value="page" />
    </div>
  </article>
</template>
