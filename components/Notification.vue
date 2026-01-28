<template>
  <transition-group name="notification" tag="div" class="fixed top-4 right-4 z-50 space-y-3 max-w-md">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="[
        'flex items-start gap-3 p-4 rounded-lg shadow-2xl border backdrop-blur-sm',
        'animate-slide-in-right',
        notification.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-100' :
        notification.type === 'error' ? 'bg-red-900/90 border-red-700 text-red-100' :
        notification.type === 'warning' ? 'bg-yellow-900/90 border-yellow-700 text-yellow-100' :
        'bg-blue-900/90 border-blue-700 text-blue-100'
      ]"
    >
      <i
        :class="[
          'text-2xl shrink-0',
          notification.type === 'success' ? 'pi pi-check-circle' :
          notification.type === 'error' ? 'pi pi-times-circle' :
          notification.type === 'warning' ? 'pi pi-exclamation-triangle' :
          'pi pi-info-circle'
        ]"
      ></i>
      <div class="flex-1">
        <p class="font-semibold mb-1">{{ notification.title }}</p>
        <p class="text-sm opacity-90">{{ notification.message }}</p>
      </div>
      <button
        @click="removeNotification(notification.id)"
        class="shrink-0 text-white/70 hover:text-white transition-colors"
      >
        <i class="pi pi-times"></i>
      </button>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

const notifications = ref<Notification[]>([])
let notificationId = 0

const addNotification = (type: Notification['type'], title: string, message: string) => {
  const id = ++notificationId
  notifications.value.push({ id, type, title, message })
  
  setTimeout(() => {
    removeNotification(id)
  }, 5000)
}

const removeNotification = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

defineExpose({
  addNotification
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>