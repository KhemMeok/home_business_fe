<template>
  <div class="space-y-4 pb-20 sm:pb-6">
    <!-- Header -->
    <div class="space-y-3">
      <p class="text-muted-foreground">Create and manage customer invoices</p>
      <Button @click="isCreateDialogOpen = true" class="w-full sm:w-auto">
        <Plus class="h-4 w-4 mr-2" /> Create Invoice
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <Card
        ><CardHeader><CardTitle class="text-sm">Total Invoices</CardTitle></CardHeader
        ><CardContent
          ><div class="text-2xl font-bold">{{ invoices.length }}</div></CardContent
        ></Card
      >
      <Card
        ><CardHeader><CardTitle class="text-sm">Unpaid</CardTitle></CardHeader
        ><CardContent
          ><div class="text-2xl font-bold text-orange-500">
            {{ unpaidInvoicesCount }}
          </div></CardContent
        ></Card
      >
      <Card
        ><CardHeader><CardTitle class="text-sm">Overdue</CardTitle></CardHeader
        ><CardContent
          ><div class="text-2xl font-bold text-destructive">
            {{ overdueInvoicesCount }}
          </div></CardContent
        ></Card
      >
      <Card
        ><CardHeader><CardTitle class="text-sm">Revenue</CardTitle></CardHeader
        ><CardContent
          ><div class="text-2xl font-bold">{{ formatCurrency(totalRevenue) }}</div></CardContent
        ></Card
      >
    </div>

    <!-- Filters -->
    <Card
      ><CardContent class="pt-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" /><Input
              v-model="searchTerm"
              placeholder="Search invoices..."
              class="pl-9 h-12"
            />
          </div>
          <Select v-model="statusFilter" class="w-full sm:w-[180px] h-12">
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </Select>
        </div>
      </CardContent></Card
    >

    <!-- Table -->
    <Card>
      <Table>
        <TableHeader
          ><TableRow
            ><TableHead>Invoice #</TableHead><TableHead>Customer</TableHead
            ><TableHead>Date</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead
            ><TableHead>Actions</TableHead></TableRow
          ></TableHeader
        >
        <TableBody>
          <TableRow v-for="invoice in filteredInvoices" :key="invoice.id">
            <TableCell class="font-medium">{{ invoice.number }}</TableCell>
            <TableCell>{{ invoice.customerName }}</TableCell>
            <TableCell>{{ new Date(invoice.date).toLocaleDateString() }}</TableCell>
            <TableCell>{{ formatCurrency(invoice.total) }}</TableCell>
            <TableCell
              ><Badge
                :variant="getStatusBadge(invoice.status).variant"
                :class="getStatusBadge(invoice.status).class"
                >{{ getStatusBadge(invoice.status).text }}</Badge
              ></TableCell
            >
            <TableCell
              ><div class="flex space-x-2">
                <Button variant="ghost" size="sm" @click="viewingInvoice = invoice"
                  ><Eye class="h-4 w-4" /></Button
                ><Button variant="ghost" size="sm" @click="$emit('deleteInvoice', invoice.id)"
                  ><Trash2 class="h-4 w-4"
                /></Button></div
            ></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <!-- Create/View Dialogs -->
    <Dialog :open="isCreateDialogOpen" @update:open="isCreateDialogOpen = $event">
      <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label>Customer</Label
          ><Select v-model="newInvoice.customerId"
            ><option value="">Select customer</option>
            <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option></Select
          >
        </div>
        <div class="space-y-2">
          <Label>Due Date</Label><Input type="date" v-model="newInvoice.dueDate" />
        </div>
        <div class="space-y-2">
          <Label>Items</Label>
          <div class="flex gap-2">
            <Select v-model="currentItem.productId" class="flex-1"
              ><option value="">Select product</option>
              <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option></Select
            ><Input type="number" v-model.number="currentItem.quantity" class="w-20" /><Button
              @click="addItemToInvoice"
              >Add</Button
            >
          </div>
        </div>
        <div v-if="newInvoice.items.length > 0" class="space-y-2">
          <Label>Invoice Items</Label>
          <div
            v-for="(item, i) in newInvoice.items"
            :key="i"
            class="flex justify-between items-center"
          >
            <p>{{ item.productName }} x {{ item.quantity }}</p>
            <Button variant="ghost" size="sm" @click="removeItemFromInvoice(i)"
              ><X class="h-4 w-4"
            /></Button>
          </div>
        </div>
        <div class="border-t pt-2 space-y-1">
          <div class="flex justify-between">
            <span>Subtotal:</span><span>{{ formatCurrency(newInvoiceTotals.subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Tax:</span><span>{{ formatCurrency(newInvoiceTotals.tax) }}</span>
          </div>
          <div class="flex justify-between font-bold">
            <span>Total:</span><span>{{ formatCurrency(newInvoiceTotals.total) }}</span>
          </div>
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <Button variant="outline" @click="isCreateDialogOpen = false">Cancel</Button
        ><Button @click="handleCreateInvoice">Create</Button>
      </div>
    </Dialog>
    <Dialog :open="!!viewingInvoice" @update:open="!$event && (viewingInvoice = null)">
      <DialogHeader v-if="viewingInvoice"
        ><DialogTitle>Invoice {{ viewingInvoice.number }}</DialogTitle></DialogHeader
      >
      <div v-if="viewingInvoice" class="space-y-4 py-4">
        <p>Customer: {{ viewingInvoice.customerName }}</p>
        <p>Total: {{ formatCurrency(viewingInvoice.total) }}</p>
      </div>
      <div class="flex justify-end"><Button @click="viewingInvoice = null">Close</Button></div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Badge from '../ui/Badge.vue'
import Card from '../ui/Card.vue'
import CardContent from '../ui/CardContent.vue'
import CardHeader from '../ui/CardHeader.vue'
import CardTitle from '../ui/CardTitle.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import Dialog from '../ui/Dialog.vue'
import DialogHeader from '../ui/DialogHeader.vue'
import DialogTitle from '../ui/DialogTitle.vue'
import Label from '../ui/Label.vue'
import Select from '../ui/Select.vue'
import { Plus, Search, Eye, Trash2, X } from 'lucide-vue-next'

const props = defineProps({
  invoices: Array,
  customers: Array,
  products: Array,
  currency: String,
  taxRate: Number,
})
const emit = defineEmits(['createInvoice', 'updateInvoice', 'deleteInvoice'])

const searchTerm = ref('')
const statusFilter = ref('all')
const isCreateDialogOpen = ref(false)
const viewingInvoice = ref(null)

const newInvoiceDefaults = {
  customerId: '',
  items: [],
  status: 'draft',
  dueDate: new Date(Date.now() + 2592000000).toISOString().split('T')[0],
}
const newInvoice = reactive({ ...newInvoiceDefaults })
const currentItem = reactive({ productId: '', quantity: 1 })

const filteredInvoices = computed(() =>
  props.invoices.filter(
    (i) =>
      (i.number.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        i.customerName.toLowerCase().includes(searchTerm.value.toLowerCase())) &&
      (statusFilter.value === 'all' || i.status === statusFilter.value),
  ),
)

const unpaidInvoicesCount = computed(() => props.invoices.filter((i) => i.status !== 'paid').length)
const overdueInvoicesCount = computed(
  () => props.invoices.filter((i) => i.status === 'overdue').length,
)
const totalRevenue = computed(() =>
  props.invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
)

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency }).format(amount)

const newInvoiceTotals = computed(() => {
  const subtotal = newInvoice.items.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * props.taxRate
  return { subtotal, tax, total: subtotal + tax }
})

const addItemToInvoice = () => {
  const product = props.products.find((p) => p.id === currentItem.productId)
  if (!product) return
  newInvoice.items.push({
    ...product,
    productId: product.id,
    productName: product.name,
    quantity: currentItem.quantity,
    price: product.sellingPrice,
    total: product.sellingPrice * currentItem.quantity,
  })
  currentItem.productId = ''
  currentItem.quantity = 1
}
const removeItemFromInvoice = (index) => {
  newInvoice.items.splice(index, 1)
}

const handleCreateInvoice = () => {
  const customer = props.customers.find((c) => c.id === newInvoice.customerId)
  emit('createInvoice', { ...newInvoice, customerName: customer.name, ...newInvoiceTotals.value })
  Object.assign(newInvoice, newInvoiceDefaults, { items: [] })
  isCreateDialogOpen.value = false
}

const getStatusBadge = (status) => {
  if (status === 'paid')
    return { variant: 'outline', class: 'text-green-600 border-green-600', text: 'Paid' }
  if (status === 'sent')
    return { variant: 'outline', class: 'text-blue-600 border-blue-600', text: 'Sent' }
  if (status === 'overdue') return { variant: 'destructive', text: 'Overdue' }
  return { variant: 'outline', text: 'Draft' }
}
</script>
