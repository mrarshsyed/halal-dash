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
        <v-btn @click="showCreateDialog" block color="primary">
          + Add New {{ feature }}
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      density="compact"
      :items-per-page="table_data.itemsPerPage"
      :headers="table_data.headers"
      :items-length="table_data.totalItems"
      :items="table_data.serverItems"
      :search="table_data.search"
      :items-per-page-options="table_data.itemsPerPageOption"
      :page="table_data.page"
      show-current-page
    >
      <template #item.name="{ item }">
        {{ item?.name }}
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
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/app'
import axios from '@/plugins/axios'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const route = useRoute()

const form = ref({
  id: null,
  fields: [
    { key: 'name', type: 'text', label: 'Name', isRequired: true, value: null },
    {
      cols: 12,
      md: 12,
      key: 'description',
      type: 'html-editor',
      label: 'Description',
      isRequired: false,
      value: 'text'
    },
    {
      cols: 12,
      md: 12,
      key: 'image-list',
      type: 'image-list',
      value: [],
      multiple: true
    },
    {
      cols: 12,
      md: 12,
      key: 'uploads',
      type: 'images',
      label: 'Images',
      isRequired: false,
      value: [],
      multiple: true
    }
  ]
})

const resetForm = async () => {
  form.value.id = null
  form.value.fields = form.value.fields?.map((form) => {
    return {
      ...form,
      value: null
    }
  })
}

const store = useAppStore()

const feature = ref(null)

const apiUrl = computed(() => {
  const baseurl = 'admin/cruise/'
  let endpoint = null

  switch (feature.value) {
    case 'Destination':
      endpoint = 'destinations'
      break
    case 'Line':
      endpoint = 'ship-lines'
      break
    case 'Port':
      endpoint = 'ports'
      break
    case 'Room Group':
      endpoint = 'room-groups'
      break
    default:
      // Handle other cases if needed
      break
  }
  return endpoint !== null ? `${baseurl}${endpoint}` : null
})

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await axios
    .get(`${apiUrl.value}`, {
      page: page,
      itemsPerPage: itemsPerPage,
      sortBy: sortBy
    })
    .then((res) => {
      if (res?.data?.length) {
        table_data.value.serverItems = res?.data?.reverse()
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
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

const saveFormData = async () => {
  const payload = {
    name: store.getFieldValue('name'),
    description: store.getFieldValue('description'),
    images: store.getFieldValue('image-list'),
    uploads: store.getFieldValue('uploads')
  }
  let data = {
    name: payload.name,
    description: payload.description,
    images: payload.images
  }
  if (feature.value === 'Port') {
    data.notes = store.getFieldValue('note-list')
  }
  const uploads = []

  if (payload.uploads?.length) {
    payload.uploads.forEach((image) => {
      uploads.push(image)
    })
  }
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  if (uploads.length > 0) {
    uploads.forEach((image) => {
      formData.append('uploads', image)
    })
  }
  if (apiUrl.value) {
    const response = !form?.value?.id
      ? await axios.post(apiUrl.value, formData)
      : await axios.patch(`${apiUrl.value}/${form?.value?.id}`, formData)
    if (response?.status === 200) {
      store.showSnackbar(`${feature.value} saved successfully`)
      await loadItems({
        page: table_data.value.page,
        itemsPerPage: table_data.value.itemsPerPage,
        sortBy: 'ascending'
      })
      store.closeDialog()
      resetForm()
    }
  }
}

const showCreateDialog = () => {
  resetForm()
  let dialogModal = {
    title: `Add New ${feature.value}`,
    content: '',
    confirmText: 'Save',
    formComponents: { ...form.value },
    confirmFunction: saveFormData
  }
  if (feature.value === 'Port') {
    dialogModal.formComponents.fields.push({
      cols: 12,
      md: 12,
      key: 'note-list',
      type: 'note-list',
      value: []
    })
  }
  store.showDialog(dialogModal)
}

const onEdit = async (item) => {
  resetForm()
  store.setCruiseMasterData(item)
  form.value.id = item?._id
  form.value.fields[0].value = item?.name
  form.value.fields[1].value = item?.description
  form.value.fields[2].value = item?.images
  form.value.fields[3].value = []
  let dialogModal = {
    title: `Update ${feature.value}`,
    content: '',
    confirmText: 'Save',
    formComponents: { ...form.value },
    confirmFunction: saveFormData
  }
  if (feature.value === 'Port') {
    dialogModal.formComponents.fields[4] = {
      cols: 12,
      md: 12,
      key: 'note-list',
      type: 'note-list',
      value: item?.notes?.length ? item?.notes : [],
      update: item.notes
    }
  }
  store.showDialog(dialogModal)
}

const deleteRating = async () => {
  if (store.cruiseMasterData?._id) {
    await axios
      .delete(`${apiUrl.value}/${store.cruiseMasterData?._id}`)
      .then(async (res) => {
        if (res?.status === 204) {
          store.showSnackbar(`${feature.value} Deleted Successfully`)
          await loadItems({
            page: table_data.value.page,
            itemsPerPage: table_data.value.itemsPerPage,
            sortBy: 'ascending'
          })
          store.setCruiseMasterData({})
          store.closeDialog()
        }
      })
  }
}

const onDelete = async (item) => {
  store.setCruiseMasterData(item)
  const dialogModal = {
    title: `Delete ${feature.value}`,
    content: 'Are you sure to delete ?',
    confirmText: 'Delete',
    formComponents: {},
    confirmFunction: deleteRating
  }
  store.showDialog(dialogModal)
}

onMounted(async () => {
  feature.value = null
  if (route.name === 'cruise-destination') {
    feature.value = 'Destination'
  } else if (route.name === 'cruise-line') {
    feature.value = 'Line'
  } else if (route.name === 'cruise-port') {
    feature.value = 'Port'
  } else if (route.name === 'cruise-room-group') {
    feature.value = 'Room Group'
  }
  if (feature.value) {
    await loadItems({
      page: table_data.value.page,
      itemsPerPage: table_data.value.itemsPerPage,
      sortBy: 'ascending'
    })
  }
})
</script>

<style lang="scss" scoped></style>
