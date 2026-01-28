<template>
  <div class="flex-1 overflow-y-auto">
    <Header 
      :title="t('categoryManagement')" 
      :subtitle="t('organizeProducts')"
    />
    
    <div class="p-6">
      <div class="flex justify-end mb-6">
        <button @click="openAddModal" class="btn-primary">
          {{ t('addNewCategory') }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="card"
        >
          <h3 class="text-xl font-bold text-gray-100 mb-1">{{ category.name }}</h3>
          <p class="text-gray-400 mb-4">{{ category.product_count }} {{ t('products') }}</p>
          
          <div class="flex gap-3">
            <button
              @click="openEditModal(category)"
              class="flex-1 btn-secondary"
            >
              {{ t('edit') }}
            </button>
            <button
              @click="deleteCategory(category.id)"
              class="flex-1 btn-danger"
            >
              {{ t('delete') }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="modal-overlay animate-fade-in" @click.self="closeModal">
        <div class="modal-content animate-scale-in">
          <h2 class="text-2xl font-bold text-gray-100 mb-6">
            {{ isEdit ? t('editCategory') : t('addCategory') }}
          </h2>
          
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('categoryName') }}</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="input-field"
                :placeholder="t('enterCategoryName')"
              />
            </div>

            <div class="flex gap-3 pt-4">
              <button type="submit" class="flex-1 btn-primary">{{ t('save') }}</button>
              <button type="button" @click="closeModal" class="flex-1 btn-secondary">{{ t('cancel') }}</button>
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
const { t } = useI18n()

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
      
      if (window.notificationSystem) {
        window.notificationSystem.addNotification('success', t('success'), t('categoryUpdated'))
      }
    } else {
      await apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: formData.value.name })
      })
      
      if (window.notificationSystem) {
        window.notificationSystem.addNotification('success', t('success'), t('categoryCreated'))
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

const deleteCategory = async (id: string): Promise<void> => {
  if (!confirm(t('deleteCategoryConfirm'))) return
  
  try {
    await apiCall(`/categories/${id}`, { method: 'DELETE' })
    
    if (window.notificationSystem) {
      window.notificationSystem.addNotification('success', t('success'), t('categoryDeleted'))
    }
    
    await loadData()
  } catch (error: any) {
    if (window.notificationSystem) {
      window.notificationSystem.addNotification('error', t('error'), error.message)
    }
  }
}
</script>