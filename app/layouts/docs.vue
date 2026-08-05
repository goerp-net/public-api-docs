<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <div class="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6">
      <DocsSidebar />
      <main class="min-w-0 flex-1">
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>
