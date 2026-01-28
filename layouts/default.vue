<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar />
    <CartSidebar />
    <Notification ref="notificationRef" />
    
    <main
      class="flex-1 flex flex-col overflow-hidden transition-all duration-300"
      :class="[appStore.sidebarOpen ? 'ml-72' : 'ml-24']"
    >
      <slot />
      <div class="border-t border-gray-800">
        <Footer />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
const notificationRef = ref(null)

onMounted(() => {
  if (notificationRef.value) {
    window.notificationSystem = notificationRef.value
  }
})
</script>