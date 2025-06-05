<template>
  <div>
    <h1 class="text-h5 font-weight-bold">Update Blog</h1>

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
        <input id="slug" name="slug" :value="form.slug" @input="onSlugInput" required type="text"
          placeholder="Enter slug" class="form-input border" />
      </div>

      <!-- Category -->
      <div class="mt-4">
        <label for="category" class="block mb-1 font-medium">Category</label>
        <select id="category" name="category" v-model="form.category" type="text" class="form-input border capitalize">
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
        <label for="estimatedReadingTime" class="block mb-1 font-medium">Estimated Reading Time</label>
        <input id="estimatedReadingTime" name="estimatedReadingTime" v-model="form.estimatedReadingTime" type="number"
          placeholder="e.g. 5 minutes" class="form-input border" />
      </div>

      <!-- Meta Description -->
      <div class="mt-4">
        <label for="seoMetaDescription" class="block mb-1 font-medium">Meta Description</label>
        <textarea id="seoMetaDescription" name="seoMetaDescription" v-model="form.seoMetaDescription" type="text"
          placeholder="Meta Description" class="form-input border" />
      </div>

      <!-- Tags -->
      <div class="mt-4">
        <label for="tags" class="block mb-1 font-medium">Tags</label>
        <div class="form-input border flex flex-wrap gap-2">
          <span v-for="tag in form.tags" :key="tag"
            class="px-2 py-0.5 bg-gray-200 rounded inline-flex items-center gap-2">
            <input type="hidden" name="tags" :value="tag" />
            {{ tag }}
            <button type="button" @click="form.tags = form.tags.filter(t => t !== tag)">x</button>
          </span>
          <input type="text" placeholder="Tag" id="tags" @keypress="addTag" class="focus:outline-none grow" />
        </div>
      </div>

      <!-- Featured Checkbox -->
      <div class="mt-4 flex items-center gap-6">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.featured" name="featured" class="size-4 rounded" />
          <span class="font-medium">Mark as featured</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.isDraft" name="isDraft" class="size-4 rounded" />
          <span class="font-medium">Draft</span>
        </label>
      </div>

      <!-- Image Upload -->
      <div class="mt-4">
        <label for="image" class="block mb-1 font-medium">Blog Image</label>
        <label :class="[
          'border-2 border-dashed border-gray-300 hover:border-primary-500 transition-all duration-300 min-h-40 rounded-lg cursor-pointer bg-white relative group',
          'flex flex-col items-center justify-center'
        ]">
          <input type="file" accept="image/png,image/jpeg,image/jpg,image/gif"
            class="opacity-0 absolute inset-0 cursor-pointer" name="image" id="image" @change="onImageChange" />
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

      <fieldset class="border rounded-lg mt-4 p-4">
        <!-- Meta Title -->
        <div class="">
          <label for="seoMetaTitle" class="block mb-1 font-medium">SEO Meta Title</label>
          <input id="seoMetaTitle" name="seoMetaTitle" v-model="form.seoMetaTitle" type="text" placeholder="Meta Title"
            class="form-input border" />
        </div>

        <!-- Meta Description -->
        <div class="mt-4">
          <label for="seoMetaDescription" class="block mb-1 font-medium">SEO Meta Description</label>
          <textarea id="seoMetaDescription" name="seoMetaDescription" v-model="form.seoMetaDescription"
            placeholder="Meta Description" class="form-input border" />
        </div>

        <!-- Meta Robots -->
        <div class="mt-4">
          <label for="seoMetaRobots" class="block mb-1 font-medium">SEO Meta Robots</label>
          <input id="seoMetaRobots" name="seoMetaRobots" v-model="form.seoMetaRobots" type="text"
            placeholder="index, follow" class="form-input border" />
        </div>

        <!-- Meta Keywords -->
        <div class="mt-4">
          <label for="seoMetaKeywords" class="block mb-1 font-medium">SEO Meta Keywords</label>
          <div class="form-input border flex flex-wrap gap-2">
            <span v-for="keyword in form.seoMetaKeywords" :key="keyword"
              class="px-2 py-0.5 bg-gray-200 rounded inline-flex items-center gap-2">
              <input type="hidden" name="seoMetaKeywords" :value="keyword" />
              {{ keyword }}
              <button type="button"
                @click="form.seoMetaKeywords = form.seoMetaKeywords.filter(t => t !== keyword)">x</button>
            </span>
            <input type="text" placeholder="SEO Meta Keyword" id="seoMetaKeywords" @keypress="addKeyword"
              class="focus:outline-none grow" />
          </div>
        </div>

        <!-- SEO Meta Image -->
        <div class="mt-4">
          <label for="seoImage" class="block mb-1 font-medium">SEO Meta Image</label>
          <label :class="[
            'border-2 border-dashed border-gray-300 hover:border-primary-500 transition-all duration-300 min-h-40 rounded-lg cursor-pointer bg-white relative group',
            'flex flex-col items-center justify-center'
          ]">
            <input type="file" accept="image/png,image/jpeg,image/jpg,image/gif"
              class="opacity-0 absolute inset-0 cursor-pointer" name="seoImage" id="seoImage"
              @change="onMetaImageChange" />
            <div class="flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span class="text-sm font-medium">Click or drag to upload image</span>
              <span class="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</span>
            </div>
          </label>

          <!-- Meta Image Preview -->
          <div v-if="form.metaImagePreview" class="mt-4">
            <img :src="form.metaImagePreview" class="h-40 aspect-video rounded-lg object-cover" />
          </div>
        </div>
      </fieldset>

      <!-- Submit -->
      <div class="mt-4">
        <button type="submit" :disabled="loading || !form.title || !form.slug || !form.content"
          class="bg-primary text-white px-6 py-2 rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="!loading">Update</span>
          <span v-else>Updating...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, watchEffect } from 'vue'
import axios from '@/plugins/axios'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useRouter, useRoute } from 'vue-router'
import { makeSlug } from '@/utils/slug'

const router = useRouter()
const route = useRoute()

// Reactive form data
const form = reactive({
  title: '',
  slug: '',
  content: '',
  category: '',
  estimatedReadingTime: "",
  tags: [],
  featured: false,
  isDraft: false,
  image: "",
  seoMetaTitle: '',
  seoMetaDescription: '',
  seoMetaKeywords: [],
  seoMetaRobots: "",
  seoImage: [],
  // optional
  slugEdited: false,
  // preview
  imagePreview: null,
  metaImagePreview: null,
})
const blogId = ref(null)

watchEffect(() => {
  axios.get(`admin/blog/${route.params.slug}`)
    .then(res => {
      const data = res.data
      if (data) {
        form.title = data.title;
        form.slug = data.slug;
        form.content = data.content;
        form.category = data.category;
        form.estimatedReadingTime = data.estimatedReadingTime;
        form.tags = data.tags;
        form.featured = data.featured;
        form.isDraft = data.isDraft;
        // SEO
        form.seoMetaTitle = data.seoMetaTitle
        form.seoMetaDescription = data.seoMetaDescription
        form.seoMetaKeywords = data.seoMetaKeywords
        form.seoMetaRobots = data.seoMetaRobots
        // Images
        form.imagePreview = data.image
        form.metaImagePreview = data.seoMetaImage
        // Make sure editor is initialized before setting content
        if (editor.value) {
          editor.value.commands.setContent(data.content)
        }

        blogId.value = data._id || data.id
      }
    })
})

function addTag(e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    e.preventDefault();

    const value = e.target.value.trim();
    if (value && !form.tags.includes(value)) {
      form.tags?.push(value);
      e.target.value = '';
    }
  }
}

function addKeyword(e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    e.preventDefault();

    const value = e.target.value.trim();
    if (value && !form.seoMetaKeywords.includes(value)) {
      form.seoMetaKeywords?.push(value);
      e.target.value = '';
    }
  }
}

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
watch(() => form.title, (newTitle) => {
  if (!form.slugEdited) {
    form.slug = newTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove invalid chars
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
  }
})

// Mark slug as manually edited to stop auto generation
function onSlugInput(e) {
  form.slugEdited = true
  const value = e.target.value
  form.slug = makeSlug(value)
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

// Handle image input change and generate preview
function onMetaImageChange(event) {
  const file = event?.target?.files?.[0] || event?.[0]
  if (file && file instanceof File) {
    form.seoImage = file

    const reader = new FileReader()
    reader.onload = (e) => {
      form.metaImagePreview = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    form.seoImage = null
    form.metaImagePreview = null
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

  const payload = new FormData()
  const data = {
    title: form.title,
    slug: form.slug,
    category: form.category,
    tags: form.tags,
    featured: form.featured == 'on' ? true : false,
    isDraft: form.isDraft == 'on' ? true : false,
    estimatedReadingTime: form.estimatedReadingTime,
    content: form.content,
    seoMetaTitle: form.seoMetaTitle,
    seoMetaDescription: form.seoMetaDescription,
    seoMetaKeywords: form.seoMetaKeywords,
    seoMetaRobots: form.seoMetaRobots,
  }
  payload.append('data', JSON.stringify(data))
  payload.append('image', form.image)
  payload.append('seoImage', form.seoImage)

  try {
    const response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}admin/blog/${blogId.value}`, payload,
      { headers: { 'Content-Type': 'multipart/form-data' }, }
    )

    if (response.status === 200) {
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

<style>
.tiptap.ProseMirror {
  min-height: 160px;
}
</style>