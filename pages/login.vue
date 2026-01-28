<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
    <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">Simple POS</h1>
        <p class="text-gray-400">Please login to continue</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="input-field"
            placeholder="Enter username"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input-field pr-12"
              placeholder="Enter password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary"
        >
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  title: 'Login - Simple POS'
})

useHead({
  title: 'Login - Simple POS'
})

const { apiCall, setToken, setUser } = useApi()
const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<string>('')

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