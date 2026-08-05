<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'

const props = defineProps<{
  code: string
}>()

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // ignore
  }
}
</script>

<template>
  <div class="group relative">
    <button
      type="button"
      class="absolute end-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900/90 px-2.5 py-1.5 text-xs text-zinc-300 opacity-0 transition hover:bg-zinc-800 group-hover:opacity-100 focus:opacity-100"
      @click="copyCode"
    >
      <Check v-if="copied" class="h-3.5 w-3.5 text-brand" />
      <Copy v-else class="h-3.5 w-3.5" />
      <span>{{ copied ? 'Copied' : 'Copy' }}</span>
    </button>
    <pre class="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-300" dir="ltr"><code>{{ code }}</code></pre>
  </div>
</template>
