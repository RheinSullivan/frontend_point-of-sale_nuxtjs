<template>
  <div class="flex-1 overflow-y-auto">
    <Header 
      title="Dashboard" 
      subtitle="Welcome to your Simple POS system dashboard."
    />
    
    <div class="p-6 space-y-6">
      <div class="flex items-center gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="input-field pl-10"
          />
          <svg class="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          @click="selectedCategory = ''"
          :class="[
            'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
            selectedCategory === '' 
              ? 'bg-primary text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]"
        >
          All
          <span class="ml-2 text-xs opacity-75">{{ products.length }} Products</span>
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
            selectedCategory === category.id 
              ? 'bg-primary text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]"
        >
          {{ category.name }}
          <span class="ml-2 text-xs opacity-75">{{ category.product_count }} Products</span>
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="spinner w-12 h-12"></div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="card card-hover cursor-pointer group"
          @click="addToCart(product)"
        >
          <div class="aspect-[4/3] bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            <span class="text-gray-600 text-4xl font-bold">600×400</span>
          </div>
          <h3 class="font-semibold text-gray-100 mb-1 group-hover:text-primary transition-colors">{{ product.name }}</h3>
          <p class="text-lg font-bold text-primary">Rp {{ formatNumber(product.price) }}</p>
          <button class="mt-3 w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '~/stores/app'

definePageMeta({
  middleware: 'auth',
  title: 'Create Order - Simple POS'
})

useHead({
  title: 'Create Order - Simple POS'
})

interface Product {
  id: string
  name: string
  price: number
  category_id: string
  category_name: string
}

interface Category {
  id: string
  name: string
  product_count: number
}

const appStore = useAppStore()
const { apiCall } = useApi()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const searchQuery = ref<string>('')
const selectedCategory = ref<string>('')
const loading = ref<boolean>(false)

const filteredProducts = computed<Product[]>(() => {
  let filtered = products.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((p: Product) => 
      p.name.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((p: Product) => 
      p.category_id === selectedCategory.value
    )
  }

  return filtered
})

onMounted(async () => {
  await loadData()
})

const loadData = async (): Promise<void> => {
  loading.value = true
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      apiCall('/products'),
      apiCall('/categories')
    ])
    
    products.value = productsRes
    categories.value = categoriesRes
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = (product: Product): void => {
  appStore.addToCart(product)
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>