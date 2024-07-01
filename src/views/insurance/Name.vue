<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="table_data.search"
          placeholder="Enter search here ..."
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-btn @click="showDialog" block color="primary"> + Add New </v-btn>
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
      <template #item.name="{ item }">
        {{ item?.name }}
      </template>
      <template #item.logo="{ item }">
        <v-img
          height="50"
          width="50"
          :src="item.logo"
          :alt="item?.insuranceType?.name"
        />
      </template>
      <template #item.action="{ item }">
        <div class="d-flex ga-3">
          <v-icon
            class="cursor-pointer"
            @click="onEdit(item)"
            icon="mdi-pencil-box"
          />
          <v-icon
            class="cursor-pointer"
            @click="onDelete(item)"
            icon="mdi-delete"
          />
        </div>
      </template>
    </v-data-table>
    <!-- @update:options="loadItems" -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import axios from '@/plugins/axios'

const baseUrl = 'admin/insurance/names'
const Form = ref({
  id: null,
  fields: [
    { type: 'text', key: 'name', label: 'Name', isRequired: true, value: null },
    {
      cols: 12,
      md: 12,
      key: 'image-list',
      type: 'image-list',
      value: [],
      multiple: false
    },
    {
      cols: 12,
      md: 12,
      key: 'uploads',
      type: 'images',
      label: 'Logo',
      isRequired: false,
      value: [],
      multiple: false
    }
  ]
})
const resetForm = async () => {
  Form.value.id = null
  Form.value.fields = Form.value.fields?.map((form) => {
    return {
      ...form,
      value: null
    }
  })
}
const store = useAppStore()
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await axios
    .get(baseUrl, {
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
    { title: 'Logo', key: 'logo', align: 'start' },
    { title: 'Action', key: 'action', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

const saveRating = async () => {
  const payload = {
    name: store.getFieldValue('name'),
    image: store.getFieldValue('image-list'),
    uploads: store.getFieldValue('uploads')
  }
  let data = {
    name: payload.name,
    insuranceType: payload.insuranceType
  }
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  if (payload.uploads?.[0]) {
    formData.append('logo', payload.uploads?.[0])
  }
  const response = !Form?.value?.id
    ? await axios.post(baseUrl, formData)
    : await axios.patch(`${baseUrl}/${Form?.value?.id}`, formData)
  if (response?.status === 200) {
    store.showSnackbar('Saved successfully')
    await loadItems({
      page: table_data.value.page,
      itemsPerPage: table_data.value.itemsPerPage,
      sortBy: 'ascending'
    })
    store.closeDialog()
    resetForm()
  }
}
const showDialog = () => {
  resetForm()

  const dialogModal = {
    title: 'Add New',
    content: '',
    confirmText: 'Save',
    formComponents: { ...Form.value },
    confirmFunction: saveRating
  }
  store.showDialog(dialogModal)
}
const onEdit = async (item) => {
  resetForm()
  store.setRatingDetails(item)
  Form.value.id = item?._id
  Form.value.fields[0].value = item?.name
  Form.value.fields[1].value = [item?.logo]

  const dialogModal = {
    title: 'Update',
    content: '',
    confirmText: 'Save',
    formComponents: Form.value,
    confirmFunction: saveRating
  }
  store.showDialog(dialogModal)
}
const deleteRating = async () => {
  if (store.rating_details?._id) {
    await axios
      .delete(`${baseUrl}/${store.rating_details?._id}`)
      .then(async (res) => {
        if (res?.status === 204) {
          store.showSnackbar('Deleted Successfully')
          await loadItems({
            page: table_data.value.page,
            itemsPerPage: table_data.value.itemsPerPage,
            sortBy: 'ascending'
          })
          store.setRatingDetails({})
          store.closeDialog()
        }
      })
  }
}
const onDelete = async (item) => {
  store.setRatingDetails(item)
  const dialogModal = {
    title: 'Delete Action',
    content: 'Are you sure to delete ?',
    confirmText: 'Delete',
    formComponents: {},
    confirmFunction: deleteRating
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
