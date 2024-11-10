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
      <template #item.type="{ item }">
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
  <v-dialog v-model="isModalOpen" max-width="970" persistent scrollable>
    <v-card :title="Form?.id ? 'Update Action' : 'Add New'">
      <v-card-text>
        <v-form ref="form" class="d-flex flex-column ga-2">
          <v-autocomplete
            clearable
            label="Type"
            :items="insuranceTypeList"
            required
            :rules="[(v) => !!v || 'Type is required']"
            v-model="type"
            item-title="name"
            item-value="_id"
          />
          <v-text-field
            label="Name"
            v-model="name"
            :rules="[(v) => !!v || `Name is required`]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="pt-4 pr-4">
        <v-spacer />
        <v-btn
          color="error"
          variant="outlined"
          class="px-4"
          @click="closeModal"
        >
          Cancel
        </v-btn>
        <v-btn
          @click="saveRating"
          class="px-4"
          color="primary"
          variant="elevated"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import axios from '@/plugins/axios'

const baseUrl = 'admin/insurance/areas'
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
    {
      type: 'select',
      key: 'insurancePolicy',
      label: 'Policy Type',
      isRequired: true,
      value: null,
      itemTitle: 'name',
      options: [],
      itemValue: '_id'
    }
  ]
})

const isModalOpen = ref(false)
const form = ref()
const name = ref('')
const type = ref('')
const insuranceTypeList = ref([])

const showDialog = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
  form.value.reset()
  Form.value.id = null
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
    { title: 'Type', key: 'type', align: 'start' },
    { title: 'Action', key: 'action', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

const saveRating = async () => {
  form.value.validate()
  if (!form?.value?.isValid) return
  const payload = {
    name: name.value,
    insuranceType: type?.value
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
    closeModal()
  }
}

const onEdit = async (item) => {
  Form.value.id = item?._id
  name.value = item?.name

  type.value = item?.insuranceType?._id
  showDialog()
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
const getInsuranceTypeList = async () => {
  await axios.get('admin/insurance/types').then((res) => {
    insuranceTypeList.value = res.data
  })
}

onMounted(async () => {
  await loadItems({
    page: table_data.value.page,
    itemsPerPage: table_data.value.itemsPerPage,
    sortBy: 'ascending'
  })
  await getInsuranceTypeList()
})
</script>

<style lang="scss" scoped></style>
