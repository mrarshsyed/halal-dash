<template>
  <div>
    <v-row class="mb-4">
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
    <v-data-table-server
      density="compact"
      v-model:items-per-page="table_data.itemsPerPage"
      :headers="table_data.headers"
      :items-length="table_data.totalItems"
      :items="table_data.serverItems"
      :search="table_data.search"
      :items-per-page-options="table_data.itemsPerPageOption"
      :page="table_data.page"
      @update:options="loadItems"
      fixed-footer
      fixed-header
    >
      <template v-slot:item.name="{ item }">{{ item?.name }}</template>
      <template v-slot:item.city="{ item }">{{ item?.region?.name }}</template>
      <template v-slot:item.country="{ item }">{{
        item?.region?.country_code
      }}</template>
      <template v-slot:item.rating="{ item }">{{
        item?.halal_ratings_percentage
      }}</template>
      <template v-slot:item.manager="{ item }">{{
        item?.manager?.email
      }}</template>
      <template v-slot:item.action="{ item }">
        <div class="d-flex ga-2 cursor-pointer">
          <v-icon
            icon="mdi-eye"
            @click="
              () => {
                store.setHotelDetails(item)
                detailsDialogShow = true
              }
            "
          ></v-icon>
          <v-icon
            @click="handelAssignManagerIconClick(item)"
            icon="mdi-cog"
          ></v-icon>
          <v-icon @click="onRatingIconClick(item)" icon="mdi-star"></v-icon>
        </div>
      </template>
    </v-data-table-server>
    <v-dialog
      max-width="100%"
      v-model="detailsDialogShow"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="pa-5">
        <div class="text-right mb-4">
          <v-icon
            @click="detailsDialogShow = false"
            color="error"
            icon="mdi-close-circle"
          ></v-icon>
        </div>
        <v-card-text>
          <HotelDetails />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="assignManagerDialogShow">
      <v-card>
        <v-card-title>Assign Manager</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-form ref="managerForm">
                <v-autocomplete
                  label="Select Manager"
                  no-data-text="Hit enter to create"
                  @update:search="onManagerSearch"
                  :items="managers"
                  item-title="email"
                  return-object
                  v-model="selectedManager"
                  @keydown.enter="onManagerCreate"
                  required
                  :rules="[(v) => !!v || `Manager is required`]"
                >
                </v-autocomplete>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="
              () => {
                selectedManager = null
                assignManagerDialogShow = false
              }
            "
            >Close</v-btn
          >
          <v-btn color="primary" @click="onAssignManager">Assign Manager</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="assignRatingDialogShow">
      <v-card>
        <v-card-title>Add Rating</v-card-title>
        <v-card-text>
          <p>Select Rating</p>
          <v-row no-gutters>
            <v-col cols="12" v-for="(r, index) in ratings" :key="index">
              <v-checkbox v-model="selectedRatings" :value="r">
                <template v-slot:label>
                  {{ r?.name }} <v-chip class="ms-2">{{ r?.rating }}%</v-chip>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="
              () => {
                selectedRatings = []
                assignRatingDialogShow = false
              }
            "
            >Close</v-btn
          >
          <v-btn color="primary" @click="onAssignRating">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/store/app'
import axiosInstance from '@/plugins/axios'
import HotelDetails from './HotelDetails.vue'
import axios from '@/plugins/axios'

const store = useAppStore()

const detailsDialogShow = ref(false)
const assignManagerDialogShow = ref(false)
const managers = ref([])
const ratings = ref([])
const selectedManager = ref(null)
const selectedRatings = ref([])
const managerSearch = ref('')
const managerForm = ref()
const assignRatingDialogShow = ref(false)

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 20,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'City', key: 'city', align: 'start' },
    { title: 'Country', key: 'country', align: 'start' },
    { title: 'Rating(%)', key: 'rating', align: 'start' },
    { title: 'Manager', key: 'manager', align: 'start' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

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
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await axiosInstance
    .get('admin/hotels', {
      page: page,
      itemsPerPage: itemsPerPage,
      sortBy: sortBy
    })
    .then((res) => {
      // store.setUserList(res?.data?.data)
      table_data.value.serverItems = res?.data?.data
      table_data.value.totalItems = res?.data?.total
    })
  await axiosInstance.get('admin/users').then((res) => {
    if (res?.data?.length) {
      const managerList = res?.data?.filter((x) => x?.role === 'manager')
      managers.value = managerList
    }
  })
  await axiosInstance.get('admin/halal-ratings').then((res) => {
    if (res?.data?.length) {
      ratings.value = res?.data
    }
  })
}
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
const handelAssignManagerIconClick = (item) => {
  store.setHotelDetails(item)
  if (item?.manager?._id) {
    selectedManager.value = item?.manager
  }
  assignManagerDialogShow.value = true
}
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
const onManagerSearch = (data) => {
  managerSearch.value = data
}
const onManagerCreate = async () => {
  if (
    managerSearch.value &&
    !managers.value?.some((m) => m?.email?.includes(managerSearch.value))
  ) {
    const valid = validateEmail(managerSearch.value.trim())
    if (valid) {
      await store
        .createUser(managerSearch.value, 'manager')
        .then(async (res) => {
          if (res?.status === 200) {
            selectedManager.value = res?.data
            await loadItems({
              page: table_data.value.page,
              itemsPerPage: table_data.value.itemsPerPage,
              sortBy: 'ascending'
            })
            store.showSnackbar('Invitation sent Successfully')
          }
        })
    } else {
      store.showSnackbar('Email must be valid', 'error')
    }
  }
}
const onAssignManager = async () => {
  managerForm.value.validate()
  if (!managerForm?.value?.isValid) return
  axios
    .patch(`admin/hotels/${store.hotel_details?._id}/update-manager`, {
      managerId: selectedManager.value?._id
    })
    .then(async (res) => {
      if (res?.status === 200) {
        store.showSnackbar('Manager assigned successfully')
        await loadItems({
          page: table_data.value.page,
          itemsPerPage: table_data.value.itemsPerPage,
          sortBy: 'ascending'
        })
        selectedManager.value = ''
        assignManagerDialogShow.value = false
      }
    })
}
const onRatingIconClick = async (item) => {
  store.setHotelDetails(item)
  if (item?.halal_ratings?.length) {
    selectedRatings.value = item?.halal_ratings
  }
  assignRatingDialogShow.value = true
}
const onAssignRating = async () => {
  const ids = selectedRatings.value?.map((x) => {
    return x._id
  })
  axios
    .patch(`admin/hotels/${store.hotel_details?._id}/update-halal-ratings`, {
      ratingIds: ids
    })
    .then(async (res) => {
      store.showSnackbar('Ratings updated successfully')
      store.setHotelDetails({})
      await loadItems({
        page: table_data.value.page,
        itemsPerPage: table_data.value.itemsPerPage,
        sortBy: 'ascending'
      })
      assignRatingDialogShow.value = false
      selectedRatings.value = []
    })
}
</script>

<style lang="scss" scoped></style>
