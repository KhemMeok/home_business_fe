<template>
  <div>
    <!-- Top Header -->
    <header class="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <Sheet ref="sheetRef" side="left">
            <template #trigger>
              <Button variant="ghost" size="sm" class="p-2">
                <Menu class="h-5 w-5" />
              </Button>
            </template>
            <div class="w-[280px]">
              <SheetHeader>
                <SheetTitle class="text-left">{{ businessName }}</SheetTitle>
              </SheetHeader>

              <div class="mt-6 space-y-1">
                <router-link
                  v-for="item in menuItems"
                  :key="item.id"
                  :to="item.path"
                  v-slot="{ navigate }"
                >
                  <Button
                    :variant="route.name === item.id ? 'default' : 'ghost'"
                    class="w-full justify-start h-12"
                    @click="handleLinkClick(navigate)"
                  >
                    <component :is="item.icon" class="h-5 w-5 mr-3" />
                    <span class="flex-1 text-left">{{ item.label }}</span>
                    <Badge v-if="item.badge" variant="secondary" class="ml-2">{{
                      item.badge
                    }}</Badge>
                  </Button>
                </router-link>
              </div>

              <div class="mt-8 space-y-2">
                <p class="text-sm font-medium text-muted-foreground px-3">Quick Actions</p>
                <Button
                  variant="outline"
                  class="w-full justify-start h-12"
                  @click="handleQuickAction('/invoices')"
                  ><Plus class="h-4 w-4 mr-3" /> New Invoice</Button
                >
                <Button
                  variant="outline"
                  class="w-full justify-start h-12"
                  @click="handleQuickAction('/inventory')"
                  ><Plus class="h-4 w-4 mr-3" /> Add Product</Button
                >
              </div>

              <div class="absolute bottom-6 left-6 right-6">
                <Button
                  variant="ghost"
                  class="w-full justify-start h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                  @click="$emit('logout')"
                >
                  <LogOut class="h-5 w-5 mr-3" /> Logout
                </Button>
              </div>
            </div>
          </Sheet>

          <div>
            <h1 class="text-lg font-medium">{{ activeItem?.label || 'Dashboard' }}</h1>
            <p class="text-xs text-muted-foreground">{{ businessName }}</p>
          </div>
        </div>

        <Button
          v-if="route.name === 'dashboard'"
          size="sm"
          @click="router.push('/invoices')"
          class="h-9"
        >
          <Plus class="h-4 w-4 mr-1" /> New
        </Button>
      </div>
    </header>

    <!-- Bottom Navigation -->
    <nav
      class="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-2 z-50 sm:hidden"
    >
      <div class="flex items-center justify-around">
        <router-link
          v-for="item in menuItems.slice(0, 4)"
          :key="item.id"
          :to="item.path"
          v-slot="{ navigate, isActive }"
        >
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'flex flex-col items-center space-y-1 h-auto py-2 px-3 relative',
              isActive ? 'text-primary' : 'text-muted-foreground',
            ]"
            @click="navigate"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span class="text-xs">{{ item.label }}</span>
            <Badge
              v-if="item.badge"
              variant="destructive"
              class="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >{{ item.badge }}</Badge
            >
          </Button>
        </router-link>
        <Button
          variant="ghost"
          size="sm"
          class="flex flex-col items-center space-y-1 h-auto py-2 px-3 text-muted-foreground"
          @click="sheetRef.setOpen(true)"
        >
          <Menu class="h-5 w-5" />
          <span class="text-xs">More</span>
        </Button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '../ui/Button.vue'
import Sheet from '../ui/Sheet.vue'
import SheetHeader from '../ui/SheetHeader.vue'
import SheetTitle from '../ui/SheetTitle.vue'
import Badge from '../ui/Badge.vue'
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Plus,
} from 'lucide-vue-next'

const props = defineProps({
  businessName: String,
  lowStockCount: Number,
  unpaidInvoicesCount: Number,
})
defineEmits(['logout'])

const route = useRoute()
const router = useRouter()
const sheetRef = ref(null)

const menuItems = computed(() => [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  {
    id: 'inventory',
    path: '/inventory',
    label: 'Inventory',
    icon: Package,
    badge: props.lowStockCount > 0 ? props.lowStockCount : null,
  },
  { id: 'customers', path: '/customers', label: 'Customers', icon: Users, badge: null },
  {
    id: 'invoices',
    path: '/invoices',
    label: 'Invoices',
    icon: FileText,
    badge: props.unpaidInvoicesCount > 0 ? props.unpaidInvoicesCount : null,
  },
  { id: 'reports', path: '/reports', label: 'Reports', icon: BarChart3, badge: null },
  { id: 'settings', path: '/settings', label: 'Settings', icon: Settings, badge: null },
])

const activeItem = computed(() => menuItems.value.find((item) => item.id === route.name))

const handleLinkClick = (navigate) => {
  navigate()
  if (sheetRef.value) sheetRef.value.setOpen(false)
}

const handleQuickAction = (path) => {
  router.push(path)
  if (sheetRef.value) sheetRef.value.setOpen(false)
}
</script>
