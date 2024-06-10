<template>
  <div>
    <v-row class="mb-4">
      <v-col
        cols="12"
        md="8"
      >
        <v-text-field
          v-model="table_data.search"
          placeholder="Enter search here ..."
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-btn
          @click="showDialog"
          block
          color="primary"
        >
          + Add New
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
      <template #item.name="{ item }">
        {{ item?.name }}
      </template>
      <template #item.insurance_name="{ item }">
        {{ item?.insuranceName?.name }}
      </template>
      <template #item.insurance_type="{ item }">
        {{ item?.insuranceType?.name }}
      </template>
      <template #item.policy_type="{ item }">
        {{ item?.insurancePolicy?.name }}
      </template>
      <template #item.area="{ item }">
        {{ item?.insuranceArea?.name }}
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
  <v-dialog
    v-model="isModalOpen"
    max-width="970"
    persistent
    scrollable
  >
    <v-card :title="Form?.id ? 'Update Action' : 'Add New'">
      <v-card-text>
        <v-form
          ref="form"
          class="d-flex flex-column ga-2"
        >
          <v-text-field
            label="Name"
            v-model="name"
            :rules="[(v) => !!v || `Name is required`]"
          />
          <v-autocomplete
            label="Select Type"
            :items="typeList"
            item-title="name"
            item-value="_id"
            v-model="insuranceType"
            required
            :rules="[(v) => !!v || `Type is required`]"
            @update:model-value="onTypeSelect"
          />
          <v-autocomplete
            label="Select Name"
            :items="nameList"
            item-title="name"
            item-value="_id"
            v-model="insuranceName"
            required
            :rules="[(v) => !!v || `Name is required`]"
            :disabled="!insuranceType"
            @update:model-value="onNameSelect"
          />
          <v-autocomplete
            label="Select Policy Type"
            :items="policyTypeList"
            item-title="name"
            item-value="_id"
            v-model="insurancePolicy"
            required
            :rules="[(v) => !!v || `Policy Type is required`]"
            :disabled="!insuranceName"
            @update:model-value="onPolicySelect"
          />

          <v-autocomplete
            label="Select Area"
            :items="areaList"
            item-title="name"
            item-value="_id"
            v-model="insuranceArea"
            required
            :rules="[(v) => !!v || `Area is required`]"
            :disabled="!insurancePolicy"
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

const store = useAppStore()
const baseUrl = 'admin/insurance/rest-types'
const Form = ref({
  id: null,
  fields: [
    { type: 'text', key: 'name', label: 'Name', isRequired: true, value: null }
  ]
})

const isModalOpen = ref(false)
const form = ref()

const name = ref('')
const insuranceType = ref(null)
const insuranceName = ref(null)
const insurancePolicy = ref(null)
const insuranceArea = ref(null)

const typeList = ref([])
const masterNameList = ref()
const nameList = ref([])
const masterPolicyTypeList = ref([])
const policyTypeList = ref([])
const areaList = ref([])
const masterAreaList = ref([])

const showDialog = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
  form.value.reset()
  Form.value.id = null
}
const onTypeSelect = (data) => {
  insuranceName.value = null
  insurancePolicy.value = null
  insuranceArea.value = null
  nameList.value = masterNameList.value.filter(
    (item) => item?.insuranceType?._id === data
  )
}
const onNameSelect = (data) => {
  insurancePolicy.value = null
  insuranceArea.value = null
  policyTypeList.value = masterPolicyTypeList.value.filter(
    (item) => item?.insuranceName?._id === data
  )
}
const onPolicySelect  = (data)=>{
  insuranceArea.value = null
  areaList.value = masterAreaList.value.filter((item)=> item?.insurancePolicy?._id === data)
}
const getTypeList = async () => {
  await axios.get('admin/insurance/types').then((res) => {
    typeList.value = res?.data
  })
  await axios.get('admin/insurance/names').then((res) => {
    nameList.value = res?.data
    masterNameList.value = res?.data
  })
  await axios.get('admin/insurance/policies').then((res) => {
    policyTypeList.value = res?.data
    masterPolicyTypeList.value = res?.data
  })
  await axios.get('admin/insurance/areas').then((res) => {
    masterAreaList.value = res?.data
  })
}

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
    { title: 'Insurance Type', key: 'insurance_type', align: 'start' },
    { title: 'Insurance Name', key: 'insurance_name', align: 'start' },
    { title: 'Policy Type', key: 'policy_type', align: 'start' },
    { title: 'Area', key: 'area', align: 'start' },
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
    insuranceName: insuranceName.value,
    insuranceType: insuranceType.value,
    insurancePolicy: insurancePolicy.value,
    insuranceArea: insuranceArea.value
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
  insuranceType.value = item?.insuranceType?._id
  insuranceName.value = item?.insuranceName?._id
  insurancePolicy.value = item?.insurancePolicy?._id
  insuranceArea.value = item?.insuranceArea?._id
  nameList.value = masterNameList.value.filter(
    (data) => data?.insuranceType?._id === insuranceType.value
  )
  policyTypeList.value = masterPolicyTypeList.value.filter(
    (data) => data?.insuranceName?._id === insuranceName.value
  )
  areaList.value = masterAreaList.value.filter((data)=> data?.insurancePolicy?._id === insurancePolicy.value)
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
onMounted(async () => {
  await getTypeList()
  await loadItems({
    page: table_data.value.page,
    itemsPerPage: table_data.value.itemsPerPage,
    sortBy: 'ascending'
  })
})
</script>

<style lang="scss" scoped></style>
