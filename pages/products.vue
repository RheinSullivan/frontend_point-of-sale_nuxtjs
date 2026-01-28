<template>
  <div class="flex-1 overflow-y-auto">
    <Header 
      :title="t('productManagement')" 
      :subtitle="t('viewAddEdit')"
    />
    
    <div class="p-6">
      <div class="flex justify-between">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('searchProducts')"
          class="input-field max-w-md mb-6"
        />
        <div class="flex justify-end mb-6">
          <button @click="openAddModal" class="btn-primary">
            {{ t('addNewProduct') }}
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
            <div class="aspect-[4/3] bg-gray-700 rounded-lg mb-3 overflow-hidden">
              <img 
                v-if="product.images && product.images.length > 0"
                :src="`http://localhost:5000${product.images[0]}`" 
                :alt="product.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="pi pi-image text-gray-500 text-5xl"></i>
              </div>
            </div>
            
            <h3 class="font-semibold text-gray-100 mb-1">{{ product.name }}</h3>
            <p class="text-xl font-bold text-primary mb-1">Rp {{ formatNumber(product.price) }}</p>
            <p class="text-sm text-gray-400 mb-4">{{ t('category') }}: {{ product.category_name }}</p>
            
            <div class="flex gap-3">
              <button
                @click="openEditModal(product)"
                class="flex-1 btn-secondary"
              >
                {{ t('edit') }}
              </button>
              <button
                @click="deleteProduct(product.id, product.name)"
                class="flex-1 btn-danger"
              >
                {{ t('delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="modal-overlay animate-fade-in" @click.self="closeModal">
        <div class="modal-content animate-scale-in max-w-2xl">
          <h2 class="text-2xl font-bold text-gray-100 mb-6">
            {{ isEdit ? t('editProduct') : t('addProduct') }}
          </h2>
          
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('productName') }}</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="input-field"
                :placeholder="t('enterProductName')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('category') }}</label>
              <select v-model="formData.category_id" required class="input-field">
                <option value="">{{ t('selectCategory') }}</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('price') }}</label>
              <input
                v-model.number="formData.price"
                type="number"
                required
                min="0"
                class="input-field"
                :placeholder="t('enterPrice')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('productImages') }}</label>
              <input
                type="file"
                ref="fileInputRef"
                @change="handleFileSelect"
                accept="image/*"
                multiple
                class="hidden"
              />
              <button
                type="button"
                @click="() => fileInputRef?.click()"
                class="w-full px-4 py-3 border-2 border-dashed border-gray-700 rounded-lg hover:border-primary transition-colors text-gray-400 hover:text-primary"
              >
                <i class="pi pi-cloud-upload text-2xl mb-2"></i>
                <p class="text-sm">{{ t('uploadImages') }}</p>
              </button>
              
              <div v-if="formData.images.length > 0" class="grid grid-cols-5 gap-2 mt-3">
                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  class="relative aspect-square rounded-lg overflow-hidden bg-gray-800 group"
                >
                  <img
                    :src="image.startsWith('http') ? image : `http://localhost:5000${image}`"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i class="pi pi-times text-xs"></i>
                  </button>
                </div>
              </div>
              
              <p v-if="uploadError" class="text-sm text-red-400 mt-2">{{ uploadError }}</p>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="submit" :disabled="uploading" class="flex-1 btn-primary">
                {{ uploading ? t('loading') : t('save') }}
              </button>
              <button type="button" @click="closeModal" class="flex-1 btn-secondary">
                {{ t('cancel') }}
              </button>
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
  images: string[]
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
  images: string[]
}

const { apiCall, getToken } = useApi()
const { t } = useI18n()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const searchQuery = ref<string>('')
const showModal = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const uploading = ref<boolean>(false)
const uploadError = ref<string>('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const formData = ref<FormData>({
  id: '',
  name: '',
  category_id: '',
  price: 0,
  images: []
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

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return
  
  uploadError.value = ''
  
  if (formData.value.images.length + files.length > 5) {
    uploadError.value = 'Maximum 5 images allowed'
    return
  }
  
  uploading.value = true
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    if (file.size > 2 * 1024 * 1024) {
      uploadError.value = `${file.name} exceeds 2MB`
      continue
    }
    
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)
      
      const token = getToken()
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      })
      
      const data = await response.json()
      
      if (response.ok) {
        formData.value.images.push(data.image_url)
      } else {
        uploadError.value = data.message || 'Upload failed'
      }
    } catch (error: any) {
      uploadError.value = error.message || 'Upload failed'
    }
  }
  
  uploading.value = false
  target.value = ''
}

const removeImage = (index: number) => {
  formData.value.images.splice(index, 1)
}

const openAddModal = (): void => {
  isEdit.value = false
  formData.value = { id: '', name: '', category_id: '', price: 0, images: [] }
  uploadError.value = ''
  showModal.value = true
}

const openEditModal = (product: Product): void => {
  isEdit.value = true
  formData.value = { 
    id: product.id,
    name: product.name,
    category_id: product.category_id,
    price: product.price,
    images: product.images || []
  }
  uploadError.value = ''
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
      
      if (window.notificationSystem) {
        window.notificationSystem.addNotification('success', t('success'), t('productUpdated'))
      }
    } else {
      await apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(formData.value)
      })
      
      if (window.notificationSystem) {
        window.notificationSystem.addNotification('success', t('success'), t('productCreated'))
      }
    }
    
    closeModal()
    await loadData()
  } catch (error: any) {
    if (window.notificationSystem) {
      window.notificationSystem.addNotification('error', t('error'), error.message)
    }
  }
}

const deleteProduct = async (id: string, name: string): Promise<void> => {
  if (!confirm(`${t('deleteProductConfirm')} "${name}"?`)) return
  
  try {
    await apiCall(`/products/${id}`, { method: 'DELETE' })
    
    if (window.notificationSystem) {
      window.notificationSystem.addNotification('success', t('success'), t('productDeleted'))
    }
    
    await loadData()
  } catch (error: any) {
    if (error.message.includes('Cannot delete product')) {
      if (window.notificationSystem) {
        window.notificationSystem.addNotification('error', t('error'), t('cannotDeleteProduct'))
      }
    } else {
      if (window.notificationSystem) {
        window.notificationSystem.addNotification('error', t('error'), error.message)
      }
    }
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const parent = img.parentElement
  if (parent) {
    img.style.display = 'none'
    const icon = document.createElement('i')
    icon.className = 'pi pi-image text-gray-500 text-3xl'
    parent.appendChild(icon)
    parent.classList.add('flex', 'items-center', 'justify-center')
  }
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>