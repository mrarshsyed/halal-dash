<template>
  <h2 class="section-title">Sliders</h2>

  <div class="blogs">
    <div v-for="blog in blogs" :key="blog._id" class="blog-card flex flex-col relative">
      <div v-if="blog.active" class="absolute right-0 top-0 bg-primary text-white py-0.5 px-2 rounded-bl-xl">Active
      </div>
      <div class="px-4 mt-2">
        <h3 class="text-xl font-semibold">{{ blog.name }}</h3>
        <p class="text-gray-600 text-sm"><strong>Location:</strong> {{ blog.location }}</p>
        <p class="text-gray-600 text-sm"><strong>Created:</strong> {{ new Date(blog.createdAt).toLocaleString() }}</p>
        <p class="text-gray-600 text-sm"><strong>Updated:</strong> {{ new Date(blog.updatedAt).toLocaleString() }}</p>
      </div>

      <div v-if="blog.sliders?.length" class="px-4 mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div v-for="(slide, i) in blog.sliders" :key="i" class="border rounded-xl overflow-hidden">
          <img :src="slide.image" alt="Slider Image" class="w-full aspect-video object-cover" />
          <div class="p-2">
            <a :href="slide.url" target="_blank" rel="noopener" class="text-blue-600 hover:underline">{{ slide.title
            }}</a>
          </div>
        </div>
      </div>

      <div class="blog-actions px-4 mt-4 mb-4">
        <router-link :to="`${blog._id}/edit`">
          <v-btn color="primary">Edit</v-btn>
        </router-link>
        <v-btn @click="deleteBlog(blog._id)" color="error">Delete</v-btn>
      </div>
    </div>
  </div>

  <!-- Pagination Controls -->
  <div class="pagination">
    <RouterLink :to="`?page=${currentPage - 1}`" v-if="currentPage > 1">Prev</RouterLink>

    <RouterLink :key="page" :to="`?page=${page}`" v-for="page in totalPages" @click="goToPage(page)"
      :class="{ active: currentPage === page }">{{ page }}</RouterLink>

    <RouterLink :to="`?page=${currentPage + 1}`" v-if="currentPage < totalPages">Next</RouterLink>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { watchEffect } from 'vue'
import axios from '@/plugins/axios'
import { RouterLink, useRoute } from 'vue-router'

const API_URL = process.env.VUE_APP_API_BASE_URL
// Simulate a larger list of blogs (add more if needed)
const blogs = ref(null)
const totalBlogs = ref(null)

const deleteBlog = async (id) => {
  try {
    await axios.delete(`${API_URL}admin/ui-slider/${id}`).then(res => {
      if (res.ok) {
        blogs.value = blogs.value.filter(blog => blog._id !== id)
      }
    })
    fetchBlogs()
  } catch (error) {
    console.error(error);
  }
}

const route = useRoute()
const itemsPerPage = 10
const currentPage = route.query.page ? parseInt(route.query.page) : 1
const totalPages = computed(() => Math.ceil(totalBlogs.value / itemsPerPage))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    route.query.page = page
  }
}

async function fetchBlogs() {
  try {
    const response = await axios.get(`admin/ui-slider`, {
      params: {
        page: currentPage,
        perPage: itemsPerPage,
      },
    });

    const data = response.data;
    if (data) {
      blogs.value = data;
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    // Optionally: show a toast or error UI
  }
}
watchEffect(fetchBlogs)
watch(() => route.query.page, fetchBlogs)
</script>

<style scoped>
.blog-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.blogs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.blog-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  background-color: #fff;
  transition: transform 0.2s;
}

.blog-card:hover {
  transform: translateY(-5px);
}

.blog-image {
  width: 100%;
  aspect-ratio: 16/9;
  height: auto;
  display: block;
  object-fit: cover;
}

.blog-content {
  padding: 1rem;
}

.blog-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #222;
}

.blog-text p {
  line-height: 1.6;
  color: #555;
}

/* Responsive Design */
@media (min-width: 768px) {
  .blogs {
    grid-template-columns: repeat(2, 1fr);
  }
}

.blog-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.pagination a {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background-color: #f7f7f7;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
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
</style>
