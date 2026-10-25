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
          block
          color="primary"
        >
          + Add New Parameter
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
      <template #item.rating="{ item }">
        {{ item?.rating }}
      </template>
      <template #item.mainCategory="{ item }">
        {{ item?.mainCategory?.name ?? item?.category?.mainCategory?.name }}
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
import { ref, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/app'
import axios from '@/plugins/axios'

const store = useAppStore()

const baseurl = 'admin/activity-halal-ratings'
const mainCategoryList = ref([])
const categoryList = ref([])
const getLists = async () => {
  const [main, cat] = await Promise.all([
    axios.get('admin/activity-halal-rating-main-categories'),
    axios.get('admin/activity-halal-rating-categories')
  ])
  mainCategoryList.value = main?.data ?? []
  categoryList.value = cat?.data ?? []
}
const ratingForm = ref({
  id: null,
  fields: [
    { key: 'name', type: 'text', label: 'Name', isRequired: true, value: null },
    {
      key: 'rating',
      type: 'number',
      label: 'Points',
      isRequired: true,
      positive: true,
      value: null
    },
    {
      key: 'mainCategory',
      type: 'select',
      label: 'Category',
      isRequired: true,
      options: [],
      value: null,
      itemTitle: 'name',
      itemValue: '_id',
      multiple: false
    },
    {
      key: 'category',
      type: 'select',
      label: 'Subcategory',
      isRequired: false,
      hidden: true,
      options: [],
      value: null,
      itemTitle: 'name',
      itemValue: '_id',
      multiple: false
    }
  ]
})
const resetForm = () => {
  ratingForm.value.id = null
  ratingForm.value.fields = ratingForm.value.fields.map((f) => ({
    ...f,
    value: null
  }))
  ratingForm.value.fields[2].options = mainCategoryList.value
  ratingForm.value.fields[3].options = []
  ratingForm.value.fields[3].hidden = true
  ratingForm.value.fields[3].isRequired = false
}
const loadItems = async () => {
  await axios.get(baseurl).then((res) => {
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
    { title: 'Points', key: 'rating', align: 'start' },
    { title: 'Category', key: 'mainCategory', align: 'start' },
    { title: 'Subcategory', key: 'category', align: 'start' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

// The subcategory picker only exists for main categories that allow them.
const syncCategoryField = (mainId) => {
  const fields = store.dialog.formComponents?.fields
  if (!fields?.length) return
  const main = mainCategoryList.value.find((m) => m._id === mainId)
  const categoryField = fields[3]
  const allows = !!main?.allow_category
  categoryField.hidden = !allows
  categoryField.isRequired = allows
  categoryField.options = allows
    ? categoryList.value.filter((c) => c?.mainCategory?._id === mainId)
    : []
  if (!categoryField.options.some((c) => c._id === categoryField.value)) {
    categoryField.value = null
  }
}
watch(
  () => store.dialog.formComponents?.fields?.[2]?.value,
  (mainId) => syncCategoryField(mainId)
)

// An activity is scored on the Common Parameters plus ONE subcategory, so that
// total must not go above 100. Check every subcategory after this save.
const exceedsMaximum = (payload) => {
  const editingId = ratingForm.value.id
  let common = 0
  const subtotals = {}
  for (const item of table_data.value.serverItems) {
    if (item._id === editingId) continue
    if (item.category?._id) {
      subtotals[item.category._id] =
        (subtotals[item.category._id] ?? 0) + Number(item.rating)
    } else {
      common += Number(item.rating)
    }
  }
  if (payload.category) {
    subtotals[payload.category] =
      (subtotals[payload.category] ?? 0) + payload.rating
  } else {
    common += payload.rating
  }
  const largestSubtotal = Math.max(0, ...Object.values(subtotals))
  return common + largestSubtotal > 100
}
const saveRating = async () => {
  const mainId = store.getFieldValue('mainCategory')
  const main = mainCategoryList.value.find((m) => m._id === mainId)
  const payload = {
    name: store.getFieldValue('name'),
    rating: Number(store.getFieldValue('rating'))
  }
  if (main?.allow_category) {
    payload.category = store.getFieldValue('category')
  } else {
    payload.mainCategory = mainId
  }
  if (exceedsMaximum(payload)) {
    store.showSnackbar(
      'Common parameters plus a subcategory cannot total more than 100 points',
      'error'
    )
    return
  }
  try {
    const response = !ratingForm.value.id
      ? await axios.post(baseurl, payload)
      : await axios.patch(`${baseurl}/${ratingForm.value.id}`, payload)
    if (response?.status === 200 || response?.status === 201) {
      store.showSnackbar('Parameter saved successfully')
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
    title: 'Add new parameter',
    content: '',
    confirmText: 'Save',
    formComponents: { ...ratingForm.value },
    confirmFunction: saveRating
  })
}
const onEdit = async (item) => {
  resetForm()
  store.setRatingDetails(item)
  const mainId = item?.mainCategory?._id ?? item?.category?.mainCategory?._id
  ratingForm.value.id = item?._id
  ratingForm.value.fields[0].value = item?.name
  ratingForm.value.fields[1].value = item?.rating
  ratingForm.value.fields[2].value = mainId
  store.showDialog({
    title: 'Update parameter',
    content: '',
    confirmText: 'Save',
    formComponents: ratingForm.value,
    confirmFunction: saveRating
  })
  ratingForm.value.fields[3].value = item?.category?._id ?? null
  syncCategoryField(mainId)
}
const deleteRating = async () => {
  if (!store.rating_details?._id) return
  try {
    const res = await axios.delete(`${baseurl}/${store.rating_details._id}`)
    if (res?.status === 204) {
      store.showSnackbar('Parameter deleted successfully')
      await loadItems()
      store.setRatingDetails({})
      store.closeDialog()
    }
  } catch (e) {
    // error snackbar shown by interceptor; keep the row
  }
}
const onDelete = async (item) => {
  store.setRatingDetails(item)
  store.showDialog({
    title: 'Delete Parameter',
    content: 'Are you sure to delete?',
    confirmText: 'Delete',
    formComponents: {},
    confirmFunction: deleteRating
  })
}
onMounted(async () => {
  await getLists()
  await loadItems()
})
</script>

<style lang="scss" scoped></style>
