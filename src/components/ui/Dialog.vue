<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/50" @click="$emit('update:open', false)">
    <div
      class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
      @click.stop
    >
      <button
        @click="$emit('update:open', false)"
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
import { X } from 'lucide-vue-next'

defineProps({
  open: Boolean,
})

defineEmits(['update:open'])
</script>
