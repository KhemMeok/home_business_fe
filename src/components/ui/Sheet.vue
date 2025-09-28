<template>
  <div>
    <div @click="isOpen = true">
      <slot name="trigger" />
    </div>
    <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/50" @click="isOpen = false" />
    <div
      v-if="isOpen"
      :class="
        cn(
          'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out duration-500 h-full',
          sideClasses[side],
        )
      "
    >
      <button
        @click="isOpen = false"
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { cn } from './utils'
import { X } from 'lucide-vue-next'

const props = defineProps({
  side: { type: String, default: 'left' },
})

const isOpen = ref(false)

const sideClasses = {
  left: 'inset-y-0 left-0 border-r',
  right: 'inset-y-0 right-0 border-l',
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
}

const setOpen = (value) => {
  isOpen.value = value
}

defineExpose({ setOpen })
</script>
