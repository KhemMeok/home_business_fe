<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/50 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle>Get Started</CardTitle>
        <CardDescription> Create your business management account </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="Enter your business name"
              v-model="formData.businessName"
              @blur="validateField('businessName')"
              :class="{ 'border-destructive': errors.businessName }"
            />
            <p v-if="errors.businessName" class="text-xs text-destructive">
              {{ errors.businessName }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              v-model="formData.email"
              @blur="validateField('email')"
              :class="{ 'border-destructive': errors.email }"
            />
            <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              v-model="formData.password"
              @blur="validateField('password')"
              :class="{ 'border-destructive': errors.password }"
            />
            <p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
          </div>

          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              v-model="formData.confirmPassword"
              @blur="validateField('confirmPassword')"
              :class="{ 'border-destructive': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="text-xs text-destructive">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="currency">Currency</Label>
            <Select v-model="formData.currency">
              <option v-for="currency in currencies" :key="currency.value" :value="currency.value">
                {{ currency.label }}
              </option>
            </Select>
          </div>

          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            Already have an account?
            <Button variant="link" class="p-0 h-auto" @click="$emit('show-login')">
              Sign in
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Label from '../ui/Label.vue'
import Card from '../ui/Card.vue'
import CardContent from '../ui/CardContent.vue'
import CardDescription from '../ui/CardDescription.vue'
import CardHeader from '../ui/CardHeader.vue'
import CardTitle from '../ui/CardTitle.vue'
import Select from '../ui/Select.vue'

const emit = defineEmits(['register', 'show-login'])

const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  businessName: '',
  currency: 'USD',
})
const isLoading = ref(false)
const errors = reactive({})

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
]

const validateField = (field) => {
  if (field === 'businessName' && !formData.businessName)
    errors.businessName = 'Business name is required'
  else if (field === 'businessName') delete errors.businessName

  if (field === 'email' && !formData.email) errors.email = 'Email is required'
  else if (field === 'email') delete errors.email

  if (field === 'password' && formData.password.length < 6)
    errors.password = 'Password must be at least 6 characters'
  else if (field === 'password') delete errors.password

  if (field === 'confirmPassword' && formData.password !== formData.confirmPassword)
    errors.confirmPassword = 'Passwords do not match'
  else if (field === 'confirmPassword') delete errors.confirmPassword
}

const validateForm = () => {
  validateField('businessName')
  validateField('email')
  validateField('password')
  validateField('confirmPassword')
  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  setTimeout(() => {
    emit('register', { ...formData })
    isLoading.value = false
  }, 1000)
}
</script>
