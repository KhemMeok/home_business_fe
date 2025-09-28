<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/50 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription> Sign in to your business management account </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              v-model="email"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                v-model="password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            Don't have an account?
            <Button variant="link" class="p-0 h-auto" @click="$emit('show-register')">
              Sign up
            </Button>
          </p>
        </div>

        <div class="mt-4 p-3 bg-muted rounded-lg">
          <p class="text-xs text-muted-foreground">
            Demo credentials: any email and password will work
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Label from '../ui/Label.vue'
import Card from '../ui/Card.vue'
import CardContent from '../ui/CardContent.vue'
import CardDescription from '../ui/CardDescription.vue'
import CardHeader from '../ui/CardHeader.vue'
import CardTitle from '../ui/CardTitle.vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const emit = defineEmits(['login', 'show-register'])

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  setTimeout(() => {
    emit('login', email.value, password.value)
    isLoading.value = false
  }, 1000)
}
</script>
