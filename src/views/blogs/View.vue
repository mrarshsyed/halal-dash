<template>
  <h2 class="section-title">Blogs</h2>
  <div class="blogs">
    <div v-for="blog in blogs" :key="blog.slug" class="blog-card flex flex-col">
      <a :href="`${VITE_URL}/blogs/${blog.slug}`" target="_blank" rel="noopener noreferrer">
        <img :src="blog.image" alt="Blog Image" class="blog-image" />
      </a>
      <a :href="`${VITE_URL}/blogs/${blog.slug}`" target="_blank" rel="noopener noreferrer"
        class="blog-title px-4 mt-2">{{ blog.title }}</a>
      <div class="grow px-4">
        <p class="blog-text line-clamp-2" v-html="blog.content"></p>
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
    <a :href="`?page=${1}`" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Prev</a>

    <a :key="page" :href="`?page=${page}`" v-for="page in totalPages" @click="goToPage(page)"
      :class="{ active: currentPage === page }">{{ page }}</a>

    <a :href="`?page=${1}`" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</a>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { watchEffect } from 'vue'
import axios from '@/plugins/axios'

const VITE_URL = import.meta.env.VITE_URL
const API_URL = process.env.VUE_APP_API_BASE_URL
// Simulate a larger list of blogs (add more if needed)
const blogs = ref(null)

const deleteBlog = (id) => {
  axios.delete(`${API_URL}admin/blog/${id}`).then(res => {
    if (res.ok) {
      blogs.value = blogs.value.filter(blog => blog._id !== id)
    }
  })
}

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(blogs.value.length / itemsPerPage))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watchEffect(() => {
  axios.get(`/user/blog`).then(res => {
    res = res.data; // for axios
    if (res) {
      const { data, firstPage, from, hasNextPage, lastPage, perPage, to, total } = res;
      blogs.value = data
    }
  })
})
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
