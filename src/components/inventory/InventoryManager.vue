<template>
  <div class="space-y-4 pb-20 sm:pb-6">
    <!-- Header and Add Product Dialog -->
    <div class="space-y-3">
      <p class="text-muted-foreground">Manage your products and stock levels</p>
      <Button @click="isAddDialogOpen = true" class="w-full sm:w-auto">
        <Plus class="h-4 w-4 mr-2" /> Add Product
      </Button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
      <Card>
        <CardHeader><CardTitle class="text-sm">Total Products</CardTitle></CardHeader>
        <CardContent><div class="text-2xl font-bold">{{ products.length }}</div></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle class="text-sm">Low Stock Items</CardTitle></CardHeader>
        <CardContent><div class="text-2xl font-bold text-orange-500">{{ lowStockCount }}</div></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle class="text-sm">Inventory Value</CardTitle></CardHeader>
        <CardContent><div class="text-2xl font-bold">{{ formatCurrency(totalInventoryValue) }}</div></CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <Card><CardContent class="pt-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search products..." v-model="searchTerm" class="pl-9 h-12" />
        </div>
        <div class="flex gap-2">
            <Select v-model="selectedCategory" class="flex-1 sm:w-[180px] h-12">
                <option value="all">All Categories</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </Select>
            <Button :variant="showLowStockOnly ? 'default' : 'outline'" @click="showLowStockOnly = !showLowStockOnly" class="h-12 px-4">
                <Filter class="h-4 w-4 sm:mr-2" /><span class="hidden sm:inline">Low Stock</span>
            </Button>
        </div>
      </div>
    </CardContent></Card>

    <!-- Products List -->
    <div class="sm:hidden space-y-3">
        <MobileProductCard v-for="p in filteredProducts" :key="p.id" :product="p" :currency="currency" @edit="handleEditProduct" />
    </div>
    <Card class="hidden sm:block">
      <Table>
        <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>SKU</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          <TableRow v-for="p in filteredProducts" :key="p.id">
            <TableCell class="font-medium">{{ p.name }}</TableCell>
            <TableCell>{{ p.sku }}</TableCell>
            <TableCell>{{ p.category }}</TableCell>
            <TableCell>{{ formatCurrency(p.sellingPrice) }}</TableCell>
            <TableCell>{{ p.stock }}</TableCell>
            <TableCell><component :is="getStockStatus(p).component" :variant="getStockStatus(p).variant" :class="getStockStatus(p).class">{{ getStockStatus(p).text }}</component></TableCell>
            <TableCell><Button variant="ghost" size="sm" @click="handleEditProduct(p)"><Edit class="h-4 w-4" /></Button></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <!-- Add/Edit Dialogs -->
    <Dialog :open="isAddDialogOpen" @update:open="isAddDialogOpen = $event">
        <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-2 gap-4"><div class="space-y-2"><Label>Name</Label><Input v-model="newProduct.name" /></div><div class="space-y-2"><Label>SKU</Label><Input v-model="newProduct.sku" /></div></div>
            <div class="space-y-2"><Label>Category</Label><Input v-model="newProduct.category" /></div>
            <div class="grid grid-cols-2 gap-4"><div class="space-y-2"><Label>Cost Price</Label><Input v-model.number="newProduct.costPrice" type="number" /></div><div class="space-y-2"><Label>Selling Price</Label><Input v-model.number="newProduct.sellingPrice" type="number" /></div></div>
            <div class="grid grid-cols-2 gap-4"><div class="space-y-2"><Label>Stock</Label><Input v-model.number="newProduct.stock" type="number" /></div><div class="space-y-2"><Label>Low Stock Alert</Label><Input v-model.number="newProduct.lowStockAlert" type="number" /></div></div>
        </div>
        <div class="flex justify-end space-x-2"><Button variant="outline" @click="isAddDialogOpen = false">Cancel</Button><Button @click="handleAddProduct">Add</Button></div>
    </Dialog>
    <Dialog :open="!!editingProduct" @update:open="!$event && (editingProduct = null)">
        <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
        <div v-if="editingProduct" class="grid gap-4 py-4">
            <div class="grid grid-cols-2 gap-4"><div class="space-y-2"><Label>Name</Label><Input v-model="editingProduct.name" /></div><div class="space-y-2"><Label>Stock</Label><Input v-model.number="editingProduct.stock" type="number" /></div></div>
            <div class="grid grid-cols-2 gap-4"><div class="space-y-2"><Label>Cost Price</Label><Input v-model.number="editingProduct.costPrice" type="number" /></div><div class="space-y-2"><Label>Selling Price</Label><Input v-model.number="editingProduct.sellingPrice" type="number" /></div></div>
            <div class="space-y-2"><Label>Low Stock Alert</Label><Input v-model.number="editingProduct.lowStockAlert" type="number" /></div>
        </div>
        <div class="flex justify-end space-x-2"><Button variant="outline" @click="editingProduct = null">Cancel</Button><Button @click="handleUpdateProduct">Update</Button></div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Button from '../ui/Button.vue';
import Input from '../ui/Input.vue';
import Badge from '../ui/Badge.vue';
import Card from '../ui/Card.vue';
import CardContent from '../ui/CardContent.vue';
import CardHeader from '../ui/CardHeader.vue';
import CardTitle from '../ui/CardTitle.vue';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Dialog from '../ui/Dialog.vue';
import DialogHeader from '../ui/DialogHeader.vue';
import DialogTitle from '../ui/DialogTitle.vue';
import Label from '../ui/Label.vue';
import Select from '../ui/Select.vue';
import MobileProductCard from './MobileProductCard.vue';
import { Plus, Search, Edit, Filter } from 'lucide-vue-next';

const props = defineProps({ products: Array, currency: String });
const emit = defineEmits(['addProduct', 'updateProduct']);

const searchTerm = ref('');
const selectedCategory = ref('all');
const showLowStockOnly = ref(false);
const isAddDialogOpen = ref(false);
const editingProduct = ref(null);

const newProductDefaults = { name: '', sku: '', category: '', costPrice: 0, sellingPrice: 0, stock: 0, lowStockAlert: 5 };
const newProduct = reactive({ ...newProductDefaults });

const categories = computed(() => Array.from(new Set(props.products.map(p => p.category))).filter(Boolean));
const lowStockCount = computed(() => props.products.filter(p => p.stock <= p.lowStockAlert).length);
const totalInventoryValue = computed(() => props.products.reduce((sum, p) => sum + (p.sellingPrice * p.stock), 0));

const filteredProducts = computed(() => props.products.filter(p =>
    (p.name.toLowerCase().includes(searchTerm.value.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.value.toLowerCase())) &&
    (selectedCategory.value === 'all' || p.category === selectedCategory.value) &&
    (!showLowStockOnly.value || p.stock <= p.lowStockAlert)
));

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency }).format(amount);

const handleAddProduct = () => {
  if (!newProduct.name || !newProduct.sku) return;
  emit('addProduct', { ...newProduct });
  Object.assign(newProduct, newProductDefaults);
  isAddDialogOpen.value = false;
};

const handleEditProduct = (product) => { editingProduct.value = { ...product }; };

const handleUpdateProduct = () => {
  if (!editingProduct.value) return;
  emit('updateProduct', editingProduct.value.id, editingProduct.value);
  editingProduct.value = null;
};

const getStockStatus = (product) => {
    if (product.stock === 0) return { component: Badge, variant: 'destructive', text: 'Out of Stock' };
    if (product.stock <= product.lowStockAlert) return { component: Badge, variant: 'outline', class: 'text-orange-500 border-orange-500', text: 'Low Stock' };
    return { component: Badge, variant: 'outline', class: 'text-green-600 border-green-600', text: 'In Stock' };
};
</script>
