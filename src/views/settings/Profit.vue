<template>
  <div>
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
      <template #item.rating="{ item }">
        {{ item?.rating }}
      </template>
      <template #item.action="{ item }">
        <div class="d-flex ga-3">
          <v-icon
            class="cursor-pointer"
            @click="onEdit(item)"
            icon="mdi-pencil-box"
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
import axiosInstance from '@/plugins/axios'
import axios from '@/plugins/axios'

const store = useAppStore()
const moduleName = ref(null)

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 10,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Name', key: 'moduleName', align: 'start' },
    { title: 'Type', key: 'type', align: 'start' },
    { title: 'Value', key: 'value', align: 'start' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ],
  serverObjects: {}
})
const form = ref({
  id: null,
  fields: [
    {
      type: 'number',
      label: 'New Value',
      isRequired: true,
      value: null
    },
    {
      type: 'select',
      label: 'Type',
      isRequired: true,
      options: [
        { id: 'fixed', title: 'Fixed' },
        { id: 'percentage', title: 'Percentage' }
      ],
      value: null
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
const convertToModuleArray = (input) => {
  const outputArray = []

  for (const [moduleName, moduleData] of Object.entries(input)) {
    for (const [type, { type: valueType, value }] of Object.entries(
      moduleData
    )) {
      outputArray.push({ moduleName, type: valueType, value })
    }
  }

  return outputArray
}
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await axiosInstance
    .get('/admin/settings/profit-percentage', {
      page: page,
      itemsPerPage: itemsPerPage,
      sortBy: sortBy
    })
    .then((res) => {
      if (res?.data?.data) {
        table_data.value.serverObjects = res.data?.data
        table_data.value.serverItems = convertToModuleArray(res?.data?.data)
        console.log(table_data.value.serverItems)
      }
    })
}
const updateProfit = async () => {
  let payload = {
    data: table_data.value.serverObjects,
    key: 'profit-percentage'
  }
  payload.data[moduleName.value.moduleName].bookingProfit.value =
    store.dialog.formComponents?.fields[0]?.value
  payload.data[moduleName.value.moduleName].bookingProfit.type =
    store.dialog.formComponents?.fields[1]?.value

  const response = await axios.patch(
    `admin/settings/profit-percentage`,
    payload
  )
  if (response?.status === 200) {
    store.showSnackbar('New Value successfully')
    await loadItems({
      page: table_data.value.page,
      itemsPerPage: table_data.value.itemsPerPage,
      sortBy: 'ascending'
    })
    store.closeDialog()
    resetForm()
  }
}
const onEdit = async (item) => {
  resetForm()
  moduleName.value = item
  form.value.fields[0].value = item?.value
  form.value.fields[1].value = item?.type
  const dialogModal = {
    title: 'Update Value',
    content: '',
    confirmText: 'Save',
    formComponents: form.value,
    confirmFunction: updateProfit
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
