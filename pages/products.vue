<template>
  <div class="flex-1 overflow-y-auto">
    <Header 
      title="Product Management" 
      subtitle="View, add, edit, and delete products in your inventory"
    />
    
    <div class="p-6">
      <div class="flex justify-between">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="input-field max-w-md mb-6"
        />
        <div class="flex justify-end mb-6">
          <button @click="openAddModal" class="btn-primary">
            Add New Product
          </button>
        </div>
      </div>

      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div class="aspect-[4/3] bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
              <span class="text-gray-600 text-3xl font-bold">600×400</span>
            </div>
            
            <h3 class="font-semibold text-gray-100 mb-1">{{ product.name }}</h3>
            <p class="text-xl font-bold text-primary mb-1">Rp {{ formatNumber(product.price) }}</p>
            <p class="text-sm text-gray-400 mb-4">Category: {{ product.category_name }}</p>
            
            <div class="flex gap-3">
              <button
                @click="openEditModal(product)"
                class="flex-1 btn-secondary"
              >
                Edit
              </button>
              <button
                @click="deleteProduct(product.id, product.name)"
                class="flex-1 btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="modal-overlay animate-fade-in" @click.self="closeModal">
        <div class="modal-content animate-scale-in">
          <h2 class="text-2xl font-bold text-gray-100 mb-6">
            {{ isEdit ? 'Edit Product' : 'Add New Product' }}
          </h2>
          
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="input-field"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select v-model="formData.category_id" required class="input-field">
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Price (Rp)</label>
              <input
                v-model.number="formData.price"
                type="number"
                required
                min="0"
                class="input-field"
                placeholder="Enter price"
              />
            </div>

            <div class="flex gap-3 pt-4">
              <button type="submit" class="flex-1 btn-primary">Save</button>
              <button type="button" @click="closeModal" class="flex-1 btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth',
  title: 'Product Management - Point of Sale'
})

useHead({
  title: 'Product Management - Point of Sale'
})

interface Product {
  id: string
  name: string
  category_id: string
  category_name?: string
  price: number
  image_url?: string | null
}

interface Category {
  id: string
  name: string
}

interface FormData {
  id: string
  name: string
  category_id: string
  price: number
  image_url: string | null
}

const { apiCall } = useApi()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const searchQuery = ref<string>('')
const showModal = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const formData = ref<FormData>({
  id: '',
  name: '',
  category_id: '',
  price: 0,
  image_url: null
})

const filteredProducts = computed<Product[]>(() => {
  if (!searchQuery.value) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter((p: Product) => 
    p.name.toLowerCase().includes(query) || 
    p.category_name?.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await loadData()
})

const loadData = async (): Promise<void> => {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      apiCall('/products'),
      apiCall('/categories')
    ])
    products.value = productsRes
    categories.value = categoriesRes
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const openAddModal = (): void => {
  isEdit.value = false
  formData.value = { id: '', name: '', category_id: '', price: 0, image_url: null }
  showModal.value = true
}

const openEditModal = (product: Product): void => {
  isEdit.value = true
  formData.value = { ...product, image_url: product.image_url || null }
  showModal.value = true
}

const closeModal = (): void => {
  showModal.value = false
}

const saveProduct = async (): Promise<void> => {
  try {
    if (isEdit.value) {
      await apiCall(`/products/${formData.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData.value)
      })
    } else {
      await apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(formData.value)
      })
    }
    
    closeModal()
    await loadData()
  } catch (error: any) {
    alert('Error: ' + error.message)
  }
}

const deleteProduct = async (id: string, name: string): Promise<void> => {
  if (!confirm(`Delete product "${name}"?`)) return
  
  try {
    await apiCall(`/products/${id}`, { method: 'DELETE' })
    alert('Product deleted successfully')
    await loadData()
  } catch (error: any) {
    if (error.message.includes('Cannot delete product')) {
      alert('Cannot delete this product because it exists in order history. You can mark it as inactive in the backend.')
    } else {
      alert('Error: ' + error.message)
    }
  }
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>