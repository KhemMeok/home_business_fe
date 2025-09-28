<template>
  <div class="space-y-4 pb-20 sm:pb-6">
    <!-- Header -->
    <div class="space-y-3">
      <p class="text-muted-foreground">Manage your customer relationships</p>
      <Button @click="isAddDialogOpen = true" class="w-full sm:w-auto">
        <Plus class="h-4 w-4 mr-2" /> Add Customer
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
      <Card
        ><CardHeader><CardTitle class="text-sm">Total Customers</CardTitle></CardHeader
        ><CardContent
          ><div class="text-2xl font-bold">{{ customers.length }}</div></CardContent
        ></Card
      >
      <Card
        ><CardHeader><CardTitle class="text-sm">Active Customers</CardTitle></CardHeader
        ><CardContent
          ><div class="text-2xl font-bold text-green-600">
            {{ activeCustomersCount }}
          </div></CardContent
        ></Card
      >
      <Card
        ><CardHeader><CardTitle class="text-sm">Total Revenue</CardTitle></CardHeader
        ><CardContent
          ><div class="text-2xl font-bold">{{ formatCurrency(totalRevenue) }}</div></CardContent
        ></Card
      >
    </div>

    <!-- Search -->
    <Card
      ><CardContent class="pt-6"
        ><div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" /><Input
            v-model="searchTerm"
            placeholder="Search customers..."
            class="pl-9 h-12"
          /></div></CardContent
    ></Card>

    <!-- List -->
    <div class="sm:hidden space-y-3">
      <MobileCustomerCard
        v-for="c in filteredCustomers"
        :key="c.id"
        :customer="c"
        :currency="currency"
        @edit="handleEditCustomer"
        @view="$emit('view-customer', c)"
      />
    </div>
    <Card class="hidden sm:block">
      <Table>
        <TableHeader
          ><TableRow
            ><TableHead>Customer</TableHead><TableHead>Contact</TableHead
            ><TableHead>Total Spent</TableHead><TableHead>Status</TableHead
            ><TableHead>Actions</TableHead></TableRow
          ></TableHeader
        >
        <TableBody>
          <TableRow v-for="c in filteredCustomers" :key="c.id">
            <TableCell class="font-medium">{{ c.name }}</TableCell>
            <TableCell>{{ c.email }}</TableCell>
            <TableCell>{{ formatCurrency(c.totalSpent) }}</TableCell>
            <TableCell
              ><Badge variant="outline">{{ getCustomerStatus(c) }}</Badge></TableCell
            >
            <TableCell
              ><div class="flex space-x-2">
                <Button variant="ghost" size="sm" @click="$emit('view-customer', c)"
                  ><Eye class="h-4 w-4" /></Button
                ><Button variant="ghost" size="sm" @click="handleEditCustomer(c)"
                  ><Edit class="h-4 w-4"
                /></Button></div
            ></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <!-- Dialogs -->
    <Dialog :open="isAddDialogOpen" @update:open="isAddDialogOpen = $event">
      <DialogHeader><DialogTitle>Add Customer</DialogTitle></DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="space-y-2"><Label>Name</Label><Input v-model="newCustomer.name" /></div>
        <div class="space-y-2"><Label>Email</Label><Input v-model="newCustomer.email" /></div>
        <div class="space-y-2"><Label>Phone</Label><Input v-model="newCustomer.phone" /></div>
        <div class="space-y-2"><Label>Company</Label><Input v-model="newCustomer.company" /></div>
      </div>
      <div class="flex justify-end space-x-2">
        <Button variant="outline" @click="isAddDialogOpen = false">Cancel</Button
        ><Button @click="handleAddCustomer">Add</Button>
      </div>
    </Dialog>
    <Dialog :open="!!editingCustomer" @update:open="!$event && (editingCustomer = null)">
      <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
      <div v-if="editingCustomer" class="grid gap-4 py-4">
        <div class="space-y-2"><Label>Name</Label><Input v-model="editingCustomer.name" /></div>
        <div class="space-y-2"><Label>Email</Label><Input v-model="editingCustomer.email" /></div>
        <div class="space-y-2"><Label>Phone</Label><Input v-model="editingCustomer.phone" /></div>
        <div class="space-y-2">
          <Label>Company</Label><Input v-model="editingCustomer.company" />
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <Button variant="outline" @click="editingCustomer = null">Cancel</Button
        ><Button @click="handleUpdateCustomer">Update</Button>
      </div>
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
import MobileCustomerCard from './MobileCustomerCard.vue'
import { Plus, Search, Edit, Eye } from 'lucide-vue-next'

const props = defineProps({ customers: Array, currency: String })
const emit = defineEmits(['addCustomer', 'updateCustomer', 'viewCustomer'])

const searchTerm = ref('')
const isAddDialogOpen = ref(false)
const editingCustomer = ref(null)

const newCustomerDefaults = { name: '', email: '', phone: '', company: '' }
const newCustomer = reactive({ ...newCustomerDefaults })

const filteredCustomers = computed(() =>
  props.customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.value.toLowerCase()),
  ),
)

const activeCustomersCount = computed(
  () =>
    props.customers.filter(
      (c) => c.lastOrderDate && (new Date() - new Date(c.lastOrderDate)) / (1000 * 3600 * 24) <= 30,
    ).length,
)
const totalRevenue = computed(() => props.customers.reduce((sum, c) => sum + c.totalSpent, 0))

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency }).format(amount)

const handleAddCustomer = () => {
  emit('addCustomer', { ...newCustomer })
  Object.assign(newCustomer, newCustomerDefaults)
  isAddDialogOpen.value = false
}

const handleEditCustomer = (customer) => {
  editingCustomer.value = { ...customer }
}

const handleUpdateCustomer = () => {
  emit('updateCustomer', editingCustomer.value.id, editingCustomer.value)
  editingCustomer.value = null
}

const getCustomerStatus = (c) => {
  if (c.lastOrderDate) {
    const days = (new Date() - new Date(c.lastOrderDate)) / (1000 * 3600 * 24)
    if (days <= 30) return 'Active'
    if (days <= 90) return 'Inactive'
  }
  return 'New'
}
</script>
