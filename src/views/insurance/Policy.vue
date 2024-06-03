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
      <template #item.insurance_name="{ item }">
        {{ item?.insuranceName?.name }}
      </template>
      <template #item.insurance_type="{ item }">
        {{ item?.insuranceType?.name }}
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

const baseUrl = 'admin/insurance/policies'
const Form = ref({
  id: null,
  fields: [
    { type: 'text', key: 'name', label: 'Name', isRequired: true, value: null },
    {
      type: 'select',
      key: 'insuranceName',
      label: 'Insurance Name',
      isRequired: true,
      value: null,
      itemTitle: 'name',
      options: [],
      itemValue: '_id'
    },
    {
      type: 'select',
      key: 'insuranceType',
      label: 'Type',
      isRequired: true,
      value: null,
      itemTitle: 'name',
      options: [],
      itemValue: '_id'
    },
    
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
    { title: 'Insurance Name', key: 'insurance_name', align: 'start' },
    { title: 'Insurance Type', key: 'insurance_type', align: 'start' },
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
    insuranceName: store.getFieldValue('insuranceName'),
    insuranceType: store.getFieldValue('insuranceType'),
  }
  
  const response = !Form?.value?.id
    ? await axios.post(baseUrl, payload)
    : await axios.patch(`${baseUrl}/${Form?.value?.id}`, payload)
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
  getTypeList()
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
  getTypeList()
  Form.value.id = item?._id
  Form.value.fields[0].value = item?.name
  Form.value.fields[1].value = item?.insuranceName?._id
  Form.value.fields[2].value = item?.insuranceType?._id

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

const getTypeList = async () => {
    await axios.get('admin/insurance/names').then((res) => {
    Form.value.fields[1].options = res?.data
  })
    await axios.get('admin/insurance/types').then((res) => {
    Form.value.fields[2].options = res?.data
  })
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
