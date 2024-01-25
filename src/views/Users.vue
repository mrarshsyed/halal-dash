<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <v-text-field placeholder="Enter search here ..."></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn block color="primary">+ Add New User</v-btn>
      </v-col>
    </v-row>
    <v-data-table-server
      v-model:items-per-page="table_data.itemsPerPage"
      :headers="table_data.headers"
      :items-length="table_data.totalItems"
      :items="table_data.serverItems"
      :search="table_data.search"
      item-value="name"
      @update:options="loadItems"
    ></v-data-table-server>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import { onMounted, computed, ref } from 'vue'
import axiosInstance from '@/plugins/axios'

const store = useAppStore()
const FakeAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage
        const items = desserts.slice()

        if (sortBy.length) {
          const sortKey = sortBy[0].key
          const sortOrder = sortBy[0].order
          items.sort((a, b) => {
            const aValue = a[sortKey]
            const bValue = b[sortKey]
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          })
        }

        const paginated = items.slice(start, end)

        resolve({ items: paginated, total: items.length })
      }, 500)
    })
  }
}

const getUsersList = async ({ page, itemsPerPage, sortBy }) => {
  let list = []
  await axiosInstance.get('/auth/users').then((res) => {
    if (res?.data?.data?.length) {
      store.setUserList(res?.data?.data)
      list = res?.data?.data
    }
  })
  return list
}

const table_data = ref({
  itemsPerPage: 5,
  headers: [
    { title: 'Email', key: 'email', align: 'start' },
    { title: 'Role', key: 'role', align: 'start' }
  ],
  search: '',
  serverItems: [],
  loading: true,
  totalItems: 0
})

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await getUsersList({ page, itemsPerPage, sortBy }).then((res) => {
    table_data.value.serverItems = res
    table_data.value.totalItems = res.length
  })
}
</script>

<style lang="scss" scoped></style>
