<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-6"
  >
    <div>
      <label>Name</label>
      <input
        type="text"
        v-model="form.name"
        class="form-input border w-full"
        required
      >
    </div>

    <div>
      <label>Location</label>
      <input
        type="text"
        v-model="form.location"
        class="form-input border w-full"
        required
      >
    </div>

    <div class="flex items-center gap-2">
      <input
        type="checkbox"
        v-model="form.active"
      >
      <label>Active</label>
    </div>

    <div
      v-for="(slider, index) in form.sliders"
      :key="index"
      class="border rounded p-4"
    >
      <div class="space-y-4">
        <h3 class="font-semibold">
          Slide {{ index + 1 }}
        </h3>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label>Title</label>
            <input
              type="text"
              v-model="slider.title"
              class="form-input border w-full"
              required
            >
          </div>

          <div>
            <label>URL</label>
            <input
              type="url"
              v-model="slider.url"
              class="form-input border w-full"
            >
          </div>

          <div>
            <label>Slider Type</label>
            <select
              v-model="slider.sliderType"
              class="form-input border w-full"
              @change="onSliderTypeChange(index)"
            >
              <option value="image">
                Image
              </option>
              <option
                value="video"
                :disabled="slider.sliderType !== 'video' && hasOtherVideoSlider(index)"
              >
                Video
              </option>
            </select>
          </div>
        </div>

        <template v-if="slider.sliderType === 'image'">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label>Image URL</label>
              <input
                type="url"
                v-model="slider.image"
                class="form-input border w-full"
              >
            </div>

            <div>
              <label>Or Upload Image</label>
              <input
                type="file"
                accept="image/*"
                @change="onImageFileChange($event, index)"
              >
            </div>

            <div
              v-if="imagePreviews[index] || slider.image"
              class="md:col-span-2"
            >
              <img
                :src="imagePreviews[index] || slider.image"
                class="h-32 object-cover mt-2 rounded"
              >
            </div>
          </div>
        </template>

        <template v-else>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="space-y-3">
              <div>
                <label>Video URL</label>
                <input
                  type="url"
                  v-model="slider.video"
                  class="form-input border w-full"
                >
              </div>

              <div>
                <label>Or Upload Video</label>
                <input
                  type="file"
                  accept="video/*"
                  @change="onVideoFileChange($event, index)"
                >
              </div>

              <div v-if="videoPreviews[index] || slider.video">
                <video
                  controls
                  class="w-full h-auto max-h-80 mt-2 rounded object-contain bg-black"
                >
                  <source :src="videoPreviews[index] || slider.video">
                </video>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <label>Mobile Video URL</label>
                <input
                  type="url"
                  v-model="slider.mobileVideo"
                  class="form-input border w-full"
                >
              </div>

              <div>
                <label>Or Upload Mobile Video</label>
                <input
                  type="file"
                  accept="video/*"
                  @change="onMobileVideoFileChange($event, index)"
                >
              </div>

              <div v-if="mobileVideoPreviews[index] || slider.mobileVideo">
                <video
                  controls
                  class="w-full h-auto max-h-80 mt-2 rounded object-contain bg-black"
                >
                  <source :src="mobileVideoPreviews[index] || slider.mobileVideo">
                </video>
              </div>
            </div>
          </div>
        </template>

        <button
          v-if="slider.sliderType !== 'video' && form.sliders.length > 1"
          type="button"
          @click="removeSlider(index)"
          class="text-red-600 text-sm"
        >
          Remove Slider
        </button>
      </div>
    </div>

    <div class="flex gap-4 items-center">
      <button
        v-if="!hasVideoSlider"
        type="button"
        @click="addSlider"
        class="mt-2 text-blue-600 text-sm"
      >
        + Add Slider
      </button>
      <button
        type="submit"
        class="bg-primary text-white px-6 py-2 rounded"
        :disabled="submitting"
      >
        {{ submitLabel }}
      </button>
    </div>

    <p
      v-if="formError"
      class="text-red-600 text-sm"
    >
      {{ formError }}
    </p>
  </form>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      name: '',
      location: '',
      active: false,
      sliders: [{
        title: '',
        url: '',
        image: '',
        video: '',
        mobileVideo: '',
        sliderType: 'image'
      }]
    })
  },
  submitLabel: {
    type: String,
    default: 'Submit'
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  location: '',
  active: false,
  sliders: []
})

const sliderImageFiles = ref({})
const sliderVideoFiles = ref({})
const sliderMobileVideoFiles = ref({})
const imagePreviews = ref({})
const videoPreviews = ref({})
const mobileVideoPreviews = ref({})
const formError = ref('')
const hasVideoSlider = computed(() => form.sliders.some((slider) => slider.sliderType === 'video'))

const hasValue = (value) => !!String(value || '').trim()

const inferSliderType = (slider) => {
  if (slider?.sliderType === 'image' || slider?.sliderType === 'video') {
    return slider.sliderType
  }

  return hasValue(slider?.video) || hasValue(slider?.mobileVideo) ? 'video' : 'image'
}

const createEmptySlider = () => ({
  title: '',
  url: '',
  image: '',
  video: '',
  mobileVideo: '',
  sliderType: 'image'
})

const shiftMapAfterRemove = (map, removedIndex) => {
  const next = {}

  Object.keys(map).forEach((key) => {
    const idx = Number(key)
    if (Number.isNaN(idx) || idx === removedIndex) {
      return
    }

    next[idx > removedIndex ? idx - 1 : idx] = map[key]
  })

  return next
}

const revokePreview = (mapRef, index) => {
  const source = mapRef.value[index]
  if (source && source.startsWith('blob:')) {
    URL.revokeObjectURL(source)
  }
  delete mapRef.value[index]
}

const revokeAllPreviews = (mapRef) => {
  Object.keys(mapRef.value).forEach((key) => {
    const source = mapRef.value[key]
    if (source && source.startsWith('blob:')) {
      URL.revokeObjectURL(source)
    }
  })
}

const setFilePreview = (mapRef, index, file) => {
  revokePreview(mapRef, index)
  mapRef.value[index] = URL.createObjectURL(file)
}

const resetLocalMediaState = () => {
  revokeAllPreviews(imagePreviews)
  revokeAllPreviews(videoPreviews)
  revokeAllPreviews(mobileVideoPreviews)

  sliderImageFiles.value = {}
  sliderVideoFiles.value = {}
  sliderMobileVideoFiles.value = {}
  imagePreviews.value = {}
  videoPreviews.value = {}
  mobileVideoPreviews.value = {}
}

const normalizeData = (value) => {
  const sliders = Array.isArray(value?.sliders) && value.sliders.length
    ? value.sliders.map((slider) => ({
        title: slider?.title || '',
        url: slider?.url || '',
        image: slider?.image || '',
        video: slider?.video || '',
        mobileVideo: slider?.mobileVideo || '',
        sliderType: inferSliderType(slider)
      }))
    : [createEmptySlider()]

  return {
    name: value?.name || '',
    location: value?.location || '',
    active: !!value?.active,
    sliders
  }
}

const syncForm = (value) => {
  const data = normalizeData(value)
  form.name = data.name
  form.location = data.location
  form.active = data.active
  form.sliders.splice(0, form.sliders.length, ...data.sliders)
  resetLocalMediaState()
  formError.value = ''
}

watch(() => props.initialData, syncForm, { deep: true, immediate: true })
onBeforeUnmount(resetLocalMediaState)

function addSlider() {
  if (hasVideoSlider.value) {
    formError.value = 'Only one video slider is allowed. Remove video type to add more sliders.'
    return
  }

  form.sliders.push(createEmptySlider())
  formError.value = ''
}

function removeSlider(index) {
  revokePreview(imagePreviews, index)
  revokePreview(videoPreviews, index)
  revokePreview(mobileVideoPreviews, index)

  form.sliders.splice(index, 1)

  sliderImageFiles.value = shiftMapAfterRemove(sliderImageFiles.value, index)
  sliderVideoFiles.value = shiftMapAfterRemove(sliderVideoFiles.value, index)
  sliderMobileVideoFiles.value = shiftMapAfterRemove(sliderMobileVideoFiles.value, index)

  imagePreviews.value = shiftMapAfterRemove(imagePreviews.value, index)
  videoPreviews.value = shiftMapAfterRemove(videoPreviews.value, index)
  mobileVideoPreviews.value = shiftMapAfterRemove(mobileVideoPreviews.value, index)

  formError.value = ''
}

function clearImageState(index) {
  form.sliders[index].image = ''
  delete sliderImageFiles.value[index]
  revokePreview(imagePreviews, index)
}

function clearVideoState(index) {
  form.sliders[index].video = ''
  form.sliders[index].mobileVideo = ''
  delete sliderVideoFiles.value[index]
  delete sliderMobileVideoFiles.value[index]
  revokePreview(videoPreviews, index)
  revokePreview(mobileVideoPreviews, index)
}

function onSliderTypeChange(index) {
  if (form.sliders[index].sliderType === 'video' && hasOtherVideoSlider(index)) {
    form.sliders[index].sliderType = 'image'
    formError.value = 'Only one video slider is allowed.'
    return
  }

  if (form.sliders[index].sliderType === 'image') {
    clearVideoState(index)
  } else {
    clearImageState(index)
  }
  formError.value = ''
}

function hasOtherVideoSlider(index) {
  return form.sliders.some((slider, sliderIndex) => sliderIndex !== index && slider.sliderType === 'video')
}

function onImageFileChange(e, index) {
  const file = e.target.files[0]
  if (file) {
    sliderImageFiles.value[index] = file
    form.sliders[index].image = ''
    setFilePreview(imagePreviews, index, file)
    formError.value = ''
  }
}

function onVideoFileChange(e, index) {
  const file = e.target.files[0]
  if (file) {
    sliderVideoFiles.value[index] = file
    form.sliders[index].video = ''
    setFilePreview(videoPreviews, index, file)
    formError.value = ''
  }
}

function onMobileVideoFileChange(e, index) {
  const file = e.target.files[0]
  if (file) {
    sliderMobileVideoFiles.value[index] = file
    form.sliders[index].mobileVideo = ''
    setFilePreview(mobileVideoPreviews, index, file)
    formError.value = ''
  }
}

function validateForm() {
  if (!form.sliders.length) {
    return 'At least one slider is required.'
  }

  const videoCount = form.sliders.filter((slider) => slider.sliderType === 'video').length
  if (videoCount > 1) {
    return 'Only one video slider is allowed.'
  }

  for (let i = 0; i < form.sliders.length; i += 1) {
    const slider = form.sliders[i]
    if (!hasValue(slider.title)) {
      return `Slide ${i + 1}: title is required.`
    }

    if (slider.sliderType === 'image') {
      const hasImage = hasValue(slider.image) || !!sliderImageFiles.value[i]
      if (!hasImage) {
        return `Slide ${i + 1}: provide image URL or upload image.`
      }
      continue
    }

    const hasVideo = hasValue(slider.video) || !!sliderVideoFiles.value[i]
    const hasMobileVideo = hasValue(slider.mobileVideo) || !!sliderMobileVideoFiles.value[i]
    if (!hasVideo && !hasMobileVideo) {
      return `Slide ${i + 1}: provide video/mobile video URL or upload file.`
    }
  }

  return ''
}

function handleSubmit() {
  const validationError = validateForm()
  if (validationError) {
    formError.value = validationError
    return
  }

  formError.value = ''
  const payload = new FormData()

  const cleanSliders = form.sliders.map((slider) => ({
    title: slider.title,
    url: slider.url || null,
    image: slider.sliderType === 'image' ? (slider.image || null) : null,
    video: slider.sliderType === 'video' ? (slider.video || null) : null,
    mobileVideo: slider.sliderType === 'video' ? (slider.mobileVideo || null) : null,
    sliderType: slider.sliderType || 'image'
  }))

  payload.append(
    'data',
    JSON.stringify({
      name: form.name,
      location: form.location,
      active: form.active,
      sliders: cleanSliders
    })
  )

  Object.keys(sliderImageFiles.value).forEach((key) => {
    payload.append(`slider_${key}`, sliderImageFiles.value[key])
  })

  Object.keys(sliderVideoFiles.value).forEach((key) => {
    payload.append(`slider_video_${key}`, sliderVideoFiles.value[key])
  })

  Object.keys(sliderMobileVideoFiles.value).forEach((key) => {
    payload.append(`slider_mobile_video_${key}`, sliderMobileVideoFiles.value[key])
  })

  emit('submit', payload)
}
</script>
