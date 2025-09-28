<template>
  <div class="space-y-4 pb-20 sm:pb-6">
    <div>
      <p class="text-muted-foreground">Configure your business settings</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div class="space-y-4">
        <h3>Business Information</h3>
        <Card>
          <CardContent class="pt-6 space-y-3">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Business Name:</span>
              <span class="font-medium">{{ user.businessName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Email:</span>
              <span class="font-medium">{{ user.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Currency:</span>
              <span class="font-medium">{{ user.currency }}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-4">
        <h3>System Status</h3>
        <Card>
          <CardContent class="pt-6 space-y-3">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Products:</span>
              <span class="font-medium">{{ products.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Customers:</span>
              <span class="font-medium">{{ customers.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Invoices:</span>
              <span class="font-medium">{{ invoices.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Low Stock Items:</span>
              <span class="font-medium text-orange-500">{{ lowStockCount }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import Card from '../ui/Card.vue'
import CardContent from '../ui/CardContent.vue'

const user = inject('user')
const products = inject('products')
const customers = inject('customers')
const invoices = inject('invoices')

const lowStockCount = computed(
  () => products.value.filter((p) => p.stock <= p.lowStockAlert).length,
)
</script>
