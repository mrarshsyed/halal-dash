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
        <v-btn
          @click="showDialog"
          :disabled="current_percentage >= 100"
          block
          color="primary"
        >
          + Add New Rating
        </v-btn>
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <div class="d-flex flex-column ga-1">
          <p>Maximum Percentage : <span class="font-weight-bold">100%</span></p>
          <p>
            Current Percentage:
            <span class="font-weight-bold">{{ current_percentage }}%</span>
          </p>
        </div>
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
      <template #item.rating="{ item }">
        {{ item?.rating }}
      </template>
      <template #item.category="{ item }">
        {{ item?.category?.name }}
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
const baseurl = 'admin/activity-halal-ratings'
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/app'
import axios from '@/plugins/axios'

const categoryList = ref([])
const getCategoryList = async () => {
  await axios.get('admin/activity-halal-rating-categories').then((res) => {
    if (res.data.length) {
      categoryList.value = res.data
    }
  })
}

const ratingForm = ref({
  id: null,
  fields: [
    { type: 'text', label: 'Name', isRequired: true, value: null },
    {
      type: 'number',
      label: 'Rating',
      isRequired: true,
      value: null
    },
    {
      key: 'category',
      type: 'select',
      label: 'Select Category',
      isRequired: true,
      options: [],
      value: null,
      itemTitle: 'name',
      itemValue: '_id',
      multiple: false,
      returnObject: true
    }
  ]
})

const resetForm = async () => {
  ratingForm.value.id = null
  ratingForm.value.fields = ratingForm.value.fields?.map((form) => {
    return {
      ...form,
      value: null
    }
  })
}

const store = useAppStore()

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await axios
    .get(baseurl, {
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
    { title: 'Rating', key: 'rating', align: 'start' },
    { title: 'Category', key: 'category', align: 'start' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

const current_percentage = computed(() => {
  return table_data.value.serverItems.reduce(
    (sum, item) => sum + item?.rating,
    0
  )
})

const maximum_percentage_reached = (rating, isUpdate = false) => {
  const total = isUpdate
    ? Number(current_percentage.value) - rating // Subtract the rating being updated
    : Number(current_percentage.value) + Number(rating)
  return total > 100
}

const saveRating = async () => {
  const ratingField = store.dialog.formComponents?.fields[1]
  const rating = ratingField?.value
  const isUpdate = !!ratingForm?.value?.id
  if (maximum_percentage_reached(rating, isUpdate)) {
    store.showSnackbar('Maximum rating can be up to 100%', 'error')
    return
  }
  const payload = {
    name: store.dialog.formComponents?.fields[0]?.value,
    rating: store.dialog.formComponents?.fields[1]?.value,
    category: store.getFieldValue('category')
  }
  const response = !ratingForm?.value?.id
    ? await axios.post(baseurl, payload)
    : await axios.patch(`${baseurl}/${ratingForm?.value?.id}`, payload)
  if (response?.status === 200) {
    store.showSnackbar('Rating saved successfully')
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
  ratingForm.value.fields[2].options = categoryList.value
  const dialogModal = {
    title: 'Add new rating',
    content: '',
    confirmText: 'Save',
    formComponents: { ...ratingForm.value },
    confirmFunction: saveRating
  }
  store.showDialog(dialogModal)
}

const onEdit = async (item) => {
  resetForm()
  store.setRatingDetails(item)
  ratingForm.value.fields[2].options = categoryList.value
  ratingForm.value.id = item?._id
  ratingForm.value.fields[0].value = item?.name
  ratingForm.value.fields[1].value = item?.rating
  ratingForm.value.fields[2].value = item.category
  const dialogModal = {
    title: 'Update rating',
    content: '',
    confirmText: 'Save',
    formComponents: ratingForm.value,
    confirmFunction: saveRating
  }
  store.showDialog(dialogModal)
}

const deleteRating = async () => {
  if (store.rating_details?._id) {
    await axios
      .delete(`${baseurl}/${store.rating_details?._id}`)
      .then(async (res) => {
        if (res?.status === 204) {
          store.showSnackbar('Rating Deleted Successfully')
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
    title: 'Delete Rating',
    content: 'Are you sure to delete? ',
    confirmText: 'Delete',
    formComponents: {},
    confirmFunction: deleteRating
  }
  store.showDialog(dialogModal)
}

onMounted(async () => {
  await getCategoryList()
  await loadItems({
    page: table_data.value.page,
    itemsPerPage: table_data.value.itemsPerPage,
    sortBy: 'ascending'
  })
})
</script>

<style lang="scss" scoped></style>
