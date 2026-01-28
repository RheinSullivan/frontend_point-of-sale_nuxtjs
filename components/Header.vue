<template>
  <header class="bg-gray-900 border-b border-gray-800 px-6 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-100">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm text-gray-400">{{ subtitle }}</p>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="hidden md:block text-right">
          <p class="font-medium text-gray-100">
            {{ user?.name }}
          </p>
          <p class="text-xs text-gray-400">{{ user?.role === 'admin' ? t('ownerStore') : t('employee') }}</p>
        </div>
        
        <button
          @click="toggleLanguage"
          class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          :title="locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'"
        >
          <span class="text-sm font-semibold text-gray-300">{{ locale === 'id' ? 'ID' : 'EN' }}</span>
        </button>
        
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 flex justify-center items-center transition-colors"
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
const { t, setLocale, loadLocale, locale } = useI18n()
const user = ref<User | null>(null)
const isDarkMode = ref(true)

onMounted(() => {
  user.value = getUser()
  loadLocale()
  
  if (process.client) {
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value = savedTheme !== 'light'
    applyTheme()
  }
})

const toggleLanguage = () => {
  const newLocale = locale.value === 'id' ? 'en' : 'id'
  setLocale(newLocale)
}

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