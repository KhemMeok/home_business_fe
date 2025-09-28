<template>
  <span :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </span>
</template>

<script setup>
import { cva } from 'class-variance-authority'
import { cn } from './utils.js'

const props = defineProps({
  variant: { type: String, default: 'default' },
  class: { type: String, default: '' },
})

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-white',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
</script>
