<template>
  <div class="flex-1 overflow-y-auto">
    <Header 
      title="Category Management" 
      subtitle="Organize your products with custom categories"
    />
    
    <div class="p-6">
      <div class="flex justify-end mb-6">
        <button @click="openAddModal" class="btn-primary">
          Add New Category
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="card"
        >
          <h3 class="text-xl font-bold text-gray-100 mb-1">{{ category.name }}</h3>
          <p class="text-gray-400 mb-4">{{ category.product_count }} Products</p>
          
          <div class="flex gap-3">
            <button
              @click="openEditModal(category)"
              class="flex-1 btn-secondary"
            >
              Edit
            </button>
            <button
              @click="deleteCategory(category.id)"
              class="flex-1 btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="modal-overlay animate-fade-in" @click.self="closeModal">
        <div class="modal-content animate-scale-in">
          <h2 class="text-2xl font-bold text-gray-100 mb-6">
            {{ isEdit ? 'Edit Category' : 'Add New Category' }}
          </h2>
          
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Category Name</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="input-field"
                placeholder="Enter category name"
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
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth',
  title: 'Category Management - Simple POS'
})

useHead({
  title: 'Category Management - Simple POS'
})

interface Category {
  id: string
  name: string
  product_count?: number
}

interface FormData {
  id: string
  name: string
}

const { apiCall } = useApi()

const categories = ref<Category[]>([])
const showModal = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const formData = ref<FormData>({
  id: '',
  name: ''
})

onMounted(async () => {
  await loadData()
})

const loadData = async (): Promise<void> => {
  try {
    const data = await apiCall('/categories')
    categories.value = data
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const openAddModal = (): void => {
  isEdit.value = false
  formData.value = { id: '', name: '' }
  showModal.value = true
}

const openEditModal = (category: Category): void => {
  isEdit.value = true
  formData.value = { ...category }
  showModal.value = true
}

const closeModal = (): void => {
  showModal.value = false
}

const saveCategory = async (): Promise<void> => {
  try {
    if (isEdit.value) {
      await apiCall(`/categories/${formData.value.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: formData.value.name })
      })
    } else {
      await apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: formData.value.name })
      })
    }
    
    closeModal()
    await loadData()
  } catch (error: any) {
    alert('Error: ' + error.message)
  }
}

const deleteCategory = async (id: string): Promise<void> => {
  if (!confirm('Delete this category? All products in this category will also be deleted.')) return
  
  try {
    await apiCall(`/categories/${id}`, { method: 'DELETE' })
    await loadData()
  } catch (error: any) {
    alert('Error: ' + error.message)
  }
}
</script>