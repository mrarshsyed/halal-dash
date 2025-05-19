<template>
  <v-container class="max-w-xl mx-auto py-6">
    <v-card elevation="4" class="pa-6">
      <v-card-title class="text-h5 font-weight-bold">
        Create New Blog
      </v-card-title>

      <v-form @submit.prevent="handleSubmit" class="mt-4" validate-on="submit lazy">
        <v-text-field v-model="form.title" label="Title" required outlined class="mb-4"></v-text-field>

        <v-text-field v-model="form.slug" label="Slug" required outlined class="mb-4"
          @input="onSlugInput"></v-text-field>

        <div>
          <editor-menu-bar v-if="editor" :editor="editor" />
          <editor-content :editor="editor" />
        </div>

        <!-- Image Upload Field -->
        <v-file-input label="Upload Image" accept="image/png,image/jpeg,image/jpg,image/gif" show-size
          @change="onImageChange" outlined prepend-icon="mdi-image" class="mb-4"></v-file-input>

        <!-- Preview Image -->
        <div v-if="form.imagePreview" class="mb-4">
          <v-img :src="form.imagePreview" max-width="100%" height="200px" cover></v-img>
        </div>

        <v-btn type="submit" color="primary" variant="flat" class="mt-2" :loading="loading"
          :disabled="loading || !form.title || !form.slug || !form.content">
          Publish
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import axios from '@/plugins/axios'
import { useRoute } from 'vue-router'

import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

// Reactive form data
const form = reactive({
  title: '',
  slug: '',
  slugEdited: false,
  content: '',
  image: null,
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

// Auto-generate slug when title changes (unless manually edited)
watch(
  () => form.title,
  (newTitle) => {
    if (!form.slugEdited) {
      form.slug = newTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove invalid chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
    }
  }
)

// Mark slug as manually edited to stop auto generation
function onSlugInput() {
  form.slugEdited = true
}

// Handle image input change and generate preview
function onImageChange(file) {
  form.image = file
  if (file && file instanceof File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.imagePreview = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    form.imagePreview = null
  }
}

// Reset form after successful submission
function resetForm() {
  form.title = ''
  form.slug = ''
  form.slugEdited = false
  form.content = ''
  form.image = null
  form.imagePreview = null
  editor.commands.setContent('<p></p>')
}

// Submit form data to API
async function handleSubmit() {
  if (!form.title || !form.slug || !form.content) {
    alert('Please fill in all required fields.')
    return
  }

  loading.value = true

  const payload = new FormData()
  payload.append('title', form.title)
  payload.append('slug', form.slug)
  payload.append('content', form.content)
  if (form.image) {
    payload.append('image', form.image)
  }

  try {
    const response = await axios.post('/blogs', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.status === 200) {
      alert('Blog submitted successfully!')
      resetForm()
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

<style>
.tiptap.ProseMirror {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  margin-bottom: 20px;
  width: 100%;
  min-height: 160px;
}
</style>