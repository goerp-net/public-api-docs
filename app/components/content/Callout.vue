<script setup lang="ts">
defineProps<{
  type?: 'info' | 'warning' | 'danger'
}>()

const styles: Record<string, string> = {
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  danger: 'border-red-500/30 bg-red-500/10 text-red-200',
}
</script>

<template>
  <div
    class="not-prose my-6 rounded-lg border px-4 py-3 text-sm"
    :class="styles[type ?? 'info']"
  >
    <slot />
  </div>
</template>
