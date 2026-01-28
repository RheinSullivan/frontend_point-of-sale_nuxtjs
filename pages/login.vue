<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
    <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8 gap-5 flex flex-col">
        <h1 class="text-3xl font-bold text-primary italic">Vyagra Nexus</h1>
        <p class="text-gray-400 text-sm">Please login to continue dashboard POS</p>
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
            :disabled="loading"
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
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              :disabled="loading"
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
        
        <div v-if="backendStatus" class="p-3 rounded-lg" :class="backendStatus.online ? 'bg-green-900 bg-opacity-20 border border-green-800 text-green-400' : 'bg-red-900 bg-opacity-20 border border-red-800 text-red-400'">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="backendStatus.online ? 'bg-green-500' : 'bg-red-500'"></div>
            <span class="text-sm">{{ backendStatus.message }}</span>
          </div>
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary flex items-center justify-center gap-2"
        >
          <div v-if="loading" class="spinner w-5 h-5 border-2"></div>
          <span>{{ loading ? 'Connecting...' : 'Login' }}</span>
        </button>
      </form>
      
      <div class="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p class="text-xs text-gray-400 mb-2">Default Credentials:</p>
        <p class="text-sm text-gray-300">Username: <span class="font-mono text-primary">admin</span></p>
        <p class="text-sm text-gray-300">Password: <span class="font-mono text-primary">admin123</span></p>
      </div>
    </div>

    <div class="mt-8 text-center">
      <p class="text-sm text-gray-400">
        Copyright &copy; 2026
        <a 
          href="https://rheinsullivan.web.id/" 
          target="_blank"
          class="text-primary hover:text-primary-light hover:underline transition-colors"
        >
          Rhein Sullivan
        </a>
        . All rights reserved.
      </p>
    </div>
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

const username = ref<string>('admin')
const password = ref<string>('admin123')
const showPassword = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<string>('')
const backendStatus = ref<{online: boolean, message: string} | null>(null)

const checkBackendStatus = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok || response.status === 200) {
      backendStatus.value = {
        online: true,
        message: 'Backend server is online'
      }
    } else {
      backendStatus.value = {
        online: false,
        message: 'Backend server is not responding'
      }
    }
  } catch (err) {
    backendStatus.value = {
      online: false,
      message: 'Cannot connect to backend server. Please start Flask backend first.'
    }
  }
}

onMounted(() => {
  checkBackendStatus()
})

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
    
    await router.push('/')
  } catch (err: any) {
    console.error('Login error:', err)
    
    if (err.message.includes('fetch')) {
      error.value = 'Cannot connect to server. Please ensure backend is running on port 5000.'
      backendStatus.value = {
        online: false,
        message: 'Backend server is offline'
      }
    } else {
      error.value = err.message || 'Login failed. Please check your credentials.'
    }
  } finally {
    loading.value = false
  }
}
</script>