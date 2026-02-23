<template>
  <div>
    <h2 class="text-xl font-bold mb-4">
      Create UI Slider
    </h2>
    <SliderForm
      submit-label="Submit"
      :submitting="submitting"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'
import SliderForm from '@/views/sliders/components/SliderForm.vue'

const router = useRouter()
const submitting = ref(false)

async function handleSubmit(payload) {
  if (submitting.value) return
  try {
    submitting.value = true
    const res = await axios.post('admin/ui-slider', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    router.push('/sliders/list')
    console.log('Success:', res.data)
  } catch (err) {
    console.error('Error submitting form:', err)
  } finally {
    submitting.value = false
  }
}
</script>
