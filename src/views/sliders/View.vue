<template>
  <h2 class="section-title">Sliders</h2>

  <div class="table-wrapper">
    <table class="sliders-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Type</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!blogs?.length">
          <td colspan="4" class="empty-row">No sliders found</td>
        </tr>
        <tr v-for="blog in blogs" :key="blog._id">
          <td>
            <div class="name-cell">
              <span>{{ blog.name || '-' }}</span>
              <span v-if="blog.active" class="active-badge">Active</span>
            </div>
          </td>
          <td>{{ blog.location || '-' }}</td>
          <td>{{ getTypeLabel(blog) }}</td>
          <td>
            <div class="action-icons">
              <v-icon
                class="cursor-pointer"
                :class="{
                  'text-green-600': blog.active,
                  'text-gray-400': !blog.active,
                  'opacity-50 pointer-events-none': !!activatingId
                }"
                :icon="blog.active ? 'mdi-check-circle' : 'mdi-check-circle-outline'"
                @click="setActive(blog)"
              />
              <v-icon
                class="cursor-pointer"
                icon="mdi-eye"
                @click="openPreview(blog)"
              />
              <router-link :to="`/sliders/${blog._id}/edit`">
                <v-icon class="cursor-pointer" icon="mdi-pencil-box" />
              </router-link>
              <v-icon
                class="cursor-pointer text-black"
                icon="mdi-delete"
                @click="openDeleteDialog(blog)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="pagination">
    <RouterLink :to="`?page=${currentPage - 1}`" v-if="currentPage > 1">Prev</RouterLink>
    <RouterLink
      :key="page"
      :to="`?page=${page}`"
      v-for="page in totalPages"
      :class="{ active: currentPage === page }"
    >
      {{ page }}
    </RouterLink>
    <RouterLink :to="`?page=${currentPage + 1}`" v-if="currentPage < totalPages">Next</RouterLink>
  </div>

  <v-dialog v-model="previewDialog" max-width="980" scrollable>
    <v-card>
      <v-card-title>Slider Details</v-card-title>
      <v-card-text v-if="selectedBlog" class="preview-body">
        <div class="preview-meta">
          <div class="preview-meta-item">
            <span class="preview-label">Name</span>
            <span>{{ selectedBlog.name || '-' }}</span>
          </div>
          <div class="preview-meta-item">
            <span class="preview-label">Location</span>
            <span>{{ selectedBlog.location || '-' }}</span>
          </div>
          <div class="preview-meta-item">
            <span class="preview-label">Type</span>
            <span>{{ getTypeLabel(selectedBlog) }}</span>
          </div>
          <div class="preview-meta-item">
            <span class="preview-label">Status</span>
            <span>{{ selectedBlog.active ? 'Active' : 'Inactive' }}</span>
          </div>
        </div>

        <div class="preview-slides">
          <h4 class="preview-heading">Slides ({{ selectedBlog.sliders?.length || 0 }})</h4>
          <div v-if="selectedBlog.sliders?.length" class="preview-slide-grid">
            <div v-for="(slide, index) in selectedBlog.sliders" :key="index" class="preview-slide-card">
              <div class="preview-slide-top">
                <p class="preview-slide-title">Slide {{ index + 1 }}: {{ slide.title || '-' }}</p>
                <span class="preview-type-pill">{{ toTitle(slide.sliderType || 'image') }}</span>
              </div>

              <p class="preview-url" v-if="slide.url">
                <a :href="slide.url" target="_blank" rel="noopener">Open Link</a>
              </p>

              <template v-if="slide.sliderType === 'video'">
                <div class="preview-video-grid">
                  <div>
                    <p class="preview-label">Video</p>
                    <video v-if="slide.video" controls class="preview-video">
                      <source :src="slide.video" />
                    </video>
                    <div v-else class="preview-empty-media">No video</div>
                  </div>
                  <div>
                    <p class="preview-label">Mobile Video</p>
                    <video v-if="slide.mobileVideo" controls class="preview-video">
                      <source :src="slide.mobileVideo" />
                    </video>
                    <div v-else class="preview-empty-media">No mobile video</div>
                  </div>
                </div>
              </template>

              <template v-else>
                <img v-if="slide.image" :src="slide.image" alt="Slider image" class="preview-image" />
                <div v-else class="preview-empty-media">No image</div>
              </template>
            </div>
          </div>
          <div v-else class="empty-row">No slides available</div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="previewDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteDialog" max-width="460">
    <v-card>
      <v-card-title>Delete Slider</v-card-title>
      <v-card-text>
        Are you sure you want to delete
        <strong>{{ deleteTarget?.name || 'this slider' }}</strong>?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="closeDeleteDialog()">Cancel</v-btn>
        <v-btn
          color="error"
          :loading="deletingId === deleteTarget?._id"
          @click="deleteBlog"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import axios from '@/plugins/axios'
import { RouterLink, useRoute } from 'vue-router'

const blogs = ref([])
const totalBlogs = ref(0)
const previewDialog = ref(false)
const selectedBlog = ref(null)
const activatingId = ref(null)
const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deletingId = ref(null)

const route = useRoute()
const itemsPerPage = 10
const currentPage = computed(() => {
  const page = Number.parseInt(route.query.page, 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
})
const totalPages = computed(() => Math.max(1, Math.ceil(totalBlogs.value / itemsPerPage)))

const getTypeLabel = (blog) => {
  const sliders = Array.isArray(blog?.sliders) ? blog.sliders : []
  const types = [...new Set(sliders.map((slide) => slide?.sliderType || 'image'))]
  if (!types.length) return '-'
  return types.map((type) => `${type.charAt(0).toUpperCase()}${type.slice(1)}`).join(', ')
}

const toTitle = (value) => {
  const text = String(value || '').trim()
  if (!text) return '-'
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}

const openPreview = (blog) => {
  selectedBlog.value = blog
  previewDialog.value = true
}

const openDeleteDialog = (blog) => {
  deleteTarget.value = blog
  deleteDialog.value = true
}

const closeDeleteDialog = (force = false) => {
  if (deletingId.value && !force) return
  deleteDialog.value = false
  deleteTarget.value = null
}

const toSliderPayload = (slide) => ({
  title: slide?.title || '',
  url: slide?.url || null,
  image: slide?.image || null,
  video: slide?.video || null,
  mobileVideo: slide?.mobileVideo || null,
  sliderType: slide?.sliderType || (slide?.video || slide?.mobileVideo ? 'video' : 'image')
})

const normalizeListResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length
    }
  }

  const items = data?.items || data?.results || []
  return {
    items: Array.isArray(items) ? items : [],
    total: Number(data?.total || items?.length || 0)
  }
}

const createSliderFormData = (blog, active) => {
  const payload = new FormData()
  payload.append(
    'data',
    JSON.stringify({
      name: blog?.name || '',
      location: blog?.location || '',
      active,
      sliders: Array.isArray(blog?.sliders) ? blog.sliders.map(toSliderPayload) : []
    })
  )
  return payload
}

const updateSliderActive = async (blog, active) => {
  const payload = createSliderFormData(blog, active)
  await axios.patch(`admin/ui-slider/${blog._id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const fetchAllSlidersForActivation = async () => {
  try {
    const response = await axios.get(`admin/ui-slider`, {
      params: {
        page: 1,
        perPage: Math.max(totalBlogs.value || 0, blogs.value.length, 1000)
      }
    })

    return normalizeListResponse(response.data).items
  } catch (error) {
    console.error('Error loading sliders for activation sync:', error)
    return blogs.value
  }
}

const setActive = async (blog) => {
  if (!blog?._id || activatingId.value) return

  try {
    activatingId.value = blog._id

    const allSliders = await fetchAllSlidersForActivation()
    const deactivateTargets = allSliders.filter(
      (item) => item?._id && item._id !== blog._id && item.active
    )

    await Promise.all([
      updateSliderActive(blog, true),
      ...deactivateTargets.map((item) => updateSliderActive(item, false))
    ])

    blogs.value = blogs.value.map((item) => ({
      ...item,
      active: item._id === blog._id
    }))
    fetchBlogs()
  } catch (error) {
    console.error('Error activating slider:', error)
  } finally {
    activatingId.value = null
  }
}

const deleteBlog = async () => {
  const id = deleteTarget.value?._id
  if (!id || deletingId.value) return

  try {
    deletingId.value = id
    await axios.delete(`admin/ui-slider/${id}`)
    blogs.value = blogs.value.filter((blog) => blog._id !== id)
    totalBlogs.value = Math.max(0, totalBlogs.value - 1)
    closeDeleteDialog(true)
    fetchBlogs()
  } catch (error) {
    console.error(error)
  } finally {
    deletingId.value = null
  }
}

async function fetchBlogs() {
  try {
    const response = await axios.get(`admin/ui-slider`, {
      params: {
        page: currentPage.value,
        perPage: itemsPerPage
      }
    })

    const normalized = normalizeListResponse(response.data)
    blogs.value = normalized.items
    totalBlogs.value = normalized.total
  } catch (error) {
    console.error('Error fetching sliders:', error)
  }
}

watchEffect(fetchBlogs)
</script>

<style scoped>
.section-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.table-wrapper {
  overflow-x: auto;
}

.sliders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.sliders-table th,
.sliders-table td {
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
  vertical-align: middle;
}

.sliders-table th {
  background: #f9fafb;
  font-weight: 600;
}

.empty-row {
  text-align: center;
  color: #6b7280;
}

.action-icons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.name-cell {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.active-badge {
  display: inline-block;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  border: 1px solid #86efac;
  background: #f0fdf4;
  color: #166534;
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1;
}

.pagination {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

.pagination a {
  padding: 0.2rem 0.55rem;
  font-size: 0.8rem;
  line-height: 1.1;
  border: 1px solid #ccc;
  background-color: #f7f7f7;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
}

.pagination a:hover {
  background-color: #e0e0e0;
}

.pagination a.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.preview-body {
  display: grid;
  gap: 1rem;
}

.preview-meta {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.preview-meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.6rem 0.7rem;
}

.preview-label {
  font-size: 0.72rem;
  color: #6b7280;
}

.preview-heading {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.preview-slide-grid {
  display: grid;
  gap: 0.8rem;
}

.preview-slide-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem;
  background: #fff;
}

.preview-slide-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.preview-slide-title {
  font-weight: 600;
  margin: 0;
}

.preview-type-pill {
  border: 1px solid #d1d5db;
  background: #f9fafb;
  padding: 0.12rem 0.42rem;
  border-radius: 999px;
  font-size: 0.7rem;
}

.preview-url {
  margin-bottom: 0.5rem;
}

.preview-video-grid {
  display: grid;
  gap: 0.7rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.preview-video {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 8px;
  background: #000;
}

.preview-image {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 8px;
}

.preview-empty-media {
  width: 100%;
  min-height: 120px;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.85rem;
  background: #f9fafb;
}

@media (min-width: 768px) {
  .preview-video-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
