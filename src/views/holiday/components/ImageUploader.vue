<template>
  <div>
    <v-file-input
      v-model="uploads"
      :prepend-icon="null"
      prepend-inner-icon="mdi-paperclip"
      :label="label"
      variant="outlined"
      :multiple="true"
      :chips="true"
    />
    <v-row v-if="uploads.length">
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(image, index) in uploads"
        :key="index"
        class="pa-4"
      >
        <div style="position: relative">
          <v-img
            :src="getImageUrl(image)"
            height="250"
            class="rounded w-full"
            alt="image"
            cover
          />
          <v-btn
            @click="removeImage(index)"
            icon="mdi-delete"
            class="imageDelete"
            color="error"
            size="x-small"
          />
        </div>
      </v-col>
    </v-row>
    <v-row v-if="images?.length">
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(image, index) in images"
        :key="index"
        class="pa-4"
      >
        <div style="position: relative">
          <v-img
            :src="image"
            height="250"
            class="rounded w-full"
            alt="image"
            cover
          />
          <v-btn
            v-if="showImgListDeleteIcon"
            @click="removeImageLink(index)"
            icon="mdi-delete"
            class="imageLinkDelete"
            color="error"
            size="x-small"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Optional single video upload -->
    <template v-if="enableVideo">
      <v-file-input
        v-model="videoFileInput"
        :prepend-icon="null"
        prepend-inner-icon="mdi-video"
        label="Video (optional)"
        variant="outlined"
        accept="video/*"
        :chips="true"
        class="mt-2"
        clearable
        @click:clear="clearVideo"
      />
      <!-- Local preview -->
      <div v-if="videoUploadRef" class="pa-2">
        <video
          :src="getVideoUrl(videoUploadRef)"
          controls
          style="width: 100%; max-height: 320px; border-radius: 8px"
        />
        <v-btn
          @click="clearVideo"
          icon="mdi-delete"
          color="error"
          size="x-small"
          class="mt-1"
        />
      </div>
      <!-- API / remote URL preview (only for valid https URLs) -->
      <div v-else-if="safeVideoUrl" class="pa-2">
        <video
          :src="safeVideoUrl"
          controls
          style="width: 100%; max-height: 320px; border-radius: 8px"
        />
        <v-btn
          v-if="showVideoDeleteIcon"
          @click="clearVideoUrl"
          icon="mdi-delete"
          color="error"
          size="x-small"
          class="mt-1"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  imageList: {
    type: Array,
    default: () => []
  },
  showImgListDeleteIcon: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: 'Images'
  },
  // --- video props (all optional, existing usages unaffected) ---
  enableVideo: {
    type: Boolean,
    default: false
  },
  videoUpload: {
    default: null
  },
  videoUrl: {
    type: String,
    default: null
  },
  showVideoDeleteIcon: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update', 'updateImageLink', 'update:videoUpload', 'update:videoUrl', 'error'])

const uploads = ref([...props.value])
const images = ref([...props.imageList])
// v-file-input always gives an array; keep a separate array ref for the input binding
const videoFileInput = ref(props.videoUpload ? [props.videoUpload] : [])
// single File (or null) derived from the input array
const videoUploadRef = ref(props.videoUpload instanceof File ? props.videoUpload : null)

const safeVideoUrl = computed(() => {
  try {
    if (!props.videoUrl || typeof props.videoUrl !== 'string') return null
    const url = new URL(props.videoUrl)
    return url.protocol === 'https:' ? props.videoUrl : null
  } catch {
    return null
  }
})

const removeImage = (index) => {
  uploads.value.splice(index, 1)
}

const removeImageLink = (index) => {
  images.value.splice(index, 1)
  emit('updateImageLink', images.value)
}

const clearVideo = () => {
  videoFileInput.value = []
  videoUploadRef.value = null
  emit('update:videoUpload', null)
}

const clearVideoUrl = () => {
  emit('update:videoUrl', null)
}

const getImageUrl = (file) => {
  if (!file) return null
  try {
    return URL.createObjectURL(file)
  } catch {
    return null
  }
}

const getVideoUrl = (file) => {
  if (!file) return null
  try {
    return URL.createObjectURL(file)
  } catch {
    return null
  }
}

watch(() => uploads.value, () => {
  emit('update', uploads.value)
})

watch(() => images.value, () => {
  emit('updateImageLink', images.value)
})

const VIDEO_MAX_BYTES = 4 * 1024 * 1024 // 4 MB

watch(videoFileInput, (val) => {
  // v-file-input returns an array; unwrap to single File or null
  const file = Array.isArray(val) ? (val[0] ?? null) : (val ?? null)
  if (file instanceof File && file.size > VIDEO_MAX_BYTES) {
    videoFileInput.value = []
    videoUploadRef.value = null
    emit('update:videoUpload', null)
    emit('error', 'Video file must be 4 MB or less')
    return
  }
  videoUploadRef.value = file instanceof File ? file : null
  emit('update:videoUpload', videoUploadRef.value)
})
</script>

<style scoped>
.imageDelete {
  position: absolute;
  top: 5px;
  right: 5px;
}
.imageLinkDelete {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
