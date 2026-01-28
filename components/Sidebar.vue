<template>
  <div
    class="fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300"
    :class="[appStore.sidebarOpen ? 'w-64' : 'w-20']"
  >
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-800">
      <h1 v-if="appStore.sidebarOpen" class="text-xl font-bold text-primary">
        Simple POS
      </h1>
      <button
        @click="appStore.toggleSidebar"
        class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="appStore.sidebarOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'sidebar-link',
          { 'sidebar-link-active': route.path === item.path }
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span v-if="appStore.sidebarOpen" class="font-medium">{{ item.name }}</span>
      </NuxtLink>
    </nav>

    <div class="p-4 border-t border-gray-800">
      <div v-if="appStore.sidebarOpen" class="mb-3">
        <p class="text-sm text-gray-500">Logged in as</p>
        <p class="font-medium text-gray-100">{{ user?.name }}</p>
        <p class="text-xs text-gray-500 capitalize">{{ user?.role }}</p>
      </div>
      <button
        @click="handleLogout"
        class="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-danger hover:text-white transition-colors"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span v-if="appStore.sidebarOpen" class="font-medium">Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useAppStore } from '~/stores/app'
import { useRoute, useRouter } from 'vue-router'

interface User {
  name: string
  role: string
}

interface MenuItem {
  name: string
  path: string
  icon: any
}

const appStore = useAppStore()
const { getUser, removeToken } = useApi()
const router = useRouter()
const route = useRoute()

const user = ref<User | null>(null)

onMounted(() => {
  user.value = getUser()
})

const menuItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
    {
      name: 'Create Order',
      path: '/',
      icon: defineComponent({
        setup() {
          return () => h('svg', {
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          }, [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '2',
              d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
            })
          ])
        }
      })
    }
  ]

  if (user.value?.role === 'admin') {
    items.push(
      {
        name: 'Category Management',
        path: '/categories',
        icon: defineComponent({
          setup() {
            return () => h('svg', {
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24'
            }, [
              h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
              })
            ])
          }
        })
      },
      {
        name: 'Product Management',
        path: '/products',
        icon: defineComponent({
          setup() {
            return () => h('svg', {
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24'
            }, [
              h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
              })
            ])
          }
        })
      }
    )
  }

  items.push(
    {
      name: 'Sales Dashboard',
      path: '/dashboard',
      icon: defineComponent({
        setup() {
          return () => h('svg', {
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          }, [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '2',
              d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            })
          ])
        }
      })
    }
  )

  return items
})

const handleLogout = (): void => {
  removeToken()
  router.push('/login')
}
</script>