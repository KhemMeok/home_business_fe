<template>
  <Card class="cursor-pointer hover:shadow-md transition-shadow">
    <CardContent class="p-4">
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium truncate">{{ product.name }}</h3>
          <p class="text-sm text-muted-foreground">{{ product.sku }}</p>
          <Badge variant="outline" class="mt-1 text-xs">{{ product.category }}</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          @click.stop="$emit('edit', product)"
          class="flex-shrink-0 ml-2"
        >
          <Edit class="h-4 w-4" />
        </Button>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm text-muted-foreground">Price:</span>
          <span class="font-medium">{{ formatCurrency(product.sellingPrice) }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-muted-foreground">Stock:</span>
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ product.stock }}</span>
            <component
              :is="stockStatus.component"
              :variant="stockStatus.variant"
              :class="stockStatus.class"
            >
              <AlertTriangle
                v-if="product.stock <= product.lowStockAlert && product.stock > 0"
                class="h-3 w-3 mr-1"
              />
              {{ stockStatus.text }}
            </component>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-muted-foreground">Cost:</span>
          <span class="text-sm">{{ formatCurrency(product.costPrice) }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Button from '../ui/Button.vue'
import Badge from '../ui/Badge.vue'
import Card from '../ui/Card.vue'
import CardContent from '../ui/CardContent.vue'
import { Edit, AlertTriangle } from 'lucide-vue-next'

const props = defineProps({ product: Object, currency: String })
defineEmits(['edit'])

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency }).format(amount)

const stockStatus = computed(() => {
  if (props.product.stock === 0)
    return { component: Badge, variant: 'destructive', text: 'Out of Stock' }
  if (props.product.stock <= props.product.lowStockAlert)
    return {
      component: Badge,
      variant: 'outline',
      class: 'text-orange-500 border-orange-500',
      text: 'Low Stock',
    }
  return {
    component: Badge,
    variant: 'outline',
    class: 'text-green-600 border-green-600',
    text: 'In Stock',
  }
})
</script>
