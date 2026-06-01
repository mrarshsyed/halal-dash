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
      <template #item.icon="{ item }">
        {{ item?.icon }}
      </template>
      <template #item.type="{ item }">
        {{ item?.type?.name ?? item?.type }}
      </template>
      <template #item.image="{ item }">
        <v-img :src="item?.image" height="30" width="30" cover class="icon-preview" />
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import axios from '@/plugins/axios'

const baseUrl = 'admin/holiday/offers'
const typesUrl = 'admin/holiday/types'

const types = ref([])

const Form = ref({
  id: null,
  fields: [
    { type: 'text', key: 'name', label: 'Name', isRequired: true, value: null },
    { type: 'text', key: 'icon', label: 'Icon', isRequired: false, value: null },
    {
      type: 'select',
      key: 'type',
      label: 'Type',
      isRequired: true,
      value: null,
      options: [],
      itemTitle: 'name',
      itemValue: '_id',
      multiple: false
    },
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
      label: 'Image',
      isRequired: false,
      value: [],
      multiple: false
    }
  ]
})

const resetForm = () => {
  Form.value.id = null
  Form.value.fields = Form.value.fields?.map((form) => {
    return { ...form, value: form.key === 'type' ? null : form.type === 'image-list' ? [] : null }
  })
}

const store = useAppStore()

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await axios
    .get(baseUrl, { page, itemsPerPage, sortBy })
    .then((res) => {
      if (res?.data?.length) {
        table_data.value.serverItems = res?.data
        table_data.value.totalItems = res?.data?.length
      }
    })
}

const loadTypes = async () => {
  await axios.get(typesUrl).then((res) => {
    if (res?.data?.length) {
      types.value = res?.data
      const typeField = Form.value.fields.find((f) => f.key === 'type')
      if (typeField) typeField.options = res?.data
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
    { title: 'Icon', key: 'icon', align: 'start' },
    { title: 'Type', key: 'type', align: 'start' },
    { title: 'Image', key: 'image', align: 'start' },
    { title: 'Action', key: 'action', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

const save = async () => {
  const uploads = store.getFieldValue('uploads')

  const formData = new FormData()
  formData.append(
    'data',
    JSON.stringify({
      name: store.getFieldValue('name'),
      icon: store.getFieldValue('icon'),
      type: store.getFieldValue('type')
    })
  )
  if (uploads?.[0]) {
    formData.append('image', uploads[0])
  }

  const response = !Form.value.id
    ? await axios.post(baseUrl, formData)
    : await axios.patch(`${baseUrl}/${Form.value.id}`, formData)

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
  const typeField = Form.value.fields.find((f) => f.key === 'type')
  if (typeField) typeField.options = types.value
  store.showDialog({
    title: 'Add New Offer',
    content: '',
    confirmText: 'Save',
    formComponents: { ...Form.value },
    confirmFunction: save
  })
}

const onEdit = (item) => {
  resetForm()
  store.setRatingDetails(item)
  Form.value.id = item?._id
  Form.value.fields[0].value = item?.name
  Form.value.fields[1].value = item?.icon
  Form.value.fields[2].value = item?.type?._id ?? item?.type
  Form.value.fields[2].options = types.value
  Form.value.fields[3].value = item?.image ? [item?.image] : []
  store.showDialog({
    title: 'Update Offer',
    content: '',
    confirmText: 'Save',
    formComponents: Form.value,
    confirmFunction: save
  })
}

const deleteOffer = async () => {
  if (store.rating_details?._id) {
    await axios
      .delete(`${baseUrl}/${store.rating_details?._id}`)
      .then(async (res) => {
        if (res?.status === 204) {
          store.showSnackbar('Deleted successfully')
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

const onDelete = (item) => {
  store.setRatingDetails(item)
  store.showDialog({
    title: 'Delete Offer',
    content: 'Are you sure you want to delete this offer?',
    confirmText: 'Delete',
    formComponents: {},
    confirmFunction: deleteOffer
  })
}

onMounted(async () => {
  await Promise.all([
    loadTypes(),
    loadItems({
      page: table_data.value.page,
      itemsPerPage: table_data.value.itemsPerPage,
      sortBy: 'ascending'
    })
  ])
})
</script>

<style scoped></style>
