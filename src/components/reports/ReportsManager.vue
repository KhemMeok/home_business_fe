<template>
  <div class="space-y-4 pb-20 sm:pb-6">
    <!-- Header -->
    <div>
      <p class="text-muted-foreground">Business insights and performance metrics</p>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-2">
            <Label>Report Type</Label>
            <Select v-model="reportType" class="h-12">
              <option value="sales">Sales Report</option>
              <option value="products">Product Performance</option>
              <option value="customers">Customer Analysis</option>
            </Select>
          </div>
          <div class="space-y-2">
            <Label>Date Range</Label>
            <Select v-model="dateRange" class="w-full sm:w-[140px] h-12">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Sales Report -->
    <div v-if="reportType === 'sales'" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle class="text-sm">Total Revenue</CardTitle></CardHeader><CardContent><div class="text-2xl font-bold">{{ formatCurrency(totalRevenue) }}</div></CardContent></Card>
        <Card><CardHeader><CardTitle class="text-sm">Total Orders</CardTitle></CardHeader><CardContent><div class="text-2xl font-bold">{{ totalOrders }}</div></CardContent></Card>
        <Card><CardHeader><CardTitle class="text-sm">Avg. Order Value</CardTitle></CardHeader><CardContent><div class="text-2xl font-bold">{{ formatCurrency(averageOrderValue) }}</div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Sales Trend</CardTitle></CardHeader><CardContent><div class="h-[250px] bg-muted/50 flex items-center justify-center rounded-md"><p>Chart would be here</p></div></CardContent></Card>
    </div>

    <!-- Product Report -->
    <div v-if="reportType === 'products'" class="space-y-6">
      <Card>
        <CardHeader><CardTitle>Top Performing Products</CardTitle></CardHeader>
        <Table>
          <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Qty Sold</TableHead><TableHead>Revenue</TableHead></TableRow></TableHeader>
          <TableBody><TableRow v-for="p in topProducts" :key="p.id"><TableCell>{{ p.name }}</TableCell><TableCell>{{ p.quantity }}</TableCell><TableCell>{{ formatCurrency(p.revenue) }}</TableCell></TableRow></TableBody>
        </Table>
      </Card>
    </div>

    <!-- Customer Report -->
    <div v-if="reportType === 'customers'" class="space-y-6">
      <Card>
        <CardHeader><CardTitle>Top Customers</CardTitle></CardHeader>
        <Table>
          <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Orders</TableHead><TableHead>Total Spent</TableHead></TableRow></TableHeader>
          <TableBody><TableRow v-for="c in topCustomers" :key="c.id"><TableCell>{{ c.name }}</TableCell><TableCell>{{ c.totalInvoices }}</TableCell><TableCell>{{ formatCurrency(c.totalSpent) }}</TableCell></TableRow></TableBody>
        </Table>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Card from '../ui/Card.vue';
import CardContent from '../ui/CardContent.vue';
import CardHeader from '../ui/CardHeader.vue';
import CardTitle from '../ui/CardTitle.vue';
import Select from '../ui/Select.vue';
import Label from '../ui/Label.vue';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const props = defineProps({ invoices: Array, products: Array, customers: Array, currency: String });

const dateRange = ref('30');
const reportType = ref('sales');

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency }).format(amount);

const filteredInvoices = computed(() => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parseInt(dateRange.value));
  return props.invoices.filter(i => new Date(i.date) >= cutoff && i.status === 'paid');
});

const totalRevenue = computed(() => filteredInvoices.value.reduce((s, i) => s + i.total, 0));
const totalOrders = computed(() => filteredInvoices.value.length);
const averageOrderValue = computed(() => totalOrders.value > 0 ? totalRevenue.value / totalOrders.value : 0);

const productSales = computed(() => {
  const sales = new Map();
  filteredInvoices.value.forEach(inv => {
    inv.items.forEach(item => {
      const existing = sales.get(item.productId) || { name: item.productName, quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += item.total;
      sales.set(item.productId, existing);
    });
  });
  return Array.from(sales.entries()).map(([id, data]) => ({ id, ...data }));
});

const topProducts = computed(() => productSales.value.sort((a, b) => b.revenue - a.revenue).slice(0, 10));

const topCustomers = computed(() => [...props.customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10));
</script>
