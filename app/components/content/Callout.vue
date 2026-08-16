<script setup lang="ts">
defineProps<{
  type?: 'info' | 'warning' | 'danger'
}>()

const styles: Record<string, string> = {
  info: 'border-blue-300 bg-blue-50 text-blue-950 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100',
  warning: 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100',
  danger: 'border-red-300 bg-red-50 text-red-950 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100',
}
</script>

<template>
  <div
    class="not-prose my-6 rounded-lg border px-4 py-3 text-start text-sm [&_strong]:font-semibold"
    :class="styles[type ?? 'info']"
  >
    <slot />
  </div>
</template>
