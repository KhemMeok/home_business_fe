import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/dashboard/Dashboard.vue';
import InventoryManager from '@/components/inventory/InventoryManager.vue';
import CustomerManager from '@/components/customers/CustomerManager.vue';
import InvoiceManager from '@/components/invoices/InvoiceManager.vue';
import ReportsManager from '@/components/reports/ReportsManager.vue';
import Settings from '@/components/settings/Settings.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     { path: '/', name: 'dashboard', component: Dashboard },
  { path: '/inventory', name: 'inventory', component: InventoryManager },
  { path: '/customers', name: 'customers', component: CustomerManager },
  { path: '/invoices', name: 'invoices', component: InvoiceManager },
  { path: '/reports', name: 'reports', component: ReportsManager },
  { path: '/settings', name: 'settings', component: Settings },
  ],
})

export default router
