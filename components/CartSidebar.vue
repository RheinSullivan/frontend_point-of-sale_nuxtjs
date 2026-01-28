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
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div v-if="appStore.cart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
          <svg class="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
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
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button
                  @click="appStore.updateCartItemQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                >
                  <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="text-gray-100 font-medium min-w-[2rem] text-center">{{ item.quantity }}</span>
                <button
                  @click="appStore.updateCartItemQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                >
                  <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
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
            :disabled="processing"
            class="w-full btn-primary"
          >
            {{ processing ? 'Processing...' : 'Pay with Cash' }}
          </button>
          <button
            @click="checkout('qris')"
            :disabled="processing"
            class="w-full btn-secondary"
          >
            Pay with QRIS
          </button>
        </div>
      </div>
    </div>

    <div v-if="showQRModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" @click.self="closeQRModal">
      <div class="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-800">
        <h2 class="text-2xl font-bold text-gray-100 mb-4 text-center">Scan QR Code</h2>
        <div class="bg-white p-4 rounded-lg mb-4">
          <canvas ref="qrCanvas" class="w-full"></canvas>
        </div>
        <p class="text-center text-gray-400 mb-4">Scan this QR code with your payment app</p>
        <button @click="closeQRModal" class="w-full btn-secondary">Cancel</button>
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

const processing = ref(false)
const showQRModal = ref(false)
const qrCanvas = ref<HTMLCanvasElement | null>(null)

const subtotal = computed(() => appStore.cartTotal)
const tax = computed(() => Math.round(subtotal.value * 0.1))
const total = computed(() => subtotal.value + tax.value)

const checkout = async (paymentMethod: string) => {
  if (processing.value) return
  
  processing.value = true
  
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
    
    const order = await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
    
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
    alert('Error: ' + error.message)
  } finally {
    processing.value = false
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

<style scoped>
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
</style>