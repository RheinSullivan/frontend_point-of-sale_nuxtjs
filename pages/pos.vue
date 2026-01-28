<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Point of Sale</h1>
      <button
        v-if="appStore.cart.length > 0"
        @click="appStore.openCart"
        class="relative btn-primary"
      >
        <svg class="w-6 h-6 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Cart ({{ appStore.cartItemCount }})
        <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {{ appStore.cartItemCount }}
        </span>
      </button>
    </div>

    <div class="mb-6 space-y-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="input-field max-w-md"
      />

      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedCategory = ''"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            selectedCategory === '' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          All Categories
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            selectedCategory === category.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        @click="addToCart(product)"
        class="card hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
      >
        <div class="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 mb-1">{{ product.name }}</h3>
        <p class="text-sm text-gray-500 mb-2">{{ product.category_name }}</p>
        <p class="text-lg font-bold text-primary">Rp {{ formatNumber(product.price) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '~/stores/app'

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
}

definePageMeta({
  middleware: 'auth'
})

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
