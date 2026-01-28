<template>
  <div class="flex-1 overflow-y-auto">
    <Header 
      title="Sales Dashboard" 
      subtitle="Monitor your sales performance and analytics"
    />
    
    <div class="p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card bg-gradient-to-br from-blue-600 to-blue-700 border-blue-600">
          <p class="text-sm text-blue-100 mb-1">Today's Sales</p>
          <p class="text-3xl font-bold text-white">Rp {{ formatNumber(stats.today_sales) }}</p>
          <p class="text-sm text-blue-100 mt-1">{{ stats.today_orders }} orders</p>
        </div>

        <div class="card bg-gradient-to-br from-primary to-primary-dark border-primary">
          <p class="text-sm text-green-100 mb-1">Monthly Sales</p>
          <p class="text-3xl font-bold text-white">Rp {{ formatNumber(stats.month_sales) }}</p>
          <p class="text-sm text-green-100 mt-1">{{ stats.month_orders }} orders</p>
        </div>

        <div class="card bg-gradient-to-br from-purple-600 to-purple-700 border-purple-600">
          <p class="text-sm text-purple-100 mb-1">Total Products</p>
          <p class="text-3xl font-bold text-white">{{ stats.total_products }}</p>
        </div>

        <div class="card bg-gradient-to-br from-orange-600 to-orange-700 border-orange-600">
          <p class="text-sm text-orange-100 mb-1">Categories</p>
          <p class="text-3xl font-bold text-white">{{ stats.total_categories }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="text-xl font-bold text-gray-100 mb-4">Sales Chart (7 Days)</h2>
          <canvas ref="salesChart"></canvas>
        </div>

        <div class="card">
          <h2 class="text-xl font-bold text-gray-100 mb-4">Top Products</h2>
          <div class="space-y-3">
            <div
              v-for="product in topProducts"
              :key="product.name"
              class="flex justify-between items-center p-3 bg-gray-800 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-100">{{ product.name }}</p>
                <p class="text-sm text-gray-400">{{ product.total_sold }} sold</p>
              </div>
              <p class="font-bold text-primary">Rp {{ formatNumber(product.total_revenue) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

definePageMeta({
  middleware: 'auth',
  title: 'Sales Dashboard - Simple POS'
})

useHead({
  title: 'Sales Dashboard - Simple POS'
})

interface Stats {
  today_sales: number
  today_orders: number
  month_sales: number
  month_orders: number
  total_products: number
  total_categories: number
}

interface SalesData {
  date: string
  total_sales: number
}

interface TopProduct {
  name: string
  total_sold: number
  total_revenue: number
}

const { apiCall } = useApi()

const stats = ref<Stats>({
  today_sales: 0,
  today_orders: 0,
  month_sales: 0,
  month_orders: 0,
  total_products: 0,
  total_categories: 0
})

const salesData = ref<SalesData[]>([])
const topProducts = ref<TopProduct[]>([])
const salesChart = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

onMounted(async () => {
  await loadData()
})

const loadData = async (): Promise<void> => {
  try {
    const [statsRes, salesRes, topProductsRes] = await Promise.all([
      apiCall('/dashboard/stats'),
      apiCall('/dashboard/sales-chart?days=7'),
      apiCall('/dashboard/top-products?limit=5')
    ])
    
    stats.value = statsRes
    salesData.value = salesRes
    topProducts.value = topProductsRes
    
    await nextTick()
    createChart()
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const createChart = (): void => {
  if (chartInstance) chartInstance.destroy()
  
  if (salesChart.value) {
    chartInstance = new Chart(salesChart.value, {
      type: 'line',
      data: {
        labels: salesData.value.map((d: SalesData) => new Date(d.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })),
        datasets: [{
          label: 'Sales',
          data: salesData.value.map((d: SalesData) => d.total_sales),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { 
            display: false 
          }
        },
        scales: {
          y: {
            grid: {
              color: '#374151'
            },
            ticks: {
              color: '#9ca3af'
            }
          },
          x: {
            grid: {
              color: '#374151'
            },
            ticks: {
              color: '#9ca3af'
            }
          }
        }
      }
    })
  }
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>