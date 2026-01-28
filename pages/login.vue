<template>
  <div class="min-h-screen flex flex-col items-center justify-center dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gray-500 p-4">
    <div class="dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-200 rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary italic">{{ t('vyagraNexus') }}</h1>
        <p class="dark:text-gray-400 text-gray-600 text-sm mt-2">{{ t('pleaseLogin') }}</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">{{ t('username') }}</label>
          <input
            v-model="username"
            type="text"
            required
            class="input-field"
            :placeholder="t('enterUsername')"
          />
        </div>
        
        <div class="pb-8">
          <label class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">{{ t('password') }}</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input-field pr-12"
              :placeholder="t('enterPassword')"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-400 text-gray-600 hover:dark:text-gray-300 hover:text-gray-800"
            >
              <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'" class="text-lg"></i>
            </button>
          </div>
        </div>
        
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary mt-6"
        >
          {{ loading ? t('loading') : t('login') }}
        </button>
      </form>
      
      <div class="mt-6 flex justify-center">
        <button
          @click="toggleLanguage"
          class="text-sm dark:text-gray-400 text-gray-600 hover:text-primary transition-colors"
        >
          {{ locale === 'id' ? '🇺🇸 English' : '🇮🇩 Bahasa Indonesia' }}
        </button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  title: 'Login - Point of Sale'
})

useHead({
  title: 'Login - Point of Sale'
})

const { apiCall, setToken, setUser } = useApi()
const { t, setLocale, loadLocale, locale } = useI18n()
const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<string>('')

onMounted(() => {
  loadLocale()
})

const toggleLanguage = () => {
  const newLocale = locale.value === 'id' ? 'en' : 'id'
  setLocale(newLocale)
}

const handleLogin = async (): Promise<void> => {
  loading.value = true
  error.value = ''
  
  try {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    
    setToken(data.token)
    setUser(data.user)
    
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>