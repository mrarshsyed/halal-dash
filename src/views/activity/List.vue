<template>
  <div>
    <FormComponent />
    <v-data-table-server
      class="mt-4 hotels-data-table"
      density="compact"
      v-model:items-per-page="table_data.itemsPerPage"
      :items-length="table_data.totalItems"
      :headers="table_data.headers"
      :items="table_data.serverItems"
      :search="table_data.search"
      :items-per-page-options="table_data.itemsPerPageOption"
      :page="table_data.page"
      @update:options="loadItems"
      :show-current-page="true"
    >
      <template #item.name="{ item }">
        {{ item?.name }}
      </template>
      <template #item.city="{ item }">
        {{ item?.destinationName }}
      </template>
      <template #item.country="{ item }">
        {{ item?.countryName }}
      </template>
      <template #item.rating="{ item }">
        {{ item?.halal_ratings_percentage }}
      </template>
      <template #item.manager="{ item }">
        {{ item?.manager?.email }}
      </template>
      <template #item.manager_name="{ item }">
        {{
          item?.manager?.name
            ? item?.manager?.name
            : store.getUserName(item?.manager?.email)
        }}
      </template>
      <template #item.action="{ item }">
        <div class="d-flex ga-2 cursor-pointer">
          <v-tooltip text="Details" location="top">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                icon="mdi-eye"
                @click="
                  () => {
                    store.setDetails(item)
                    detailsDialogShow = true
                  }
                "
              />
            </template>
          </v-tooltip>

          <v-tooltip
            v-if="store.hasPermission(permissions.activityUpdateManager)"
            text="Assign Manager"
            location="top"
          >
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                @click="handelAssignManagerIconClick(item)"
                icon="mdi-cog"
              />
            </template>
          </v-tooltip>
          <v-tooltip
            v-if="store.hasPermission(permissions.activityUpdateManager)"
            text="Remove Manager"
            location="top"
          >
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                v-if="item?.manager?.email"
                @click="handelRemoveManagerIconClick(item)"
                icon="mdi-link-off"
              />
            </template>
          </v-tooltip>
          <v-tooltip
            text="Ratings"
            location="top"
            v-if="store.hasPermission(permissions.activityUpdateHalalRatings)"
          >
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                @click="onRatingIconClick(item)"
                icon="mdi-star"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
      <template #bottom>
        <div class="d-flex justify-end align-center ga-4 pt-4">
          <v-btn
            size="x-small"
            icon="mdi-chevron-left"
            :disabled="table_data.page === 1"
            @click="onPreviousPage"
          />
          <p>{{ table_data.page }}</p>
          <v-btn
            @click="onNextPage"
            :disabled="!table_data.hasNextPage"
            size="x-small"
            icon="mdi-chevron-right"
          />
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
          />
        </div>
        <v-card-text>
          <Details />
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
                />
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="
              () => {
                selectedManager = null
                assignManagerDialogShow = false
              }
            "
          >
            Close
          </v-btn>
          <v-btn color="primary" @click="onAssignManager">
            Assign Manager
          </v-btn>
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
                <template #label>
                  {{ r?.name }}
                  <v-chip class="ms-2">
                    {{ r?.rating }}
                  </v-chip>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="ma-2">
          <p>
            Selected Ratings {{ sumOfSelectedRatings }} out of
            {{ sumOfTotalRating }} ({{ ratingPercentage }}%)
          </p>
          <v-spacer />
          <v-btn
            color="error"
            @click="
              () => {
                selectedRatings = []
                assignRatingDialogShow = false
              }
            "
          >
            Close
          </v-btn>
          <v-btn color="primary" @click="onAssignRating"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { useAppStore } from '@/store/app'
import { userFormStore } from '@/store/form'
import axiosInstance from '@/plugins/axios'
import Details from './Details.vue'
import axios from '@/plugins/axios'
import FormComponent from '@/components/FormComponent.vue'
import { permissions } from '@/config/userRoutes'

const store = useAppStore()
const formStore = userFormStore()

const detailsDialogShow = ref(false)
const assignManagerDialogShow = ref(false)
const managers = computed(() => {
  return store.managers
})
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
  totalItems: 100,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Activity', key: 'name', align: 'start' },
    { title: 'City', key: 'destinationName', align: 'start' },
    { title: 'Country', key: 'country', align: 'start' },
    { title: 'Rating(%)', key: 'rating', align: 'start' },
    { title: 'Manager Name', key: 'manager_name', align: 'start' },
    { title: 'Manager Email', key: 'manager', align: 'start' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 40, title: '40' }
  ],
  hasNextPage: true
})

const onSearch = async () => {
  const hasNonNullValue = Object.values(
    formStore.getFilteredSearchFields()
  ).some((value) => value !== null && value !== undefined)
  if (!hasNonNullValue) return
  formStore.formComponents.isSearched = true
  await loadItems({
    page: table_data.value.page,
    itemsPerPage: table_data.value.itemsPerPage,
    sortBy: 'ascending'
  })
}
const onReset = async () => {
  formStore.formComponents.selectedExportOption = null
  await loadItems({
    page: table_data.value.page,
    itemsPerPage: table_data.value.itemsPerPage,
    sortBy: 'ascending'
  })
}
const current_page = computed(() => {
  return table_data.value.page
})
const onExport = async () => {
  const payload = {
    page: current_page.value,
    perPage: table_data.value.itemsPerPage,
    export_type: formStore.formComponents.selectedExportOption,
    ...formStore.getFilteredSearchFields()
  }
  await axios
    .get('admin/activities/generate-excel-report', {
      params: { ...payload },
      responseType: 'blob'
    })
    .then((response) => {
      console.log(response)
      if (response.data) {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'activities_data.xlsx'
        document.body.appendChild(link)
        link.click()
        // Remove the link from the document
        document.body.removeChild(link)
      }
    })
}
const filteredCities = computed(() => {
  const country = store.countries.find(
    (c) => c?.code === formStore.getFieldValue('country')
  )
  return country ? country.destinations : []
})
const searchForm = ref({
  fields: [
    {
      key: 'name',
      type: 'text',
      label: 'Activities Name',
      isRequired: false,
      value: null
    },
    {
      key: 'ratingProvided',
      type: 'select',
      label: 'Rating Provided',
      isRequired: false,
      options: [
        { id: true, title: 'YES' },
        { id: false, title: 'NO' }
      ],
      value: null,
      itemTitle: 'title',
      itemValue: 'id',
      multiple: false
    },
    {
      key: 'manager',
      type: 'select',
      label: 'Assigned Manager',
      isRequired: false,
      options: managers.value,
      value: null,
      itemTitle: 'email',
      itemValue: '_id',
      multiple: false
    },
    {
      key: 'country',
      type: 'select',
      label: 'Country',
      isRequired: false,
      options: store.countries,
      value: null,
      itemTitle: 'name',
      itemValue: 'code',
      multiple: false
    },
    {
      key: 'destination',
      type: 'select',
      label: 'City',
      isRequired: false,
      options: filteredCities,
      value: null,
      itemTitle: 'name',
      itemValue: 'code',
      multiple: false
    }
  ],
  confirmFunction: onSearch,
  reset: onReset,
  confirmText: 'Search Activities',
  isSearched: false,
  exportFunction: onExport
})

const sumOfSelectedRatings = computed(() => {
  return selectedRatings.value.reduce((total, r) => total + r.rating, 0)
})
const sumOfTotalRating = computed(() => {
  return ratings.value.reduce((total, r) => total + r.rating, 0)
})
const ratingPercentage = computed(() => {
  return Math.ceil((sumOfSelectedRatings.value / sumOfTotalRating.value) * 100)
})

const loadItems = async ({ page, itemsPerPage }) => {
  table_data.value.page = page
  await axiosInstance
    .get(`admin/activities`, {
      params: {
        page: page,
        perPage: itemsPerPage,
        ...formStore.getFilteredSearchFields()
      }
    })
    .then((res) => {
      // store.setUserList(res?.data?.data)
      table_data.value.serverItems = res?.data?.data
      table_data.value.totalItems = res?.data?.data.length * res?.data?.to
      table_data.value.hasNextPage = res?.data?.hasNextPage
    })
}
const handelAssignManagerIconClick = (item) => {
  store.setDetails(item)
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
            await store.updateUserRoleAndPermissions(
              selectedManager.value._id,
              'manager',
              [permissions.activityList]
            )
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
    .patch(`admin/activities/${store.details?._id}/update-manager`, {
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
  store.setDetails(item)
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
    .patch(`admin/activities/${store.details?._id}/update-halal-ratings`, {
      ratingIds: ids
    })
    .then(async (res) => {
      store.showSnackbar('Ratings updated successfully')
      store.setDetails({})
      await loadItems({
        page: table_data.value.page,
        itemsPerPage: table_data.value.itemsPerPage,
        sortBy: 'ascending'
      })
      assignRatingDialogShow.value = false
      selectedRatings.value = []
    })
}
const onNextPage = async () => {
  table_data.value.page = table_data.value.page + 1
}
const onPreviousPage = async () => {
  table_data.value.page = table_data.value.page - 1
}
const removeManager = async () => {
  await axios
    .patch(`admin/activities/${store.details?._id}/update-manager`, {
      managerId: null
    })
    .then(async (res) => {
      if (res?.status === 200) {
        store.showSnackbar('Manager removed successfully')
        await loadItems({
          page: table_data.value.page,
          itemsPerPage: table_data.value.itemsPerPage,
          sortBy: 'ascending'
        })
        store.closeDialog()
      }
    })
}

const handelRemoveManagerIconClick = (item) => {
  store.setDetails(item)
  const dialogModal = {
    title: 'Remove Manager',
    content: `Are you sure you want to remove ${
      item?.manager?.name ?? item?.manager?.email
    } from ${item?.name} ?`,
    confirmText: 'Remove Manager',
    formComponents: [],
    confirmFunction: removeManager
  }
  store.showDialog(dialogModal)
}

onMounted(async () => {
  const countries = await axios.get('/admin/activities/get-countries')
  store.setCountries(countries?.data)
  formStore.setFormComponents(searchForm.value)
  formStore.updateOptions('country', countries?.data)
  if (store.hasPermission(permissions.userList)) {
    await axiosInstance.get('admin/users').then((res) => {
      if (res?.data?.length) {
        const managerList = res?.data?.filter((x) => x?.role === 'manager')
        store.setManager(managerList)
        searchForm.value.fields[2].options = managerList
      }
    })
  }
  await axiosInstance.get('admin/activity-halal-ratings').then((res) => {
    if (res?.data?.length) {
      ratings.value = res?.data
    }
  })
})

onBeforeUnmount(() => {
  formStore.formComponents.fields = []
})
watch(
  () => formStore.getFieldValue('country'),
  () => {
    formStore.updateField('destination', null)
  }
)
watch(
  () => formStore.formComponents.selectedExportOption,
  (newValue, oldValue) => {
    if (formStore.formComponents.selectedExportOption) {
      onExport()
    }
  }
)
</script>

<style lang="scss" scoped></style>
