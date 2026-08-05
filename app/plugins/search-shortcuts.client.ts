export default defineNuxtPlugin(() => {
  const open = useState('docs-search-open', () => false)

  function isTypingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false
    const tag = target.tagName
    return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
  }

  function onKeydown(e: KeyboardEvent) {
    const key = e.key.toLowerCase()

    if ((e.ctrlKey || e.metaKey) && key === 'k') {
      e.preventDefault()
      e.stopPropagation()
      open.value = !open.value
      return
    }

    if (key === '/' && !isTypingTarget(e.target) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      open.value = true
    }

    if (key === 'escape' && open.value) {
      e.preventDefault()
      open.value = false
    }
  }

  window.addEventListener('keydown', onKeydown, { capture: true })
})
