<template>
  <header class="bg-gray-900 border-b border-gray-800 px-6 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-100">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm text-gray-400">{{ subtitle }}</p>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="hidden md:block text-right">
          <p class="text-sm font-medium text-gray-100">
            {{ user?.role === 'admin' ? 'Owner Store' : 'Employee' }}
          </p>
          <p class="text-sm text-gray-400">{{ user?.role }}</p>
        </div>
        
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          title="Toggle dark mode"
        >
          <svg v-if="isDarkMode" class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

interface User {
  name: string
  role: string
}

defineProps<Props>()

const { getUser } = useApi()
const user = ref<User | null>(null)
const isDarkMode = ref(true)

onMounted(() => {
  user.value = getUser()
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}
</script>