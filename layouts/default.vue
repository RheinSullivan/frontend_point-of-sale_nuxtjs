<template>
  <div class="flex h-screen overflow-hidden bg-[#0f1117]">
    <Sidebar />
    <CartSidebar />
    
    <main
      class="flex-1 flex flex-col overflow-hidden transition-all duration-300"
      :class="[appStore.sidebarOpen ? 'ml-72' : 'ml-24']"
    >
      <slot />
      <Footer />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
</script>