<template>
  <div
    v-if="appStore.cartOpen"
    class="fixed inset-0 z-50 overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-black bg-opacity-70"
      @click="appStore.closeCart"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-md w-full bg-gray-900 border-l border-gray-800 shadow-xl flex flex-col animate-slide-in-right">
      <div class="flex items-center justify-between p-6 border-b border-gray-800">
        <h2 class="text-2xl font-bold text-gray-100">Create New Order</h2>
        <button
          @click="appStore.closeCart"
          class="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="appStore.cart.length === 0" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="mt-4 text-gray-500">Add products to your cart and create order</p>
        </div>
      </div>

      <div v-else>
        <div class="px-6 py-4 border-b border-gray-800">
          <p class="text-sm text-gray-400">Order Items</p>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div
            v-for="item in appStore.cart"
            :key="item.id"
            class="flex items-center gap-3 bg-gray-800 rounded-lg p-3"
          >
            <div class="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-100 truncate">{{ item.name }}</h3>
              <p class="text-sm text-gray-400">Rp {{ formatNumber(item.price) }} x {{ item.quantity }}</p>
              <p class="text-sm font-semibold text-primary">Rp {{ formatNumber(item.price * item.quantity) }}</p>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="appStore.updateCartItemQuantity(item.id, item.quantity - 1)"
                class="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors text-gray-300"
              >
                -
              </button>
              <span class="font-semibold w-8 text-center text-gray-100">{{ item.quantity }}</span>
              <button
                @click="appStore.updateCartItemQuantity(item.id, item.quantity + 1)"
                class="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors text-gray-300"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 p-6 space-y-4">
          <div>
            <p class="text-sm text-gray-400 mb-3">Payment Details</p>
            <div class="space-y-2">
              <div class="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>Rp {{ formatNumber(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>Rp {{ formatNumber(tax) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-100 pt-2 border-t border-gray-800">
                <span>Total</span>
                <span class="text-primary">Rp {{ formatNumber(grandTotal) }}</span>
              </div>
            </div>
          </div>

          <button
            @click="createOrder"
            class="w-full btn-primary"
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showQRModal"
    class="modal-overlay animate-fade-in"
  >
    <div class="modal-content animate-scale-in">
      <h3 class="text-2xl font-bold text-gray-100 mb-4">Finish Payment</h3>
      
      <div v-if="qrLoading" class="flex justify-center py-12">
        <div class="spinner w-12 h-12"></div>
      </div>
      
      <div v-else-if="qrCode" class="mb-6">
        <div ref="qrContainer" class="flex justify-center bg-white p-4 rounded-lg"></div>
        <p class="text-center text-2xl font-bold text-primary mt-4">Rp {{ formatNumber(grandTotal) }}</p>
        <p class="text-center text-sm text-gray-400 mt-2">Transaction ID: {{ currentOrderId.slice(0, 13) }}...</p>
      </div>

      <div class="space-y-3">
        <button
          @click="simulatePayment"
          class="w-full btn-success"
        >
          Simulate Payment
        </button>
        <button
          @click="closeQRModal"
          class="w-full btn-secondary"
        >
          Done
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showSuccessModal"
    class="modal-overlay animate-fade-in"
  >
    <div class="modal-content animate-scale-in text-center">
      <div class="mb-4 bg-primary rounded-full w-16 h-16 mx-auto flex items-center justify-center">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-100 mb-2">Successfully created an order</h3>
      <p class="text-gray-400 mb-6">Your order has been processed successfully</p>
      <button
        @click="closeSuccessModal"
        class="btn-primary"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted } from 'vue'
import { useAppStore } from '~/stores/app'
import QRCode from 'qrcode'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

const appStore = useAppStore()
const { apiCall } = useApi()

const showQRModal = ref<boolean>(false)
const showSuccessModal = ref<boolean>(false)
const qrCode = ref<string>('')
const qrLoading = ref<boolean>(false)
const qrContainer = ref<HTMLElement | null>(null)
const currentOrderId = ref<string>('')

const subtotal = computed(() => appStore.cartTotal)
const tax = computed(() => Math.floor(subtotal.value * 0.1))
const grandTotal = computed(() => subtotal.value + tax.value)

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}

const createOrder = async (): Promise<void> => {
  try {
    qrLoading.value = true
    showQRModal.value = true

    const orderData = {
      items: appStore.cart.map((item: CartItem) => ({
        product_id: item.id,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal: subtotal.value,
      tax: tax.value,
      grand_total: grandTotal.value,
      payment_method_id: 'qris'
    }

    const orderResponse = await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })

    currentOrderId.value = orderResponse.id

    const qrResponse = await apiCall(`/orders/${orderResponse.id}/create-qris`, {
      method: 'POST'
    })

    qrCode.value = qrResponse.qr_string
    qrLoading.value = false

    await nextTick()
    
    if (qrContainer.value) {
      const canvas = await QRCode.toCanvas(qrResponse.qr_string, {
        width: 300,
        margin: 2
      })
      qrContainer.value.innerHTML = ''
      qrContainer.value.appendChild(canvas)
    }
  } catch (error) {
    console.error('QR Payment error:', error)
    qrLoading.value = false
    showQRModal.value = false
    alert('Failed to generate QR code')
  }
}

const simulatePayment = async (): Promise<void> => {
  try {
    await apiCall(`/orders/${currentOrderId.value}/complete-cash`, {
      method: 'POST'
    })

    closeQRModal()
    appStore.clearCart()
    showSuccessModal.value = true
  } catch (error) {
    console.error('Payment error:', error)
    alert('Payment failed')
  }
}

const closeQRModal = (): void => {
  showQRModal.value = false
  qrCode.value = ''
}

const closeSuccessModal = (): void => {
  showSuccessModal.value = false
}
</script>