import { defineStore } from 'pinia'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category_id?: string
  category_name?: string
  images?: string[]
}

interface AppState {
  sidebarOpen: boolean
  cartOpen: boolean
  cart: CartItem[]
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarOpen: true,
    cartOpen: false,
    cart: []
  }),

  getters: {
    cartItemCount: (state): number => {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },

    cartTotal: (state): number => {
      return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    cartSubtotal: (state): number => {
      return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    cartTax: (state): number => {
      return Math.round(state.cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.1)
    },

    cartGrandTotal: (state): number => {
      const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
      const tax = Math.round(subtotal * 0.1)
      return subtotal + tax
    }
  },

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    openCart() {
      this.cartOpen = true
    },

    closeCart() {
      this.cartOpen = false
    },

    addToCart(product: any) {
      const existingItem = this.cart.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category_id: product.category_id,
          category_name: product.category_name,
          images: product.images || []
        })
      }
    },

    removeFromCart(productId: string) {
      const index = this.cart.findIndex(item => item.id === productId)
      if (index !== -1) {
        this.cart.splice(index, 1)
      }
    },

    updateCartItemQuantity(productId: string, quantity: number) {
      const item = this.cart.find(item => item.id === productId)
      
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
        }
      }
    },

    clearCart() {
      this.cart = []
      this.cartOpen = false
    },

    getCartItemsForOrder() {
      return this.cart.map(item => ({
        product_id: item.id,
        price: item.price,
        quantity: item.quantity
      }))
    }
  }
})