<template>
  <div>
    <FormComponent />
    <v-data-table
      class="mt-4 hotels-data-table"
      density="compact"
      :items-per-page="20"
      :items-length="table_data.totalItems"
      :headers="table_data.headers"
      :items="table_data.serverItems"
      show-select
      v-model="selected"
      item-value="code"
    >
      <template #top>
        <div
          v-if="table_data.serverItems?.length"
          class="d-flex justify-end align-center ga-4 pb-4"
        >
          <v-btn
            @click="handleAdd"
            prepend-icon="mdi-plus"
            color="primary"
            variant="outlined"
          >
            Add To system
          </v-btn>
        </div>
      </template>
      <template #item.action="{ item }">
        <div class="d-flex ga-2 cursor-pointer">
          <!-- <v-icon
            icon="mdi-eye"
            @click="
              () => {
                store.setHotelDetails(item)
                detailsDialogShow = true
              }
            "
          ></v-icon> -->
          <v-icon
            v-if="
              store.user?.data?.role === 'admin' ||
              store.user?.data?.role === 'employee' ||
              store.user?.data?.role === 'super-admin'
            "
            @click="handleAdd(item)"
            icon="mdi-plus"
          />
        </div>
      </template>
      <template #bottom>
        <div
          v-if="table_data.serverItems?.length"
          class="d-flex justify-end align-center ga-4 pt-4"
        >
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
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { useAppStore } from '@/store/app'
import { userFormStore } from '@/store/form'
import axiosInstance from '@/plugins/axios'
// import HotelDetails from './HotelDetails.vue'
import axios from '@/plugins/axios'
import FormComponent from '@/components/FormComponent.vue'

const store = useAppStore()
const formStore = userFormStore()
const selected = ref([])

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 20,
  totalItems: 100,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Activity', key: 'name', align: 'start' },
    { title: 'Country', key: 'country', align: 'start' },
    { title: 'Destination', key: 'destination', align: 'start' },
    { title: 'Code', key: 'code', align: 'start' }
    // { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 40, title: '40' }
  ],
  hasNextPage: false
})

const onSearch = async () => {
  const hasNonNullValue = Object.values(
    formStore.getFilteredSearchFields()
  ).some((value) => value !== null && value !== undefined)
  if (!hasNonNullValue) return
  // formStore.formComponents.isSearched = true
  await loadItems()
}
const onReset = async () => {
  // formStore.formComponents.selectedExportOption = null
  selected.value = []
  table_data.value.serverItems = []
  table_data.value.page = 1
  table_data.value.hasNextPage = false
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
    .get('admin/hotels/generate-excel-report', {
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
        link.download = 'hotel_data.xlsx'
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
  return country ? country?.destinations : []
})
const searchForm = ref({
  fields: [
    {
      key: 'country',
      type: 'select',
      label: 'Country',
      isRequired: true,
      options: store.countries,
      value: null,
      itemTitle: 'name',
      itemValue: 'code',
      multiple: false
    },
    {
      key: 'destination',
      type: 'select',
      label: 'Destinations',
      isRequired: true,
      options: filteredCities,
      value: null,
      itemTitle: 'name',
      itemValue: 'code',
      multiple: false
    },
    {
      key: 'name',
      type: 'text',
      label: 'Activity Name',
      isRequired: false,
      value: null
    },
  ],
  confirmFunction: onSearch,
  reset: onReset,
  confirmText: 'Search Activities',
  isSearched: false,
  exportFunction: onExport
})
const loadItems = async () => {
  const hasNonNullValue = Object.values(
    formStore.getFilteredSearchFields()
  ).some((value) => value !== null && value !== undefined)
  if (!hasNonNullValue) return
  await axiosInstance
    .get(`admin/activities/search-to-add`, {
      params: {
        page: table_data.value.page,
        perPage: table_data.value.itemsPerPage,
        ...formStore.getFilteredSearchFields()
      }
    })
    .then((res) => {
      // store.setUserList(res?.data?.data)
      table_data.value.serverItems = res?.data?.data
      table_data.value.hasNextPage = res?.data?.hasNextPage
    })
}
const handleAdd = async () => {
  if (selected.value?.length) {
    const payload = {
      activities: table_data.value.serverItems?.filter((x) =>
        selected.value?.includes(x?.code)
      )
    }
    await axiosInstance
      .post('/admin/activities/add-to-system', payload)
      .then((res) => {
        store.showSnackbar('Successfully Added')
      })
  }
}
const onNextPage = async () => {
  table_data.value.page = table_data.value.page + 1
  await loadItems()
}
const onPreviousPage = async () => {
  table_data.value.page = table_data.value.page - 1
  await loadItems()
}
onMounted(async () => {
  const countries = await axios.get('/admin/activities/get-countries')
  store.setCountries(countries?.data)
  formStore.setFormComponents(searchForm.value)
  formStore.updateOptions('country', countries?.data)
})
watch(
  () => formStore.getFieldValue('country'),
  () => {
    formStore.updateField('destination', null)
  }
)
onBeforeUnmount(() => {
  formStore.formComponents.fields = []
})
// watch(
//   () => formStore.formComponents.selectedExportOption,
//   (newValue, oldValue) => {
//     if (formStore.formComponents.selectedExportOption) {
//       onExport()
//     }
//   }
// )
</script>

<style lang="scss" scoped></style>
