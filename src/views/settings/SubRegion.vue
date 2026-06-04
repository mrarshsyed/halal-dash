<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <v-text-field v-model="table_data.search" placeholder="Enter search here ..." />
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
      item-value="_id"
      :items-per-page-options="table_data.itemsPerPageOption"
      :page="table_data.page"
    >
      <template #item.name="{ item }">
        {{ item?.name }}
      </template>
      <template #item.holidayIndex="{ item }">
        <v-chip v-if="item?.holidayIndex > 0" size="x-small">{{ item?.holidayIndex }}</v-chip>
        <span v-else>-</span>
      </template>
      <template #item.image="{ item }">
        <v-img v-if="item?.image" :src="item?.image" height="30" width="30" cover class="icon-preview" />
      </template>
      <template #item.action="{ item }">
        <div class="d-flex ga-3">
          <v-icon class="cursor-pointer" @click="onEdit(item)" icon="mdi-pencil-box" />
          <v-icon class="cursor-pointer" @click="onDelete(item)" icon="mdi-delete" />
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import axios from '@/plugins/axios'

const baseUrl = 'admin/misc/country-sub-regions'
const regionsUrl = 'admin/misc/country-regions'

const regions = ref([])

const Form = ref({
  id: null,
  fields: [
    { type: 'text', key: 'name', label: 'Name', isRequired: true, value: null },
    { type: 'text', key: 'holidayIndex', label: 'Holiday Index', isRequired: false, value: null, inputType: 'number' },
    {
      type: 'select',
      key: 'region',
      label: 'Region',
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
    return { ...form, value: form.type === 'image-list' ? [] : null }
  })
}

const store = useAppStore()

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 10,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Holiday Index', key: 'holidayIndex', align: 'start' },
    { title: 'Image', key: 'image', align: 'start' },
    { title: 'Action', key: 'action', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

const loadItems = async () => {
  await axios.get(baseUrl).then((res) => {
    if (res?.data?.length) {
      table_data.value.serverItems = res?.data
      table_data.value.totalItems = res?.data?.length
    }
  })
}

const loadRegions = async () => {
  await axios.get(regionsUrl).then((res) => {
    if (res?.data?.length) {
      regions.value = res?.data
      const regionField = Form.value.fields.find((f) => f.key === 'region')
      if (regionField) regionField.options = res?.data
    }
  })
}

const save = async () => {
  const uploads = store.getFieldValue('uploads')

  const formData = new FormData()
  formData.append(
    'data',
    JSON.stringify({
      name: store.getFieldValue('name'),
      holidayIndex: Number(store.getFieldValue('holidayIndex')) || 0,
      region: store.getFieldValue('region')
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
    await loadItems()
    store.closeDialog()
    resetForm()
  }
}

const showDialog = () => {
  resetForm()
  const regionField = Form.value.fields.find((f) => f.key === 'region')
  if (regionField) regionField.options = regions.value
  store.showDialog({
    title: 'Add New Sub Region',
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
  Form.value.fields[1].value = item?.holidayIndex ?? 0
  Form.value.fields[2].value = item?.region?._id ?? item?.region
  Form.value.fields[2].options = regions.value
  Form.value.fields[3].value = item?.image ? [item?.image] : []
  store.showDialog({
    title: 'Update Sub Region',
    content: '',
    confirmText: 'Save',
    formComponents: Form.value,
    confirmFunction: save
  })
}

const deleteSubRegion = async () => {
  if (store.rating_details?._id) {
    await axios.delete(`${baseUrl}/${store.rating_details?._id}`).then(async (res) => {
      if (res?.status === 204) {
        store.showSnackbar('Deleted successfully')
        await loadItems()
        store.setRatingDetails({})
        store.closeDialog()
      }
    })
  }
}

const onDelete = (item) => {
  store.setRatingDetails(item)
  store.showDialog({
    title: 'Delete Sub Region',
    content: 'Are you sure you want to delete this sub region?',
    confirmText: 'Delete',
    formComponents: {},
    confirmFunction: deleteSubRegion
  })
}

onMounted(async () => {
  await Promise.all([loadRegions(), loadItems()])
})
</script>

<style scoped></style>
