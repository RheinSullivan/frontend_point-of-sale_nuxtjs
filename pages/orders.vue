<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input v-model="startDate" type="date" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input v-model="endDate" type="date" class="input-field" />
        </div>
        <div class="flex items-end">
          <button @click="loadOrders" class="btn-primary">Filter</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cashier</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-mono text-gray-900">{{ order.id.slice(0, 8) }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDateTime(order.created_at) }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ order.cashier_name }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-900">Rp {{ formatNumber(order.grand_total) }}</td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    order.status === 'DONE' ? 'bg-green-100 text-green-800' :
                    order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <button @click="viewDetail(order.id)" class="text-primary hover:text-primary-dark">
                  Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Order Details</h2>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedOrder" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
            <div>
              <p class="text-sm text-gray-500">Order ID</p>
              <p class="font-mono">{{ selectedOrder.id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Date</p>
              <p class="font-semibold">{{ formatDateTime(selectedOrder.created_at) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Cashier</p>
              <p class="font-semibold">{{ selectedOrder.cashier_name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  selectedOrder.status === 'DONE' ? 'bg-green-100 text-green-800' :
                  selectedOrder.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ selectedOrder.status }}
              </span>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-3">Items</h3>
            <div class="space-y-2">
              <div
                v-for="item in selectedOrder.items"
                :key="item.id"
                class="flex justify-between items-center bg-gray-50 rounded-lg p-3"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ item.product_name }}</p>
                  <p class="text-sm text-gray-500">{{ item.quantity }} x Rp {{ formatNumber(item.price) }}</p>
                </div>
                <p class="font-semibold text-primary">Rp {{ formatNumber(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>

          <div class="border-t pt-4 space-y-2">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>Rp {{ formatNumber(selectedOrder.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Tax:</span>
              <span>Rp {{ formatNumber(selectedOrder.tax) }}</span>
            </div>
            <div class="flex justify-between text-xl font-bold">
              <span>Grand Total:</span>
              <span class="text-primary">Rp {{ formatNumber(selectedOrder.grand_total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  created_at: string
  cashier_name: string
  grand_total: number
  status: string
  subtotal: number
  tax: number
  items: OrderItem[]
}

definePageMeta({
  middleware: 'auth'
})

const { apiCall } = useApi()

const orders = ref<Order[]>([])
const startDate = ref<string>('')
const endDate = ref<string>('')
const showDetailModal = ref<boolean>(false)
const selectedOrder = ref<Order | null>(null)

onMounted(async () => {
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  endDate.value = today.toISOString().split('T')[0]
  startDate.value = weekAgo.toISOString().split('T')[0]
  
  await loadOrders()
})

const loadOrders = async (): Promise<void> => {
  try {
    let endpoint = '/orders'
    if (startDate.value && endDate.value) {
      endpoint += `?start_date=${startDate.value}&end_date=${endDate.value}`
    }
    
    const data = await apiCall(endpoint)
    orders.value = data
  } catch (error) {
    console.error('Error loading orders:', error)
  }
}

const viewDetail = async (id: string): Promise<void> => {
  try {
    const data = await apiCall(`/orders/${id}`)
    selectedOrder.value = data
    showDetailModal.value = true
  } catch (error: any) {
    alert('Error: ' + error.message)
  }
}

const closeDetail = (): void => {
  showDetailModal.value = false
  selectedOrder.value = null
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
