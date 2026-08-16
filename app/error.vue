<script setup lang="ts">
import { siteConfig } from '~/utils/site'

const error = useError()
const localePath = useLocalePath()

useSeoMeta({
  title: error.value?.statusCode === 404 ? 'Page Not Found · daqiq API' : 'Error · daqiq API',
  description: 'The requested documentation page could not be found.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <p class="text-sm font-medium text-zinc-500">
      {{ error?.statusCode ?? 500 }}
    </p>
    <h1 class="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
      {{ error?.statusMessage ?? 'Something went wrong' }}
    </h1>
    <NuxtLink
      :to="localePath('/')"
      class="btn-primary mt-8"
    >
      {{ siteConfig.siteName }}
    </NuxtLink>
  </div>
</template>
