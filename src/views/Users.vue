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
        <v-btn @click="showDialog" block color="primary">+ Add New User</v-btn>
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
    >
      <template v-slot:item.role="{ item }">
        <v-chip>
          <div style="min-width: 50px" class="text-center">
            {{ item?.role }}
          </div>
        </v-chip>
      </template>
      <template v-slot:item.isVerified="{ item }">
        <v-icon
          v-if="item?.isVerified"
          color="success"
          icon="mdi-check-circle"
        ></v-icon>
        <v-icon v-else color="error" icon="mdi-close-circle"></v-icon>
      </template>
    </v-data-table>
    <!-- @update:options="loadItems" -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import axiosInstance from '@/plugins/axios'

const userForm = ref({
  fields: [
    { type: 'email', label: 'Email Address', isRequired: true, value: null },
    {
      type: 'select',
      label: 'Role',
      isRequired: true,
      options: [
        { id: 'admin', title: 'Admin' },
        { id: 'employee', title: 'Employee' },
        { id: 'manager', title: 'Manager' }
      ],
      value: null
    }
  ]
})

const resetForm = async () => {
  userForm.value.fields = userForm.value.fields?.map((form) => {
    return {
      ...form,
      value: null
    }
  })
}

const store = useAppStore()

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await axiosInstance
    .get('admin/users', {
      page: page,
      itemsPerPage: itemsPerPage,
      sortBy: sortBy
    })
    .then((res) => {
      if (res?.data?.length) {
        // store.setUserList(res?.data?.data)
        table_data.value.serverItems = res?.data
        table_data.value.totalItems = res?.data?.length
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
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Email', key: 'email', align: 'start' },
    { title: 'Role', key: 'role', align: 'center' },
    { title: 'Is Verified', key: 'isVerified', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

const sendVerificationEmail = async () => {
  const payload = {
    email: store.dialog.formComponents?.fields[0]?.value,
    role: store.dialog.formComponents?.fields[1]?.value
  }
  await axiosInstance.post('/admin/users', payload).then(async (res) => {
    if (res?.status === 200) {
      store.showSnackbar('Invitation Link sent Successfully')
      await loadItems({
        page: table_data.value.page,
        itemsPerPage: table_data.value.itemsPerPage,
        sortBy: 'ascending'
      })
      store.closeDialog()
      resetForm()
    }
  })
}

const showDialog = () => {
  const dialogModal = {
    title: 'Add new user with role',
    content: '',
    confirmText: 'Send Email Verification Link',
    formComponents: { ...userForm.value },
    confirmFunction: sendVerificationEmail
  }
  store.showDialog(dialogModal)
}

onMounted(async () => {
  await loadItems({
    page: table_data.value.page,
    itemsPerPage: table_data.value.itemsPerPage,
    sortBy: 'ascending'
  })
})
</script>

<style lang="scss" scoped></style>
