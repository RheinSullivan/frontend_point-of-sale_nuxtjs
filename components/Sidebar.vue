<template>
  <div
    class="fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300"
    :class="[appStore.sidebarOpen ? 'w-72' : 'w-24']"
  >
    <div class="flex items-center justify-between h-[81px] px-4 border-b border-gray-800">
      <div class="flex flex-col gap-1">
        <h1 v-if="appStore.sidebarOpen" class="text-2xl font-bold italic text-primary">
          {{ t('vyagraNexus') }}
        </h1>
        <h1 v-else class="text-2xl font-bold text-primary">
          VN
        </h1>
        <p v-if="appStore.sidebarOpen" class="text-sm text-gray-400">{{ t('pointOfSale') }}</p>
        <p v-else class="text-xs text-gray-400">POS</p>
      </div>
      <button
        @click="appStore.toggleSidebar"
        class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400"
      >
        <i :class="appStore.sidebarOpen ? 'pi pi-angle-double-left' : 'pi pi-angle-double-right ml-1'" class="text-xl"></i>
      </button>
    </div>

    <nav class="flex-1 py-6 px-2 space-y-2 overflow-y-auto">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'sidebar-link',
          { 'sidebar-link-active': route.path === item.path }
        ]"
      >
        <i :class="item.icon" class="text-xl shrink-0"></i>
        <span v-if="appStore.sidebarOpen" class="font-medium">{{ item.name }}</span>
      </NuxtLink>
    </nav>

    <div class="py-2.5 px-2 border-t border-gray-800">
      <button
        @click="handleLogout"
        class="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-danger hover:text-white transition-colors"
      >
        <i class="pi pi-sign-out text-xl shrink-0"></i>
        <span v-if="appStore.sidebarOpen" class="font-medium">{{ t('logout') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '~/stores/app'
import { useRoute, useRouter } from 'vue-router'

interface User {
  name: string
  role: string
}

interface MenuItem {
  name: string
  path: string
  icon: string
}

const appStore = useAppStore()
const { getUser, removeToken } = useApi()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const user = ref<User | null>(null)

onMounted(() => {
  user.value = getUser()
})

const menuItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
    {
      name: t('dashboard'),
      path: '/dashboard',
      icon: 'pi pi-chart-bar'
    },
    {
      name: t('createOrder'),
      path: '/',
      icon: 'pi pi-shopping-cart'
    }
  ]

  if (user.value?.role === 'admin') {
    items.push(
      {
        name: t('categoryManagement'),
        path: '/categories',
        icon: 'pi pi-tags'
      },
      {
        name: t('productManagement'),
        path: '/products',
        icon: 'pi pi-box'
      }
    )
  }

  return items
})

const handleLogout = (): void => {
  removeToken()
  router.push('/login')
}
</script>