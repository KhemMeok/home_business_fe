<template>
  <div class="space-y-4 pb-20 sm:pb-6">
    <div class="space-y-2">
      <p class="text-muted-foreground">Welcome back! Here's your business overview.</p>
      <div class="flex flex-col sm:flex-row gap-2">
        <Button @click="onQuickAction('new-invoice')" class="flex-1 sm:flex-none">
          <Plus class="h-4 w-4 mr-2" /> New Sale/Invoice
        </Button>
        <Button variant="outline" @click="onQuickAction('add-product')" class="flex-1 sm:flex-none">
          <Plus class="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <Card>
        <CardHeader class="relative pb-2"
          ><CardTitle class="text-xs sm:text-sm">Today's Sales</CardTitle
          ><DollarSign class="h-4 w-4 text-muted-foreground absolute right-6 top-6"
        /></CardHeader>
        <CardContent
          ><div class="text-lg sm:text-2xl font-bold">
            {{ formatCurrency(businessData.todaySales) }}
          </div></CardContent
        >
      </Card>
      <Card>
        <CardHeader class="relative pb-2"
          ><CardTitle class="text-xs sm:text-sm">This Month</CardTitle
          ><TrendingUp class="h-4 w-4 text-muted-foreground absolute right-6 top-6"
        /></CardHeader>
        <CardContent
          ><div class="text-lg sm:text-2xl font-bold">
            {{ formatCurrency(businessData.monthSales) }}
          </div></CardContent
        >
      </Card>
      <Card>
        <CardHeader class="relative pb-2"
          ><CardTitle class="text-xs sm:text-sm">Unpaid Invoices</CardTitle
          ><FileText class="h-4 w-4 text-muted-foreground absolute right-6 top-6"
        /></CardHeader>
        <CardContent
          ><div class="text-lg sm:text-2xl font-bold">{{ businessData.unpaidInvoices.count }}</div>
          <p class="text-xs text-muted-foreground">
            {{ formatCurrency(businessData.unpaidInvoices.total) }} outstanding
          </p></CardContent
        >
      </Card>
      <Card>
        <CardHeader class="relative pb-2"
          ><CardTitle class="text-xs sm:text-sm">Low Stock Alert</CardTitle
          ><AlertTriangle class="h-4 w-4 text-orange-500 absolute right-6 top-6"
        /></CardHeader>
        <CardContent
          ><div class="text-lg sm:text-2xl font-bold text-orange-500">
            {{ businessData.lowStockItems }}
          </div>
          <p class="text-xs text-muted-foreground">items need restocking</p></CardContent
        >
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent class="space-y-3">
          <Button
            variant="outline"
            class="w-full justify-start h-12"
            @click="onQuickAction('add-product')"
            ><Plus class="h-4 w-4 mr-2" /> Add Product</Button
          >
          <Button
            variant="outline"
            class="w-full justify-start h-12"
            @click="onQuickAction('add-customer')"
            ><Plus class="h-4 w-4 mr-2" /> Add Customer</Button
          >
          <Button
            variant="outline"
            class="w-full justify-start h-12"
            @click="onQuickAction('view-reports')"
            ><Eye class="h-4 w-4 mr-2" /> View Reports</Button
          >
        </CardContent>
      </Card>
      <Card class="lg:col-span-2">
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="activity in businessData.recentActivity"
              :key="activity.id"
              class="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div class="flex items-center space-x-3 min-w-0 flex-1">
                <component :is="getActivityIcon(activity.type)" />
                <div class="min-w-0 flex-1">
                  <p class="text-sm leading-tight">{{ activity.description }}</p>
                  <p class="text-xs text-muted-foreground">{{ activity.time }}</p>
                </div>
              </div>
              <Badge v-if="activity.amount" variant="outline" class="ml-2 flex-shrink-0">{{
                formatCurrency(activity.amount)
              }}</Badge>
            </div>
            <p
              v-if="!businessData.recentActivity || businessData.recentActivity.length === 0"
              class="text-muted-foreground text-center py-6"
            >
              No recent activity
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import Card from '../ui/Card.vue'
import CardContent from '../ui/CardContent.vue'
import CardHeader from '../ui/CardHeader.vue'
import CardTitle from '../ui/CardTitle.vue'
import Button from '../ui/Button.vue'
import Badge from '../ui/Badge.vue'
import { DollarSign, FileText, AlertTriangle, TrendingUp, Plus, Eye } from 'lucide-vue-next'

const businessData = inject('dashboardData')
const currency = inject('currency')
const onQuickAction = inject('onQuickAction')

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value }).format(
    amount || 0,
  )

const iconMap = { sale: DollarSign, invoice: FileText, stock: TrendingUp }
const getActivityIcon = (type) => iconMap[type] || TrendingUp
</script>
