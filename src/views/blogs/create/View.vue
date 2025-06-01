<template>
  <div>
    <h1 class="text-xl font-bold">Create New Blog</h1>

    <form @submit="handleSubmit" class="mt-4" validate-on="submit lazy">
      <!-- Title -->
      <div class="mt-4">
        <label for="title" class="block mb-1 font-medium">Title</label>
        <input id="title" name="title" v-model="form.title" required type="text" placeholder="Enter blog title"
          class="form-input border" />
      </div>

      <!-- Slug -->
      <div class="mt-4">
        <label for="slug" class="block mb-1 font-medium">Slug</label>
        <input id="slug" name="slug" v-model="form.slug" @input="onSlugInput" required type="text"
          placeholder="Enter slug" class="form-input border" />
      </div>

      <!-- Category -->
      <div class="mt-4">
        <label for="category" class="block mb-1 font-medium">Category</label>
        <select id="category" name="category" v-model="form.category" @input="onSlugInput" required type="text"
          placeholder="Enter slug" class="form-input border capitalize">
          <option value="">Category</option>
          <option value="destinations">destinations</option>
          <option value="halal_foods">halal foods</option>
          <option value="tips">tips</option>
        </select>
      </div>

      <!-- Content -->
      <div class="mt-4">
        <label for="content" class="block mb-1 font-medium">Content</label>
        <editor-menu-bar v-if="editor" :editor="editor" />
        <editor-content :editor="editor" name="content" />
      </div>

      <!-- Estimated Reading Time -->
      <div class="mt-4">
        <label for="estimated_reading_time" class="block mb-1 font-medium">Estimated Reading Time</label>
        <input id="estimated_reading_time" name="estimated_reading_time" v-model="form.estimated_reading_time" required
          type="number" placeholder="e.g. 5 minutes" class="form-input border" />
      </div>

      <!-- Meta Description -->
      <div class="mt-4">
        <label for="meta_description" class="block mb-1 font-medium">Meta Description</label>
        <textarea id="meta_description" name="meta_description" v-model="form.meta_description" required type="text"
          placeholder="Meta Description" class="form-input border" />
      </div>

      <!-- Meta Description -->
      <div class="mt-4">
        <label for="tags" class="block mb-1 font-medium">Tags</label>
        <input id="tags" name="tags" v-model="form.tags" required type="text" placeholder="Tags separated by comma"
          class="form-input border" />
      </div>

      <!-- Featured Checkbox -->
      <div class="mt-4">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.featured" name="featured" class="size-4 rounded" />
          <span class="font-medium">Mark as featured</span>
        </label>
      </div>

      <!-- Image Upload -->
      <div class="mt-4">
        <label :class="[
          'border-2 border-dashed border-gray-300 hover:border-primary-500 transition-all duration-300 min-h-40 rounded-lg cursor-pointer bg-white relative group',
          'flex flex-col items-center justify-center'
        ]">
          <input type="file" accept="image/png,image/jpeg,image/jpg,image/gif"
            class="opacity-0 absolute inset-0 cursor-pointer" name="image" @change="onImageChange" />
          <div class="flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span class="text-sm font-medium">Click or drag to upload image</span>
            <span class="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, GIF</span>
          </div>
        </label>

        <!-- Preview -->
        <div v-if="form.imagePreview" class="mt-4">
          <img :src="form.imagePreview" class="h-40 aspect-video rounded-lg object-cover" />
        </div>
      </div>

      <!-- Submit -->
      <div class="mt-4">
        <button type="submit" :disabled="loading || !form.title || !form.slug || !form.content"
          class="bg-primary text-white px-6 py-2 rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="!loading">Publish</span>
          <span v-else>Publishing...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import axios from '@/plugins/axios'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive form data
const form = reactive({
  title: '',
  slug: '',
  slugEdited: false,
  content: '',
  category: '',
  tags: '',
  image: null,
  featured: false,
  estimated_reading_time: "",
  imagePreview: null,
})

// Loading state for submit button
const loading = ref(false)

// Initialize TipTap editor with onUpdate handler
const editor = useEditor({
  extensions: [StarterKit],
  content: '<p>Hello <strong>HalalExplore</strong>!</p>',
  onUpdate({ editor }) {
    form.content = editor.getHTML()
  },
})

const makeSlug = (str) => {
  return (str || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove invalid chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
}

// Auto-generate slug when title changes (unless manually edited)
watch(
  () => form.title,
  (newTitle) => {
    if (!form.slugEdited) {
      form.slug = makeSlug(newTitle)
    }
  }
)

// Mark slug as manually edited to stop auto generation
function onSlugInput() {
  form.slugEdited = true
}

// Handle image input change and generate preview
function onImageChange(event) {
  const file = event?.target?.files?.[0] || event?.[0]
  if (file && file instanceof File) {
    form.image = file

    const reader = new FileReader()
    reader.onload = (e) => {
      form.imagePreview = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    form.image = null
    form.imagePreview = null
  }
}

// Submit form data to API
async function handleSubmit(e) {
  e.preventDefault();

  if (!form.title || !form.slug || !form.content) {
    alert('Please fill in all required fields.')
    return
  }

  loading.value = true

  const payload = new FormData(e.target)
  payload.append('slug', makeSlug(form.slug))
  payload.append('estimated_reading_time', Number(form.estimated_reading_time))
  payload.append('tags', form.tags.split(',').map(tag => tag.trim()))
  payload.append('content', form.content)

  try {
    const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/admin/blog`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.status === 200) {
      // alert('Blog submitted successfully!')
      // resetForm()
      router.push('/blogs/list')
    } else {
      alert('Failed to submit blog. Please try again.')
      console.error('Failed to submit blog:', response)
    }
  } catch (error) {
    alert('Failed to submit blog. Please try again.')
    console.error('Error submitting blog:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style></style>