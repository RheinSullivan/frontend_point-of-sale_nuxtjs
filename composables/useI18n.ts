import { ref, computed } from 'vue'

type Locale = 'en' | 'id'

const currentLocale = ref<Locale>('id')

const translations = {
  en: {
    dashboard: 'Dashboard',
    createOrder: 'Create Order',
    categoryManagement: 'Category Management',
    productManagement: 'Product Management',
    logout: 'Logout',
    ownerStore: 'Owner Store',
    employee: 'Employee',
    selectProducts: 'Select products to add to cart',
    searchProducts: 'Search products...',
    all: 'All',
    products: 'Products',
    addToCart: 'Add to Cart',
    cart: 'Cart',
    shoppingCart: 'Shopping Cart',
    yourCartIsEmpty: 'Your cart is empty',
    subtotal: 'Subtotal',
    tax: 'Tax',
    total: 'Total',
    payWithCash: 'Pay with Cash',
    payWithQRIS: 'Pay with QRIS',
    processing: 'Processing...',
    scanQRCode: 'Scan QR Code',
    scanThisQRCode: 'Scan this QR code with your payment app',
    cancel: 'Cancel',
    salesDashboard: 'Sales Dashboard',
    monitorSales: 'Monitor your sales performance and analytics',
    todaySales: "Today's Sales",
    orders: 'orders',
    monthlySales: 'Monthly Sales',
    totalProducts: 'Total Products',
    categories: 'Categories',
    salesChart: 'Sales Chart (7 Days)',
    topProducts: 'Top Products',
    sold: 'sold',
    organizeProducts: 'Organize your products with custom categories',
    addNewCategory: 'Add New Category',
    edit: 'Edit',
    delete: 'Delete',
    editCategory: 'Edit Category',
    addCategory: 'Add New Category',
    categoryName: 'Category Name',
    enterCategoryName: 'Enter category name',
    save: 'Save',
    viewAddEdit: 'View, add, edit, and delete products in your inventory',
    addNewProduct: 'Add New Product',
    category: 'Category',
    editProduct: 'Edit Product',
    addProduct: 'Add New Product',
    productName: 'Product Name',
    enterProductName: 'Enter product name',
    selectCategory: 'Select category',
    price: 'Price (Rp)',
    enterPrice: 'Enter price',
    productImages: 'Product Images',
    uploadImages: 'Upload Images (Max 5, 2MB each)',
    pleaseLogin: 'Please login to continue dashboard POS',
    username: 'Username',
    enterUsername: 'Enter username',
    password: 'Password',
    enterPassword: 'Enter password',
    login: 'Login',
    loading: 'Loading...',
    orderCreatedSuccessfully: 'Order created successfully!',
    orderCompletedSuccessfully: 'Order completed successfully!',
    categoryCreated: 'Category created successfully',
    categoryUpdated: 'Category updated successfully',
    categoryDeleted: 'Category deleted successfully',
    productCreated: 'Product created successfully',
    productUpdated: 'Product updated successfully',
    productDeleted: 'Product deleted successfully',
    deleteCategoryConfirm: 'Delete this category? All products in this category will also be deleted.',
    deleteProductConfirm: 'Delete product',
    cannotDeleteProduct: 'Cannot delete this product because it exists in order history.',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    vyagraNexus: 'Vyagra Nexus',
    pointOfSale: 'Point of Sale',
    copyright: 'Copyright',
    allRightsReserved: 'All rights reserved',
    simplePOS: 'Point of Sales'
  },
  id: {
    dashboard: 'Dasbor',
    createOrder: 'Buat Pesanan',
    categoryManagement: 'Manajemen Kategori',
    productManagement: 'Manajemen Produk',
    logout: 'Keluar',
    ownerStore: 'Pemilik Toko',
    employee: 'Karyawan',
    selectProducts: 'Pilih produk untuk ditambahkan ke keranjang',
    searchProducts: 'Cari produk...',
    all: 'Semua',
    products: 'Produk',
    addToCart: 'Tambah ke Keranjang',
    cart: 'Keranjang',
    shoppingCart: 'Keranjang Belanja',
    yourCartIsEmpty: 'Keranjang Anda kosong',
    subtotal: 'Subtotal',
    tax: 'Pajak',
    total: 'Total',
    payWithCash: 'Bayar Tunai',
    payWithQRIS: 'Bayar dengan QRIS',
    processing: 'Memproses...',
    scanQRCode: 'Pindai Kode QR',
    scanThisQRCode: 'Pindai kode QR ini dengan aplikasi pembayaran Anda',
    cancel: 'Batal',
    salesDashboard: 'Dasbor Penjualan',
    monitorSales: 'Pantau kinerja dan analitik penjualan Anda',
    todaySales: 'Penjualan Hari Ini',
    orders: 'pesanan',
    monthlySales: 'Penjualan Bulanan',
    totalProducts: 'Total Produk',
    categories: 'Kategori',
    salesChart: 'Grafik Penjualan (7 Hari)',
    topProducts: 'Produk Terlaris',
    sold: 'terjual',
    organizeProducts: 'Atur produk Anda dengan kategori khusus',
    addNewCategory: 'Tambah Kategori Baru',
    edit: 'Ubah',
    delete: 'Hapus',
    editCategory: 'Ubah Kategori',
    addCategory: 'Tambah Kategori Baru',
    categoryName: 'Nama Kategori',
    enterCategoryName: 'Masukkan nama kategori',
    save: 'Simpan',
    viewAddEdit: 'Lihat, tambah, ubah, dan hapus produk di inventaris Anda',
    addNewProduct: 'Tambah Produk Baru',
    category: 'Kategori',
    editProduct: 'Ubah Produk',
    addProduct: 'Tambah Produk Baru',
    productName: 'Nama Produk',
    enterProductName: 'Masukkan nama produk',
    selectCategory: 'Pilih kategori',
    price: 'Harga (Rp)',
    enterPrice: 'Masukkan harga',
    productImages: 'Gambar Produk',
    uploadImages: 'Unggah Gambar (Maks 5, 2MB per gambar)',
    pleaseLogin: 'Silakan login untuk melanjutkan ke dasbor POS',
    username: 'Nama Pengguna',
    enterUsername: 'Masukkan nama pengguna',
    password: 'Kata Sandi',
    enterPassword: 'Masukkan kata sandi',
    login: 'Masuk',
    loading: 'Memuat...',
    orderCreatedSuccessfully: 'Pesanan berhasil dibuat!',
    orderCompletedSuccessfully: 'Pesanan berhasil diselesaikan!',
    categoryCreated: 'Kategori berhasil dibuat',
    categoryUpdated: 'Kategori berhasil diubah',
    categoryDeleted: 'Kategori berhasil dihapus',
    productCreated: 'Produk berhasil dibuat',
    productUpdated: 'Produk berhasil diubah',
    productDeleted: 'Produk berhasil dihapus',
    deleteCategoryConfirm: 'Hapus kategori ini? Semua produk dalam kategori ini juga akan dihapus.',
    deleteProductConfirm: 'Hapus produk',
    cannotDeleteProduct: 'Tidak dapat menghapus produk ini karena ada dalam riwayat pesanan.',
    error: 'Kesalahan',
    success: 'Berhasil',
    warning: 'Peringatan',
    info: 'Info',
    vyagraNexus: 'Vyagra Nexus',
    pointOfSale: 'Point of Sale',
    copyright: 'Hak Cipta',
    allRightsReserved: 'Semua hak dilindungi',
    simplePOS: 'Point of Sales'
  }
}

export const useI18n = () => {
  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
    if (process.client) {
      localStorage.setItem('locale', locale)
    }
  }

  const loadLocale = () => {
    if (process.client) {
      const saved = localStorage.getItem('locale') as Locale
      if (saved && (saved === 'en' || saved === 'id')) {
        currentLocale.value = saved
      }
    }
  }

  const t = (key: keyof typeof translations.en): string => {
    return translations[currentLocale.value][key] || key
  }

  const locale = computed(() => currentLocale.value)

  return {
    t,
    setLocale,
    loadLocale,
    locale
  }
}