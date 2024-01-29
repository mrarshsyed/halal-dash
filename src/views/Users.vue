<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="table_data.search"
          placeholder="Enter search here ..."
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn block color="primary">+ Add New User</v-btn>
      </v-col>
    </v-row>
    <v-data-table
      density="compact"
      v-model:items-per-page="table_data.itemsPerPage"
      :headers="table_data.headers"
      :items-length="table_data.totalItems"
      :items="table_data.serverItems"
      :search="table_data.search"
      item-value="name"
      :items-per-page-options="table_data.itemsPerPageOption"
      :page="table_data.page"
    ></v-data-table>
    <!-- @update:options="loadItems" -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import axiosInstance from '@/plugins/axios'

const store = useAppStore()

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await axiosInstance
    .get('/auth/users', {
      page: page,
      itemsPerPage: itemsPerPage,
      sortBy: sortBy
    })
    .then((res) => {
      if (res?.data?.data?.length) {
        // store.setUserList(res?.data?.data)
        table_data.value.serverItems = res?.data?.data
        table_data.value.totalItems = res?.data?.data.length
      }
    })
}

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 10,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Email', key: 'email', align: 'start' },
    { title: 'Role', key: 'role', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})
onMounted(async () => {
  await loadItems({
    page: table_data.value.page,
    itemsPerPage: table_data.value.itemsPerPage,
    sortBy: 'ascending'
  })
})
</script>

<style lang="scss" scoped></style>
