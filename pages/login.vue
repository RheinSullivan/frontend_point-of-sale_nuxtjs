<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
    <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary italic">Vyagra Nexus</h1>
        <p class="text-gray-400 text-sm mt-2">Please login to continue dashboard POS</p>
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
  title: 'Login - Point of Sale'
})

useHead({
  title: 'Login - Point of Sale'
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