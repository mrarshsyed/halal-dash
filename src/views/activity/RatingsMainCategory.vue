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
        <v-btn @click="showDialog" block color="primary">
          + Add New Category
        </v-btn>
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
      <template #item.allow_category="{ item }">
        {{ item?.allow_category ? 'Yes' : 'No' }}
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

const baseUrl = 'admin/activity-halal-rating-main-categories'
const store = useAppStore()
const Form = ref({
  id: null,
  fields: [
    { key: 'name', type: 'text', label: 'Name', isRequired: true, value: null },
    {
      key: 'allow_category',
      type: 'select',
      label: 'Can have subcategories',
      isRequired: false,
      options: [
        { id: true, title: 'Yes' },
        { id: false, title: 'No' }
      ],
      value: null,
      itemTitle: 'title',
      itemValue: 'id',
      multiple: false
    }
  ]
})

const resetForm = () => {
  Form.value.id = null
  Form.value.fields = Form.value.fields.map((f) => ({ ...f, value: null }))
}
const loadItems = async () => {
  await axios.get(baseUrl).then((res) => {
    table_data.value.serverItems = res?.data ?? []
    table_data.value.totalItems = res?.data?.length ?? 0
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
    { title: 'Can have subcategories', key: 'allow_category', align: 'start' },
    { title: 'Action', key: 'action', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})
const saveItem = async () => {
  const payload = {
    name: store.getFieldValue('name'),
    allow_category: store.getFieldValue('allow_category') === true
  }
  try {
    const response = !Form.value.id
      ? await axios.post(baseUrl, payload)
      : await axios.patch(`${baseUrl}/${Form.value.id}`, payload)
    if (response?.status === 200 || response?.status === 201) {
      store.showSnackbar('Category saved successfully')
      await loadItems()
      store.closeDialog()
      resetForm()
    }
  } catch (e) {
    // the axios interceptor already shows the API message; keep the form open
  }
}
const showDialog = () => {
  resetForm()
  store.showDialog({
    title: 'Add New Category',
    content: '',
    confirmText: 'Save',
    formComponents: { ...Form.value },
    confirmFunction: saveItem
  })
}
const onEdit = (item) => {
  resetForm()
  store.setRatingDetails(item)
  Form.value.id = item?._id
  Form.value.fields[0].value = item?.name
  Form.value.fields[1].value = !!item?.allow_category
  store.showDialog({
    title: 'Update Category',
    content: '',
    confirmText: 'Save',
    formComponents: Form.value,
    confirmFunction: saveItem
  })
}
const deleteItem = async () => {
  if (!store.rating_details?._id) return
  try {
    const res = await axios.delete(`${baseUrl}/${store.rating_details._id}`)
    if (res?.status === 204) {
      store.showSnackbar('Category deleted successfully')
      await loadItems()
      store.setRatingDetails({})
      store.closeDialog()
    }
  } catch (e) {
    // error snackbar shown by interceptor; keep the row
  }
}
const onDelete = (item) => {
  store.setRatingDetails(item)
  store.showDialog({
    title: 'Delete Category',
    content: 'Are you sure to delete?',
    confirmText: 'Delete',
    formComponents: {},
    confirmFunction: deleteItem
  })
}
onMounted(loadItems)
</script>
