<template>
  <div
    v-if="appStore.cartOpen"
    class="fixed inset-0 z-50 flex items-end justify-end"
  >
    <div
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="appStore.closeCart"
    ></div>
    
    <div
      class="relative bg-gray-900 border-l border-gray-800 w-full max-w-md h-full flex flex-col animate-slide-in-right"
    >
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h2 class="text-xl font-bold text-gray-100">Shopping Cart</h2>
        <button
          @click="appStore.closeCart"
          class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div v-if="appStore.cart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
          <i class="pi pi-shopping-cart text-6xl mb-4"></i>
          <p class="text-lg font-medium">Your cart is empty</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in appStore.cart"
            :key="item.id"
            class="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-100">{{ item.name }}</h3>
                <p class="text-sm text-gray-400">Rp {{ formatNumber(item.price) }}</p>
              </div>
              <button
                @click="appStore.removeFromCart(item.id)"
                class="text-red-400 hover:text-red-300 transition-colors"
              >
                <i class="pi pi-trash text-lg"></i>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button
                  @click="appStore.updateCartItemQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                >
                  <i class="pi pi-minus text-sm text-gray-300"></i>
                </button>
                <span class="text-gray-100 font-medium min-w-[2rem] text-center">{{ item.quantity }}</span>
                <button
                  @click="appStore.updateCartItemQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                >
                  <i class="pi pi-plus text-sm text-gray-300"></i>
                </button>
              </div>
              <p class="font-bold text-primary">Rp {{ formatNumber(item.price * item.quantity) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="appStore.cart.length > 0" class="border-t border-gray-800 px-6 py-4 space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between text-gray-400">
            <span>Subtotal:</span>
            <span>Rp {{ formatNumber(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-400">
            <span>Tax (10%):</span>
            <span>Rp {{ formatNumber(tax) }}</span>
          </div>
          <div class="flex justify-between text-xl font-bold">
            <span class="text-gray-100">Total:</span>
            <span class="text-primary">Rp {{ formatNumber(total) }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <button
            @click="checkout('cash')"
            :disabled="isProcessing"
            class="w-full btn-primary flex items-center justify-center gap-2"
          >
            <i class="pi pi-money-bill"></i>
            {{ processingType === 'cash' ? 'Processing...' : 'Pay with Cash' }}
          </button>
          <button
            @click="checkout('qris')"
            :disabled="isProcessing"
            class="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <i class="pi pi-qrcode"></i>
            {{ processingType === 'qris' ? 'Processing...' : 'Pay with QRIS' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showQRModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" @click.self="closeQRModal">
      <div class="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-800">
        <h2 class="text-2xl font-bold text-gray-100 mb-4 text-center">Scan QR Code</h2>
        <div class="bg-white p-4 flex justify-center items-center rounded-lg mb-4">
          <canvas ref="qrCanvas" class="w-full"></canvas>
        </div>
        <p class="text-center text-gray-400 mb-4">Scan this QR code with your payment app</p>
        <button @click="closeQRModal" class="w-full btn-secondary flex items-center justify-center gap-2">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '~/stores/app'
import QRCode from 'qrcode'

const appStore = useAppStore()
const { apiCall } = useApi()

const processingType = ref<string>('')
const showQRModal = ref(false)
const qrCanvas = ref<HTMLCanvasElement | null>(null)

const subtotal = computed(() => appStore.cartTotal)
const tax = computed(() => Math.round(subtotal.value * 0.1))
const total = computed(() => subtotal.value + tax.value)

const isProcessing = computed(() => {
  return processingType.value !== ''
})

const checkout = async (paymentMethod: string) => {
  if (processingType.value) return
  
  processingType.value = paymentMethod
  
  try {
    const orderData = {
      items: appStore.cart.map(item => ({
        product_id: item.id,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal: subtotal.value,
      tax: tax.value,
      grand_total: total.value,
      payment_method_id: paymentMethod
    }
    
    console.log('Creating order:', orderData)
    
    const order = await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
    
    console.log('Order created:', order)
    
    if (paymentMethod === 'qris') {
      const qrData = await apiCall(`/orders/${order.id}/create-qris`, {
        method: 'POST'
      })
      
      showQRModal.value = true
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (qrCanvas.value) {
        await QRCode.toCanvas(qrCanvas.value, qrData.qr_string, {
          width: 300,
          margin: 2
        })
      }
    } else {
      await apiCall(`/orders/${order.id}/complete-cash`, {
        method: 'POST'
      })
      
      alert('Order completed successfully!')
      appStore.clearCart()
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    alert('Error: ' + (error.message || 'Checkout failed'))
  } finally {
    processingType.value = ''
  }
}

const closeQRModal = () => {
  showQRModal.value = false
  appStore.clearCart()
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>