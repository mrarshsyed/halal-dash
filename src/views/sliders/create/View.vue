<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Create UI Slider</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Fields -->
      <div>
        <label>Name</label>
        <input type="text" v-model="form.name" class="form-input border w-full" required />
      </div>

      <div>
        <label>Location</label>
        <input type="text" v-model="form.location" class="form-input border w-full" required />
      </div>

      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="form.active" />
        <label>Active</label>
      </div>

      <!-- Sliders -->
      <div v-for="(slider, index) in form.sliders" :key="index" class="border rounded p-4 space-y-3">
        <h3 class="font-semibold">Slide {{ index + 1 }}</h3>

        <div>
          <label>Title</label>
          <input type="text" v-model="slider.title" class="form-input border w-full" required />
        </div>

        <div>
          <label>URL</label>
          <input type="url" v-model="slider.url" class="form-input border w-full" />
        </div>

        <div>
          <label>Image URL (Optional)</label>
          <input type="url" v-model="slider.image" class="form-input border w-full" />
        </div>

        <div>
          <label>Or Upload Image </label>
          <input type="file" @change="onFileChange($event, index)" />
        </div>

        <div v-if="filePreviews[index]">
          <img :src="filePreviews[index]" class="h-32 object-cover mt-2 rounded" />
        </div>

        <button type="button" @click="removeSlider(index)" class="text-red-600 text-sm">Remove Slider</button>
      </div>

      <div class="flex gap-4 items-center">
        <button type="button" @click="addSlider" class="mt-2 text-blue-600 text-sm">+ Add Slider</button>
        <!-- Submit -->
        <button type="submit" class="bg-primary text-white px-6 py-2 rounded">Submit</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  name: '',
  location: '',
  active: false,
  sliders: [
    {
      title: '',
      url: '',
      image: ''
    }
  ]
})

const sliderFiles = ref({})
const filePreviews = ref({})

function addSlider() {
  form.sliders.push({ title: '', url: '', image: '' })
}

function removeSlider(index) {
  form.sliders.splice(index, 1)
  delete sliderFiles.value[`slider_${index}`]
  delete filePreviews.value[index]
}

function onFileChange(e, index) {
  const file = e.target.files[0]
  if (file) {
    sliderFiles.value[`slider_${index}`] = file

    // Clear the image URL if a file is uploaded
    form.sliders[index].image = ''

    const reader = new FileReader()
    reader.onload = (e) => {
      filePreviews.value[index] = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function handleSubmit() {
  const payload = new FormData()

  const cleanSliders = form.sliders.map((slider, index) => {
    const hasFile = sliderFiles.value[`slider_${index}`]
    return {
      title: slider.title,
      url: slider.url,
      image: slider.image || null
    }
  })

  const data = {
    name: form.name,
    location: form.location,
    active: form.active,
    sliders: cleanSliders
  }

  payload.append('data', JSON.stringify(data))

  for (const key in sliderFiles.value) {
    payload.append(key, sliderFiles.value[key])
  }

  try {
    const res = await axios.post('admin/ui-slider', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    router.push('/sliders/list')
    console.log('Success:', res.data)
  } catch (err) {
    console.error('Error submitting form:', err)
  }
}
</script>