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
        <label for="minOrderValue" class="block mb-1 font-medium">Minimum Order Value</label>
        <input id="minOrderValue" name="minOrderAmount" v-model="form.minOrderAmount" type="number" min="0"
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
        <input id="startDate" name="startDate" v-model="form.startDate" type="date" class="form-input border"
          :min="new Date().toISOString().split('T')[0]" />
      </div>

      <!-- End Date -->
      <div class="mt-4">
        <label for="endDate" class="block mb-1 font-medium">Expiry Date</label>
        <input id="endDate" name="expireDate" v-model="form.expireDate" type="date" class="form-input border"
          :min="form.startDate" />
      </div>

      <!-- Applicable To -->
      <div class="mt-4">
        <label for="applicableTo" class="block mb-1 font-medium">Applicable To</label>
        <select id="applicableTo" name="applicableModule" v-model="form.applicableModule" multiple
          class="form-input border">
          <option value="hotel">Hotel</option>
          <option value="activity">Activity</option>
          <option value="transfer">Transfer</option>
          <option value="insurance">Insurance</option>
          <option value="holiday">Holiday</option>
        </select>
      </div>

      <!-- Applicable Users -->
      <div class="mt-4">
        <label for="applicableUsers" class="block mb-1 font-medium">Applicable Users</label>
        <input id="applicableUsers" name="applicableUsers" v-model="form.applicableUsers"
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

      <div class="mt-4">
        <label for="bank" class="block mb-1 font-medium">Eligible Bank</label>
        <select id="bank" name="bank" v-model="form.bank" class="form-input border">
          <option value="" disabled>Select Bank</option>
          <template v-for="bank in banks" :key="bank.label">
            <option :value="bank.label.split(' ').join('-').toLowerCase()">
              {{ bank.label }}
            </option>
          </template>
        </select>
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
import { reactive, ref } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'
import banks from '@/utils/banks'

const router = useRouter()
const loading = ref(false)

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
  bank: ''
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

    await axios.post('admin/settings/price-coupons', payload)
    alert('Promo code created successfully!')
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
