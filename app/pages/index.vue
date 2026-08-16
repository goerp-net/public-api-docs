<script setup lang="ts">
import {
  ArrowRight,
  KeyRound,
  Package,
  Boxes,
  Shield,
  AlertTriangle,
  Gauge,
} from 'lucide-vue-next'
import { apiExampleUrl } from '~/utils/site'

definePageMeta({
  layout: 'default',
})

const { locale, t } = useI18n()
const localePath = useLocalePath()

const features = [
  { key: 'auth', icon: KeyRound },
  { key: 'orders', icon: Package },
  { key: 'catalog', icon: Boxes },
  { key: 'scopes', icon: Shield },
  { key: 'errors', icon: AlertTriangle },
  { key: 'rateLimits', icon: Gauge },
] as const

const curlExample = `curl ${apiExampleUrl('/v1/public/orders')} \\
  -H "X-Api-Key: daqiq_live_your_key_here" \\
  -H "Content-Type: application/json"`

useSeoMeta({
  title: () => `${t('brand')} API Documentation`,
  description: () => t('hero.description'),
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-zinc-200 dark:border-surface-border">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(198,255,52,0.08),transparent_60%)]" />
      <div class="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <span class="mb-6 inline-block rounded-full border border-zinc-300 px-4 py-1 text-xs font-medium text-zinc-600 dark:border-surface-border dark:text-zinc-400">
          {{ t('hero.badge') }}
        </span>
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {{ t('hero.title') }}
          <span class="brand-underline">{{ t('hero.titleHighlight') }}</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {{ t('hero.description') }}
        </p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <NuxtLink :to="localePath('/getting-started')" class="btn-primary">
            {{ t('getStarted') }}
            <ArrowRight class="h-4 w-4" :class="locale === 'ar' ? 'rotate-180' : ''" />
          </NuxtLink>
          <NuxtLink :to="localePath('/authentication')" class="btn-secondary">
            {{ t('authGuide') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold">{{ t('exploreApi') }}</h2>
        <p class="mt-3 text-zinc-600 dark:text-zinc-400">{{ t('exploreSubtitle') }}</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.key"
          class="glass-card p-6 transition hover:border-brand/30"
        >
          <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-zinc-900 dark:text-zinc-100">
            <component :is="feature.icon" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 font-semibold">{{ t(`features.${feature.key}.title`) }}</h3>
          <p class="text-sm text-zinc-600 dark:text-zinc-400">
            {{ t(`features.${feature.key}.description`) }}
          </p>
        </div>
      </div>
    </section>

    <section class="border-t border-zinc-200 bg-zinc-50 dark:border-surface-border dark:bg-surface-card/50">
      <div class="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 class="text-3xl font-bold">{{ t('quickStart') }}</h2>
          <p class="mt-3 text-zinc-600 dark:text-zinc-400">{{ t('quickStartSubtitle') }}</p>
          <ol class="mt-8 space-y-6">
            <li v-for="(step, i) in ['step1', 'step2', 'step3']" :key="step" class="flex gap-4">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
                {{ i + 1 }}
              </span>
              <div>
                <h4 class="font-semibold">{{ t(`quickStartSteps.${step}Title`) }}</h4>
                <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {{ t(`quickStartSteps.${step}Desc`) }}
                </p>
              </div>
            </li>
          </ol>
          <NuxtLink :to="localePath('/getting-started')" class="btn-primary mt-8">
            {{ t('readGuide') }}
            <ArrowRight class="h-4 w-4" :class="locale === 'ar' ? 'rotate-180' : ''" />
          </NuxtLink>
        </div>

        <div class="relative">
          <div class="absolute -inset-4 rounded-2xl bg-brand/5 blur-2xl" />
          <div class="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-glow dark:border-surface-border">
            <div class="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <span class="h-3 w-3 rounded-full bg-red-500/80" />
              <span class="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span class="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <CopyCodeBlock :code="curlExample" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
