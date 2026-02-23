<template>
  <div>
    <h2 class="text-xl font-bold mb-4">
      Edit UI Slider
    </h2>
    <p
      v-if="loading"
      class="text-sm text-gray-500"
    >
      Loading slider...
    </p>
    <SliderForm
      v-else
      :initial-data="form"
      submit-label="Update"
      :submitting="submitting"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useRoute, useRouter } from 'vue-router'
import SliderForm from '@/views/sliders/components/SliderForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const loading = ref(true)
const submitting = ref(false)

const form = ref({
  name: '',
  location: '',
  active: false,
  sliders: [{ title: '', url: '', image: '' }]
})

onMounted(async () => {
  try {
    const res = await axios.get(`admin/ui-slider/${id}`)
    const data = res.data

    form.value = {
      name: data?.name || '',
      location: data?.location || '',
      active: !!data?.active,
      sliders: Array.isArray(data?.sliders) && data.sliders.length
        ? data.sliders
        : [{ title: '', url: '', image: '' }]
    }
  } catch (err) {
    console.error('Failed to fetch slider data:', err)
  } finally {
    loading.value = false
  }
})

async function handleSubmit(payload) {
  if (submitting.value) return
  try {
    submitting.value = true
    const res = await axios.patch(`admin/ui-slider/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    router.push('/sliders/list')
    console.log('Updated successfully:', res.data)
  } catch (err) {
    console.error('Error updating form:', err)
  } finally {
    submitting.value = false
  }
}
</script>
