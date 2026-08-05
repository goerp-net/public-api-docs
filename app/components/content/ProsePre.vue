<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'

const props = defineProps<{
  code?: string
  language?: string
  meta?: string
  class?: string
}>()

const copied = ref(false)
const preRef = ref<HTMLElement | null>(null)

const codeText = computed(() => {
  if (props.code) return props.code
  return preRef.value?.textContent?.trim() ?? ''
})

async function copyCode() {
  const text = codeText.value
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // ignore
  }
}
</script>

<template>
  <div class="not-prose group relative my-6">
    <button
      type="button"
      class="absolute end-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900/90 px-2.5 py-1.5 text-xs text-zinc-300 opacity-0 transition hover:bg-zinc-800 group-hover:opacity-100 focus:opacity-100"
      :aria-label="copied ? 'Copied' : 'Copy code'"
      @click="copyCode"
    >
      <Check v-if="copied" class="h-3.5 w-3.5 text-brand" />
      <Copy v-else class="h-3.5 w-3.5" />
      <span>{{ copied ? 'Copied' : 'Copy' }}</span>
    </button>
    <pre
      ref="preRef"
      class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm leading-relaxed"
      dir="ltr"
      :class="props.class"
    ><code><slot /></code></pre>
  </div>
</template>
