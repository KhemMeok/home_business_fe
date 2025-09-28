<template>
  <Card class="cursor-pointer hover:shadow-md transition-shadow">
    <CardContent class="p-4">
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium truncate">{{ customer.name }}</h3>
          <p v-if="customer.company" class="text-sm text-muted-foreground truncate">
            {{ customer.company }}
          </p>
          <div class="mt-1">
            <Badge variant="outline">{{ getCustomerStatus() }}</Badge>
          </div>
        </div>
        <div class="flex gap-1 ml-2">
          <Button variant="ghost" size="sm" @click.stop="$emit('view', customer)"
            ><Eye class="h-4 w-4"
          /></Button>
          <Button variant="ghost" size="sm" @click.stop="$emit('edit', customer)"
            ><Edit class="h-4 w-4"
          /></Button>
        </div>
      </div>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <Mail class="h-3 w-3" /><span class="text-sm truncate">{{ customer.email }}</span>
        </div>
        <div v-if="customer.phone" class="flex items-center gap-2">
          <Phone class="h-3 w-3" /><span class="text-sm">{{ customer.phone }}</span>
        </div>
        <div class="flex justify-between items-center pt-2 border-t">
          <div class="text-center">
            <p class="text-xs text-muted-foreground">Orders</p>
            <p class="text-sm font-medium">{{ customer.totalInvoices }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-muted-foreground">Spent</p>
            <p class="text-sm font-medium">{{ formatCurrency(customer.totalSpent) }}</p>
          </div>
          <div v-if="customer.lastOrderDate" class="text-center">
            <p class="text-xs text-muted-foreground">Last Order</p>
            <p class="text-xs">{{ new Date(customer.lastOrderDate).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import Button from '../ui/Button.vue'
import Badge from '../ui/Badge.vue'
import Card from '../ui/Card.vue'
import CardContent from '../ui/CardContent.vue'
import { Edit, Eye, Mail, Phone } from 'lucide-vue-next'

const props = defineProps({ customer: Object, currency: String })
defineEmits(['edit', 'view'])

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency }).format(amount)

const getCustomerStatus = () => {
  if (props.customer.lastOrderDate) {
    const days = (new Date() - new Date(props.customer.lastOrderDate)) / (1000 * 3600 * 24)
    if (days <= 30) return 'Active'
    if (days <= 90) return 'Inactive'
  }
  return 'New'
}
</script>
