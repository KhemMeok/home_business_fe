<template>
  <div class="min-h-screen bg-background">
    <!-- Authentication screens -->
    <template v-if="!user">
      <LoginForm
        v-if="authMode === 'login'"
        @login="handleLogin"
        @show-register="authMode = 'register'"
      />
      <RegisterForm
        v-else-if="authMode === 'register'"
        @register="handleRegister"
        @show-login="authMode = 'login'"
      />
    </template>

    <!-- Main application -->
    <template v-else>
      <MobileNavigation
        :business-name="user.businessName"
        :low-stock-count="lowStockCount"
        :unpaid-invoices-count="unpaidInvoicesCount"
        @logout="handleLogout"
      />

      <main class="px-4 py-4 sm:px-6">
        <div class="mx-auto max-w-7xl">
          <router-view />
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from './components/auth/LoginForm.vue'
import RegisterForm from './components/auth/RegisterForm.vue'
import MobileNavigation from './components/layout/MobileNavigation.vue'

// Reactive state
const user = ref(null)
const authMode = ref('login')
const router = useRouter()

const products = ref([])
const customers = ref([])
const invoices = ref([])

// Mock data generator
const generateMockData = () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Wireless Headphones',
      sku: 'WH001',
      category: 'Electronics',
      costPrice: 50,
      sellingPrice: 99.99,
      stock: 25,
      lowStockAlert: 5,
      description: 'High-quality wireless headphones',
    },
    {
      id: '2',
      name: 'Coffee Mug',
      sku: 'CM001',
      category: 'Home & Garden',
      costPrice: 3,
      sellingPrice: 12.99,
      stock: 50,
      lowStockAlert: 10,
      description: 'Ceramic coffee mug',
    },
    {
      id: '3',
      name: 'Laptop Stand',
      sku: 'LS001',
      category: 'Office Supplies',
      costPrice: 20,
      sellingPrice: 45.99,
      stock: 3,
      lowStockAlert: 5,
      description: 'Adjustable aluminum laptop stand',
    },
    {
      id: '4',
      name: 'Bluetooth Speaker',
      sku: 'BS001',
      category: 'Electronics',
      costPrice: 25,
      sellingPrice: 59.99,
      stock: 15,
      lowStockAlert: 5,
      description: 'Portable Bluetooth speaker',
    },
    {
      id: '5',
      name: 'Desk Organizer',
      sku: 'DO001',
      category: 'Office Supplies',
      costPrice: 8,
      sellingPrice: 24.99,
      stock: 2,
      lowStockAlert: 5,
      description: 'Bamboo desk organizer',
    },
  ]

  const mockCustomers = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1(555)123-4567',
      company: 'TechCorp Inc.',
      address: '123 Main St',
      totalInvoices: 5,
      totalSpent: 1250.5,
      lastOrderDate: '2024-05-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1(555)987-6543',
      company: 'Design Studio',
      address: '456 Oak Ave',
      totalInvoices: 3,
      totalSpent: 680.25,
      lastOrderDate: '2024-05-10',
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+1(555)555-0123',
      totalInvoices: 2,
      totalSpent: 299.98,
      lastOrderDate: '2024-04-28',
    },
  ]

  const mockInvoices = [
    {
      id: '1',
      number: 'INV-001',
      customerId: '1',
      customerName: 'John Smith',
      items: [
        {
          productId: '1',
          productName: 'Wireless Headphones',
          quantity: 2,
          price: 99.99,
          total: 199.98,
        },
      ],
      subtotal: 199.98,
      tax: 19.99,
      total: 219.97,
      status: 'paid',
      date: '2024-05-15',
      dueDate: '2024-05-30',
    },
    {
      id: '2',
      number: 'INV-002',
      customerId: '2',
      customerName: 'Sarah Johnson',
      items: [
        { productId: '3', productName: 'Laptop Stand', quantity: 1, price: 45.99, total: 45.99 },
      ],
      subtotal: 45.99,
      tax: 4.6,
      total: 50.59,
      status: 'sent',
      date: '2024-05-10',
      dueDate: '2024-05-25',
    },
    {
      id: '3',
      number: 'INV-003',
      customerId: '3',
      customerName: 'Mike Wilson',
      items: [
        { productId: '2', productName: 'Coffee Mug', quantity: 10, price: 12.99, total: 129.9 },
      ],
      subtotal: 129.9,
      tax: 12.99,
      total: 142.89,
      status: 'overdue',
      date: '2024-04-28',
      dueDate: '2024-05-13',
    },
  ]

  return { products: mockProducts, customers: mockCustomers, invoices: mockInvoices }
}

// Computed properties
const lowStockCount = computed(
  () => products.value.filter((p) => p.stock <= p.lowStockAlert).length,
)
const unpaidInvoicesCount = computed(() => invoices.value.filter((i) => i.status !== 'paid').length)
const dashboardData = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const thisMonth = new Date().getMonth()
  const paidInvoices = invoices.value.filter((i) => i.status === 'paid')
  const unpaidInvoices = invoices.value.filter((i) => i.status !== 'paid')

  return {
    todaySales: paidInvoices.filter((i) => i.date === today).reduce((sum, i) => sum + i.total, 0),
    monthSales: paidInvoices
      .filter((i) => new Date(i.date).getMonth() === thisMonth)
      .reduce((sum, i) => sum + i.total, 0),
    unpaidInvoices: {
      count: unpaidInvoices.length,
      total: unpaidInvoices.reduce((sum, i) => sum + i.total, 0),
    },
    lowStockItems: lowStockCount.value,
    recentActivity: invoices.value
      .slice(-3)
      .map((i) => ({
        id: i.id,
        type: 'invoice',
        description: `Invoice ${i.number} for ${i.customerName}`,
        amount: i.total,
        time: new Date(i.date).toLocaleDateString(),
      }))
      .reverse(),
  }
})

// Provide data and handlers to child components via `provide/inject`
provide('user', user)
provide('products', products)
provide('customers', customers)
provide('invoices', invoices)
provide(
  'currency',
  computed(() => user.value?.currency || 'USD'),
)
provide('taxRate', ref(0.1))
provide('dashboardData', dashboardData)

const generateId = () => Math.random().toString(36).substr(2, 9)
const generateInvoiceNumber = () => `INV-${String(invoices.value.length + 1).padStart(3, '0')}`

const onAddProduct = (product) => products.value.push({ ...product, id: generateId() })
provide('onAddProduct', onAddProduct)

const onUpdateProduct = (id, updates) => {
  const index = products.value.findIndex((p) => p.id === id)
  if (index !== -1) products.value[index] = { ...products.value[index], ...updates }
}
provide('onUpdateProduct', onUpdateProduct)

const onAddCustomer = (customer) => {
  customers.value.push({ ...customer, id: generateId(), totalInvoices: 0, totalSpent: 0 })
}
provide('onAddCustomer', onAddCustomer)

const onUpdateCustomer = (id, updates) => {
  const index = customers.value.findIndex((c) => c.id === id)
  if (index !== -1) customers.value[index] = { ...customers.value[index], ...updates }
}
provide('onUpdateCustomer', onUpdateCustomer)

const onViewCustomer = (customer) => console.log('Viewing customer:', customer)
provide('onViewCustomer', onViewCustomer)

const onCreateInvoice = (invoice) => {
  const newInvoice = {
    ...invoice,
    id: generateId(),
    number: generateInvoiceNumber(),
    date: new Date().toISOString().split('T')[0],
  }
  invoices.value.push(newInvoice)
  const customer = customers.value.find((c) => c.id === invoice.customerId)
  if (customer) {
    customer.totalInvoices += 1
    customer.totalSpent += invoice.total || 0
    customer.lastOrderDate = new Date().toISOString().split('T')[0]
  }
  if (invoice.status !== 'draft') {
    invoice.items.forEach((item) => {
      const product = products.value.find((p) => p.id === item.productId)
      if (product) product.stock = Math.max(0, product.stock - item.quantity)
    })
  }
}
provide('onCreateInvoice', onCreateInvoice)

const onUpdateInvoice = (id, updates) => {
  const index = invoices.value.findIndex((i) => i.id === id)
  if (index !== -1) invoices.value[index] = { ...invoices.value[index], ...updates }
}
provide('onUpdateInvoice', onUpdateInvoice)

const onDeleteInvoice = (id) => {
  invoices.value = invoices.value.filter((i) => i.id !== id)
}
provide('onDeleteInvoice', onDeleteInvoice)

// Auth handlers
const handleLogin = (email, password) => {
  user.value = { id: '1', email, businessName: 'My Vue Business', currency: 'USD' }
  router.push('/')
}
const handleRegister = (data) => {
  user.value = {
    id: '1',
    email: data.email,
    businessName: data.businessName,
    currency: data.currency,
  }
  router.push('/')
}
const handleLogout = () => {
  user.value = null
  authMode.value = 'login'
}

onMounted(() => {
  const mockData = generateMockData()
  products.value = mockData.products
  customers.value = mockData.customers
  invoices.value = mockData.invoices
})
</script>
