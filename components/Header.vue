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
            {{ user?.name }}
          </p>
          <p class="text-sm text-gray-400">{{ user?.role === 'admin' ? 'Owner Store' : 'Employee' }}</p>
        </div>
        
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <i class="text-xl" :class="{ 'pi pi-sun text-yellow-400': isDarkMode, 'pi pi-moon text-gray-400': !isDarkMode }"></i>
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
  
  if (process.client) {
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value = savedTheme !== 'light'
    applyTheme()
  }
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (process.client) {
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    applyTheme()
  }
}

const applyTheme = () => {
  if (process.client) {
    if (isDarkMode.value) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }
}
</script>