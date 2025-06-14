<template>
  <h2 class="text-xl font-bold mb-4">All Promo Codes</h2>

  <div class="overflow-x-auto">
    <table class="min-w-full table-auto border border-gray-200 text-sm">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="px-4 py-2 border-b whitespace-nowrap">Promo Code</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Type</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Applicable Module</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Applicable Users</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Value</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Usage Limit</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Usage Limit Per User</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Usage Limit Per User</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Status</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Start Date</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Expiry Date</th>
          <th class="px-4 py-2 border-b whitespace-nowrap">Verified</th>
          <th class="px-4 py-2 border-b whitespace-nowrap text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="promo in promos" :key="promo?._id" class="hover:bg-gray-50">
          <td class="px-4 py-2 border-b font-mono uppercase">{{ promo?.promoCode }}</td>
          <td class="px-4 py-2 border-b capitalize">{{ promo?.discountType }}</td>
          <td class="px-4 py-2 border-b capitalize">{{ promo?.applicableModule }}</td>
          <td class="px-4 py-2 border-b">
            {{ promo?.discountValue }}{{ promo?.discountType === 'percentage' ? '%' : 'AED' }}
          </td>
          <td class="px-4 py-2 border-b">
            <template v-if="Array.isArray(promo?.applicableUsers)">
              <span v-for="user in promo?.applicableUsers" :key="user" class="capitalize mr-2 whitespace-nowrap">
                {{ user?.name }},
              </span>
            </template>
          </td>
          <td class="px-4 py-2 border-b">{{ promo?.usageLimit }}</td>
          <td class="px-4 py-2 border-b">{{ promo?.usageLimitPerUser }}</td>
          <td class="px-4 py-2 border-b">
            <span :class="promo?.status ? 'text-green-600 font-medium' : 'text-gray-400'">
              {{ promo?.status ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="px-4 py-2 border-b capitalize whitespace-nowrap">
            {{ new Date(promo?.startDate || "").toLocaleString() }}
          </td>
          <td class="px-4 py-2 border-b capitalize whitespace-nowrap">
            {{ new Date(promo?.expireDate || "").toLocaleString() }}
          </td>
          <td class="px-4 py-2 border-b capitalize whitespace-nowrap">
            {{ promo?.isVerified ? "Yes" : "No" }}
          </td>
          <td class="px-4 py-2 border-b text-center flex items-center gap-4">
            <router-link :to="`/promos/edit/${promo?._id}`" class="text-blue-600 hover:underline">
              Edit
            </router-link>
            <button @click="deletePromo(promo?._id)" class="ml-3 text-red-500 hover:underline">
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="promos.length === 0">
          <td colspan="6" class="text-center py-4 text-gray-500">No promo codes found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'

const promos = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('admin/settings/price-coupons')
    if (data?.data) {
      promos.value = data.data
    }
  } catch (err) {
    console.error('Failed to fetch promos:', err)
  }
})

const deletePromo = async (id) => {
  if (!confirm('Are you sure you want to delete this promo code?')) return

  try {
    await axios.delete(`/promo/${id}`)
    promos.value = promos.value.filter((p) => p._id !== id)
  } catch (err) {
    console.error('Failed to delete promo:', err)
  }
}
</script>
