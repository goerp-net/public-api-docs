<script setup lang="ts">
defineProps<{
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  path: string
  scope?: string
}>()

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PATCH: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  PUT: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
}
</script>

<template>
  <div class="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-surface-border">
    <div class="flex flex-wrap items-center gap-3 bg-zinc-50 px-4 py-3 dark:bg-surface-elevated">
      <span
        class="rounded border px-2 py-0.5 font-mono text-xs font-bold uppercase"
        :class="methodColors[method]"
      >
        {{ method }}
      </span>
      <code class="font-mono text-sm text-zinc-800 dark:text-zinc-200" dir="ltr">{{ path }}</code>
      <span
        v-if="scope"
        class="ms-auto rounded-full bg-zinc-200 px-2.5 py-0.5 font-mono text-xs text-zinc-700 dark:bg-surface-border dark:text-zinc-300"
        dir="ltr"
      >
        {{ scope }}
      </span>
    </div>
    <div v-if="$slots.default" class="border-t border-zinc-200 px-4 py-3 dark:border-surface-border">
      <slot />
    </div>
  </div>
</template>
