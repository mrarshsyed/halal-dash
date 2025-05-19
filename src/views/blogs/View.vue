<template>
  <div class="blog-container">
    <h2 class="section-title">Blogs</h2>

    <div class="blogs">
      <div v-for="blog in blogs" :key="blog.slug" class="blog-card">
        <a :href="`${VITE_URL}/blogs/${blog.slug}`" target="_blank" rel="noopener noreferrer">
          <img :src="blog.image" alt="Blog Image" class="blog-image" />
        </a>
        <div class="blog-content">
          <h3 class="blog-title">{{ blog.title }}</h3>
          <div class="blog-text" v-html="blog.content"></div>
          <div class="blog-actions">
            <a :href="`edit?id=${blog.id}`" class="edit-button" @click="editBlog(blog.slug)">Edit</a>
            <button class="delete-button" @click="deleteBlog(blog.slug)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination">
      <a :href="`?page=${1}`" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Prev</a>

      <a :href="`?page=${page}`" v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ active: currentPage === page }">
        {{ page }}
      </a>

      <a :href="`?page=${1}`" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const VITE_URL = import.meta.env.VITE_URL
// Simulate a larger list of blogs (add more if needed)
const blogs = ref([
  { id: 1, title: 'Blog 1', slug: 'blog-1', content: '<p>Content 1</p>', image: 'https://picsum.photos/600/400?1' },
  { id: 2, title: 'Blog 2', slug: 'blog-2', content: '<p>Content 2</p>', image: 'https://picsum.photos/600/400?2' },
  { id: 3, title: 'Blog 3', slug: 'blog-3', content: '<p>Content 3</p>', image: 'https://picsum.photos/600/400?3' },
  { id: 4, title: 'Blog 4', slug: 'blog-4', content: '<p>Content 4</p>', image: 'https://picsum.photos/600/400?4' },
  { id: 5, title: 'Blog 5', slug: 'blog-5', content: '<p>Content 5</p>', image: 'https://picsum.photos/600/400?5' },
  { id: 6, title: 'Blog 6', slug: 'blog-6', content: '<p>Content 6</p>', image: 'https://picsum.photos/600/400?6' },
  { id: 7, title: 'Blog 7', slug: 'blog-7', content: '<p>Content 7</p>', image: 'https://picsum.photos/600/400?7' },
  { id: 8, title: 'Blog 8', slug: 'blog-8', content: '<p>Content 8</p>', image: 'https://picsum.photos/600/400?8' },
  { id: 9, title: 'Blog 9', slug: 'blog-9', content: '<p>Content 9</p>', image: 'https://picsum.photos/600/400?9' },
  { id: 10, title: 'Blog 10', slug: 'blog-10', content: '<p>Content 10</p>', image: 'https://picsum.photos/600/400?10' },
  { id: 11, title: 'Blog 11', slug: 'blog-11', content: '<p>Content 11</p>', image: 'https://picsum.photos/600/400?11' },
  { id: 12, title: 'Blog 12', slug: 'blog-12', content: '<p>Content 12</p>', image: 'https://picsum.photos/600/400?12' },
])

const editBlog = (slug) => {
  console.log(`Edit blog with slug: ${slug}`)
  // navigate to edit form or open a modal
}

const deleteBlog = (slug) => {
  console.log(`Delete blog with slug: ${slug}`)
  // perform delete logic or call API
}

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(blogs.value.length / itemsPerPage))

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return blogs.value.slice(start, start + itemsPerPage)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
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
  height: auto;
  display: block;
  object-fit: cover;
}

.blog-content {
  padding: 1rem 1.5rem;
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

.edit-button,
.delete-button {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Modern Edit Button */
.edit-button {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.edit-button:hover {
  background: linear-gradient(135deg, #3c8ce7 0%, #00eaff 100%);
  transform: translateY(-1px);
}

/* Modern Delete Button */
.delete-button {
  background: linear-gradient(135deg, #ff6a6a 0%, #ff3c3c 100%);
  color: #fff;
}

.delete-button:hover {
  background: linear-gradient(135deg, #ff4e4e 0%, #ff1c1c 100%);
  transform: translateY(-1px);
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
