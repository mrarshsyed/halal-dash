<template>
  <div>
    <h1 class="text-xl font-bold">Create New Promo Code</h1>

    <form @submit="handleSubmit" class="mt-4" validate-on="submit lazy">
      <!-- Promo Code -->
      <div class="mt-4">
        <label for="promoCode" class="block mb-1 font-medium">Promo Code</label>
        <input id="promoCode" name="promoCode" v-model="form.promoCode" required type="text" placeholder="e.g. SAVE20"
          class="form-input border uppercase" />
      </div>

      <!-- Description -->
      <div class="mt-4">
        <label for="description" class="block mb-1 font-medium">Description</label>
        <textarea id="description" name="description" v-model="form.description" placeholder="Optional description"
          class="form-input border" />
      </div>

      <!-- Discount Type -->
      <div class="mt-4">
        <label for="discountType" class="block mb-1 font-medium">Discount Type</label>
        <select id="discountType" name="discountType" v-model="form.discountType" required class="form-input border">
          <option disabled value="">Select Type</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>

      <!-- Discount Value -->
      <div class="mt-4">
        <label for="discountValue" class="block mb-1 font-medium">Discount Value</label>
        <input id="discountValue" name="discountValue" v-model="form.discountValue" required type="number" min="0"
          placeholder="e.g. 20 or 100" class="form-input border" />
      </div>

      <!-- Minimum Order Value -->
      <div class="mt-4">
        <label for="minOrderAmount" class="block mb-1 font-medium">Minimum Order Value</label>
        <input id="minOrderAmount" name="minOrderAmount" v-model="form.minOrderAmount" type="number" min="0"
          placeholder="Optional: e.g. 500" class="form-input border" />
      </div>

      <!-- Usage Limit -->
      <div class="mt-4">
        <label for="usageLimit" class="block mb-1 font-medium">Usage Limit</label>
        <input id="usageLimit" name="usageLimit" v-model="form.usageLimit" type="number" min="1"
          placeholder="Optional: e.g. 100 uses" class="form-input border" />
      </div>

      <!-- Per User Limit -->
      <div class="mt-4">
        <label for="perUserLimit" class="block mb-1 font-medium">Per User Limit</label>
        <input id="perUserLimit" name="usageLimitPerUser" v-model="form.usageLimitPerUser" type="number" min="1"
          placeholder="Optional: e.g. 2 uses per user" class="form-input border" />
      </div>

      <!-- Start Date -->
      <div class="mt-4">
        <label for="startDate" class="block mb-1 font-medium">Start Date</label>
        <input id="startDate" name="startDate" v-model="form.startDate" type="date" class="form-input border" />
      </div>

      <!-- End Date -->
      <div class="mt-4">
        <label for="endDate" class="block mb-1 font-medium">Expiry Date</label>
        <input id="endDate" name="expireDate" v-model="form.expireDate" type="date" class="form-input border" />
      </div>

      <!-- Applicable To -->
      <div class="mt-4">
        <label for="applicableTo" class="block mb-1 font-medium">Applicable To</label>
        <select id="applicableTo" name="applicableModule" v-model="form.applicableModule" class="form-input border"
          multiple>
          <option value="hotels">Hotels</option>
          <option value="activities">Activities</option>
          <option value="transfers">Transfers</option>
        </select>
      </div>

      <!-- Applicable Users -->
      <div class="mt-4">
        <label for="applicableUsers" class="block mb-1 font-medium">Applicable Users</label>
        <textarea id="applicableUsers" name="applicableUsers" v-model="form.applicableUsers"
          placeholder="Optional: Enter user emails, comma-separated" class="form-input border" />
      </div>

      <!-- active & Draft -->
      <div class="mt-4 flex items-center gap-6">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.active" name="active" class="size-4 rounded" />
          <span class="font-medium">Active</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.isDraft" name="isDraft" class="size-4 rounded" />
          <span class="font-medium">Draft</span>
        </label>
      </div>

      <!-- Submit Button -->
      <div class="mt-4">
        <button type="submit" :disabled="loading || !form.promoCode || !form.discountValue || !form.discountType"
          class="bg-primary text-white px-6 py-2 rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="!loading">Create Promo Code</span>
          <span v-else>Creating...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const route = useRoute()

const form = reactive({
  promoCode: '',
  description: '',
  discountType: '',
  discountValue: '',
  minOrderAmount: '',
  usageLimit: '',
  usageLimitPerUser: '',
  startDate: '',
  expireDate: '',
  applicableModule: [],
  applicableUsers: '',
  active: true,
  isDraft: false,
})

onMounted(async () => {
  try {
    const { data } = await axios.get(`admin/settings/price-coupons/${route.params.id}`)

    if (data) {
      form.promoCode = data.promoCode
      form.description = data.description
      form.discountType = data.discountType
      form.discountValue = data.discountValue
      form.minOrderAmount = data.minOrderAmount
      form.usageLimit = data.usageLimit
      form.usageLimitPerUser = data.usageLimitPerUser
      form.startDate = new Date(data.startDate).toISOString().slice(0, 10)
      form.expireDate = new Date(data.expireDate).toISOString().slice(0, 10)
      form.applicableModule = data.applicableModule
      form.applicableUsers = data.applicableUsers
      form.active = data.active
      form.isDraft = data.isDraft
    }
  } catch (error) {
    console.error(error)
  }
})

const handleSubmit = async (e) => {
  e.preventDefault()
  loading.value = true

  try {
    const payload = {
      ...form,
      applicableUsers: form.applicableUsers.split(',').filter(Boolean),
    }
    fakeApiSubmit(payload)

    // If editing an existing promo (e.g. route has an ID), use PUT
    await axios.put(`admin/settings/price-coupons/${route.params.id}`, payload)
    alert('Promo code updated successfully!')
    router.push('/promo/list')
  } catch (err) {
    console.error(err)
    alert('Failed to submit promo code.')
  } finally {
    loading.value = false
  }
}

// Simulated API
const fakeApiSubmit = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(console.log(data)), 1000))
</script>
