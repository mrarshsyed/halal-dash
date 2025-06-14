<template>
  <div>
    <h1 class="text-xl font-bold">Create New Promo Code</h1>

    <form @submit="handleSubmit" class="mt-4" validate-on="submit lazy">
      <!-- Promo Code -->
      <div class="mt-4">
        <label for="promoCode" class="block mb-1 font-medium">Promo Code</label>
        <input id="promoCode" name="promo_code" v-model="form.promo_code" required type="text" placeholder="e.g. SAVE20"
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
        <select id="discountType" name="discount_type" v-model="form.discount_type" required class="form-input border">
          <option disabled value="">Select Type</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>

      <!-- Discount Value -->
      <div class="mt-4">
        <label for="discountValue" class="block mb-1 font-medium">Discount Value</label>
        <input id="discountValue" name="discount_value" v-model="form.discount_value" required type="number" min="0"
          placeholder="e.g. 20 or 100" class="form-input border" />
      </div>

      <!-- Minimum Order Value -->
      <div class="mt-4">
        <label for="minOrderValue" class="block mb-1 font-medium">Minimum Order Value</label>
        <input id="minOrderValue" name="min_order_value" v-model="form.min_order_value" type="number" min="0"
          placeholder="Optional: e.g. 500" class="form-input border" />
      </div>

      <!-- Usage Limit -->
      <div class="mt-4">
        <label for="usageLimit" class="block mb-1 font-medium">Usage Limit</label>
        <input id="usageLimit" name="usage_limit" v-model="form.usage_limit" type="number" min="1"
          placeholder="Optional: e.g. 100 uses" class="form-input border" />
      </div>

      <!-- Per User Limit -->
      <div class="mt-4">
        <label for="perUserLimit" class="block mb-1 font-medium">Per User Limit</label>
        <input id="perUserLimit" name="per_user_limit" v-model="form.per_user_limit" type="number" min="1"
          placeholder="Optional: e.g. 2 uses per user" class="form-input border" />
      </div>

      <!-- Start Date -->
      <div class="mt-4">
        <label for="startDate" class="block mb-1 font-medium">Start Date</label>
        <input id="startDate" name="start_date" v-model="form.start_date" type="datetime-local"
          class="form-input border" />
      </div>

      <!-- End Date -->
      <div class="mt-4">
        <label for="endDate" class="block mb-1 font-medium">Expiry Date</label>
        <input id="endDate" name="end_date" v-model="form.end_date" type="datetime-local" class="form-input border" />
      </div>

      <!-- Applicable To -->
      <div class="mt-4">
        <label for="applicableTo" class="block mb-1 font-medium">Applicable To</label>
        <select id="applicableTo" name="applicable_to" v-model="form.applicable_to" multiple class="form-input border">
          <option value="hotels">Hotels</option>
          <option value="activities">Activities</option>
          <option value="transfers">Transfers</option>
        </select>
      </div>

      <!-- Applicable Users -->
      <div class="mt-4">
        <label for="applicableUsers" class="block mb-1 font-medium">Applicable Users</label>
        <textarea id="applicableUsers" name="applicable_users" v-model="form.applicable_users"
          placeholder="Optional: Enter user emails, comma-separated" class="form-input border" />
      </div>

      <!-- Status & Draft -->
      <div class="mt-4 flex items-center gap-6">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.status" name="status" class="size-4 rounded" />
          <span class="font-medium">Active</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.isDraft" name="isDraft" class="size-4 rounded" />
          <span class="font-medium">Draft</span>
        </label>
      </div>

      <!-- Submit Button -->
      <div class="mt-4">
        <button type="submit" :disabled="loading || !form.promo_code || !form.discount_value || !form.discount_type"
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

const loading = ref(false)
const route = useRoute()

const form = reactive({
  promo_code: '',
  description: '',
  discount_type: '',
  discount_value: '',
  min_order_value: '',
  usage_limit: '',
  per_user_limit: '',
  start_date: '',
  end_date: '',
  applicable_to: [],
  applicable_users: '',
  status: true,
  isDraft: false,
})

onMounted(async () => {
  try {
    const response = await axios.get(`/promo/${route.params.id}`)
    const data = await response.json()

    if (data) {
      form.promo_code = data.promo_code
      form.description = data.description
      form.discount_type = data.discount_type
      form.discount_value = data.discount_value
      form.min_order_value = data.min_order_value
      form.usage_limit = data.usage_limit
      form.per_user_limit = data.per_user_limit
      form.start_date = data.start_date
      form.end_date = data.end_date
      form.applicable_to = data.applicable_to
      form.applicable_users = data.applicable_users
      form.status = data.status
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
    const payload = { ...form }

    // If editing an existing promo (e.g. route has an ID), use PUT
    await axios.put(`/promo/${route.params.id}`, payload)
    alert('Promo code updated successfully!')

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
