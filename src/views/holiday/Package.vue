<template>
  <v-row class="mb-4" v-if="!formMode && !detailsMode">
    <v-col cols="12" md="8">
      <v-text-field
        v-model="table_data.search"
        placeholder="Enter search here ..."
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-btn @click="onCreate" block color="primary">
        + Add New {{ moduleName }}
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table-server
        density="compact"
        v-model:items-per-page="table_data.itemsPerPage"
        :headers="table_data.headers"
        :items-length="table_data.totalItems"
        :items="table_data.serverItems"
        v-model:search="table_data.search"
        :items-per-page-options="table_data.itemsPerPageOption"
        v-model:page="table_data.page"
        show-current-page
        @update:options="loadItems"
      >
        <template #item.name="{ item }">
          {{ item?.name }}
        </template>
        <template #item.action="{ item }">
          <div class="d-flex ga-3">
            <v-icon
              class="cursor-pointer"
              @click="onDetails(item)"
              icon="mdi-eye"
            />
            <v-icon
              class="cursor-pointer"
              @click="onEdit(item)"
              icon="mdi-pencil-box"
            />
            <v-icon @click="onDelete(item)" class="cursor-pointer">
              mdi-delete
            </v-icon>
          </div>
        </template>
      </v-data-table-server>
    </v-col>
  </v-row>
  <v-form v-model="formValue" ref="form" v-else-if="formMode && !detailsMode">
    <v-row v-if="showForm">
      <v-col cols="12">
        <v-btn
          size="x-small"
          color="primary"
          icon="mdi-arrow-left"
          @click="router.back()"
        />
        <h3 class="mt-4">
          {{ id ? `Update ${moduleName}` : `Create New ${moduleName}` }}
        </h3>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.name"
          label="Name"
          required
          :rules="[(v) => !!v || 'Name is required']"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          clearable
          label="Select Currency"
          :items="currencyList"
          item-title="name"
          item-value="_id"
          required
          :rules="[(v) => !!v || `Currency is required`]"
          v-model="formData.currency"
          return-object
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="formData.address"
          label="Address"
          required
          :rules="[(v) => !!v || 'Address is required']"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.duration.days"
          label="Duration (Days)"
          type="number"
          :rules="[validatePositiveInteger, validateRequired]"
          required
          @update:model-value="
            () => {
              formData.startDate = null
              formData.endDate = null
            }
          "
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.duration.nights"
          label="Duration (Nights)"
          type="number"
          :rules="[validatePositiveInteger, validateRequired]"
          required
          @update:model-value="
            () => {
              formData.startDate = null
              formData.endDate = null
            }
          "
        />
      </v-col>
      <!-- start date -->
      <v-col cols="12" md="6">
        <div
          class="border pa-4"
          v-if="
            formData.duration.nights === '' || formData.duration.days === ''
          "
        >
          Start Date: Add Duration (Days & Nights) First
        </div>
        <v-menu v-else v-model="startDateMenu" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-text-field
              label="Start Date"
              :rules="[(v) => !!v || 'Start Date is required']"
              v-model="formData.startDate"
              v-bind="props"
              prepend-inner-icon="mdi-calendar"
              readonly
            />
          </template>
          <v-date-picker
            v-bind="$attrs"
            v-model="formData.startDate"
            color="primary"
            @update:model-value="onStartDateChange"
          />
        </v-menu>
      </v-col>
      <!-- end date -->
      <v-col cols="12" md="6">
        <div
          class="border pa-4"
          v-if="
            formData.duration.nights === '' || formData.duration.days === ''
          "
        >
          End Date: Add Duration (Days & Nights) First
        </div>
        <v-menu v-else v-model="endDateMenu" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-text-field
              label="End Date"
              :rules="[(v) => !!v || 'End Date is required']"
              v-model="formData.endDate"
              v-bind="props"
              prepend-inner-icon="mdi-calendar"
              readonly
              disabled
            />
          </template>
          <v-date-picker
            v-bind="$attrs"
            v-model="formData.endDate"
            color="primary"
          />
        </v-menu>
      </v-col>

      <v-col cols="12">
        <p class="mb-2">Offer Type</p>
        <DocumentEditor
          height="200px"
          v-model="formData.offerType"
          class="mb-4"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          clearable
          label="Inclusion Icons"
          :items="inclusionIconList"
          item-title="name"
          item-value="_id"
          required
          :rules="[
            (v) => formData.inclusionIcons.length > 0 || 'Icons are required'
          ]"
          v-model="formData.inclusionIcons"
          multiple
          chips
        />
      </v-col>
      <v-col cols="12">
        <ImageUploader
          label="Images"
          :value="formData.uploads"
          @update="(data) => onUploadsUpdate(data, 'uploads')"
          :image-list="formData.images"
          @update-image-link="(data) => onImageUpdate(data, 'images')"
        />
      </v-col>
      <v-col cols="12">
        <p>Overview</p>
        <DocumentEditor
          height="200px"
          v-model="formData.overview"
          class="mb-4"
        />
      </v-col>
      <v-col cols="12">
        <p>Inclusion</p>
        <DocumentEditor
          height="200px"
          v-model="formData.inclusions"
          class="mb-4"
        />
      </v-col>
      <v-col cols="12">
        <p>Exclusion</p>
        <DocumentEditor
          height="200px"
          v-model="formData.exclusions"
          class="mb-4"
        />
      </v-col>

      <v-col cols="12">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel title="Itinerary (based on start date and end)">
            <v-expansion-panel-text>
              <v-row>
                <v-col v-if="!formData.itinerary?.length">
                  <div class="text-center pa-4 border">
                    Select start date first
                  </div>
                </v-col>
                <v-col
                  v-else
                  v-for="(itinerary, indexI) in formData.itinerary"
                  :key="indexI"
                  cols="12"
                  class="border mb-4 rounded"
                >
                  <v-text-field
                    label="Date"
                    :rules="[(v) => !!v || 'Date is required']"
                    v-model="itinerary.date"
                    :clearable="false"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                  />
                  <v-text-field
                    label="Title"
                    :rules="[(v) => !!v || 'Title is required']"
                    v-model="itinerary.title"
                    :clearable="true"
                  />
                  <p class="mt-8 mb-2">Description</p>
                  <DocumentEditor
                    :key="`itinerary-description-${editorKey}`"
                    height="200px"
                    v-model="itinerary.description"
                    class="mb-4"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Prices">
            <v-expansion-panel-text class="pb-10">
              <v-row class="mt-4">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.prices.adultDoubleOccupancy"
                    label="Adult (Double Occupancy)"
                    :rules="[validatePositiveInteger, validateRequired]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.prices.adultTripleOccupancy"
                    label="Adult (Triple Occupancy)"
                    :rules="[validatePositiveInteger, validateRequired]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.prices.adultSingleOccupancy"
                    label="Adult (Single Occupancy)"
                    :rules="[validatePositiveInteger, validateRequired]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.prices.child"
                    label="Child"
                    :rules="[validatePositiveInteger, validateRequired]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.prices.infant"
                    label="Infant"
                    :rules="[validatePositiveInteger, validateRequired]"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Additional Information">
            <v-expansion-panel-text class="pb-10">
              <v-row class="mt-4">
                <v-col cols="12">
                  <div class="text-right">
                    <v-btn color="primary" @click="addMoreAdditionalInfo">
                      + Add More
                    </v-btn>
                  </div>
                </v-col>
                <v-col
                  v-for="(value, key) in formData.additionalInformation"
                  :key="key"
                  cols="12"
                  class="border px-2 mb-4 rounded"
                >
                  <div class="text-right my-4">
                    <v-btn color="error" @click="removeAdditionalInfo(key)">
                      Delete
                    </v-btn>
                  </div>
                  <v-text-field
                    v-model="value.title"
                    label="Title"
                    :rules="[validateRequired]"
                  />
                  <p class="mt-6 mb-2">Description</p>
                  <DocumentEditor
                    :key="`additional-info-description-${editorKey}`"
                    height="200px"
                    v-model="value.description"
                    class=""
                  />
                  <p v-if="!value.description" class="text-error">
                    Description is required
                  </p>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12">
        <div class="text-right d-flex justify-end ga-4">
          <v-btn color="error" @click="router.back()"> Cancel </v-btn>
          <v-btn color="primary" @click="save"> Save </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
  <div v-if="!formMode && detailsMode">
    <v-btn
      class="mb-4"
      size="x-small"
      color="primary"
      icon="mdi-arrow-left"
      @click="router.back()"
    />
    <p class="mb-4">Name : {{ detailsData?.name }}</p>
    <p class="mb-4">Currency : {{ detailsData?.currency?.code }}</p>
    <p class="mb-4">Address : {{ detailsData?.address }}</p>
    <p class="mb-4">Duration ( Days ) : {{ detailsData?.duration?.days }}</p>
    <p class="mb-4">
      Duration ( Nights ) : {{ detailsData?.duration?.nights }}
    </p>
    <p class="mb-4">
      Start Date :
      {{
        detailsData?.startDate
          ? format(new Date(detailsData?.startDate), 'MM/dd/yyyy')
          : ''
      }}
    </p>
    <p class="mb-4">
      End Date :
      {{
        detailsData?.endDate
          ? format(new Date(detailsData?.endDate), 'MM/dd/yyyy')
          : ''
      }}
    </p>
    <p class="mb-2">Offer Type :</p>
    <div class="mb-5" v-html="detailsData?.offerType" />
    <div class="mb-4">
      <p class="mb-2">Inclusion Icons :</p>
      <v-row>
        <v-col
          cols="2"
          v-for="(i, index) in detailsData?.inclusionIcons"
          :key="index"
        >
          <v-img :src="i?.image" height="70px" width="70px" :alt="i?.name" />
        </v-col>
      </v-row>
    </div>
    <div class="mb-6">
      <p class="mb-2">Overview :</p>
      <div class="mb-4" v-html="detailsData?.overview" />
    </div>
    <div class="mb-6">
      <p class="mb-2">Inclusion :</p>
      <div class="mb-4" v-html="detailsData?.inclusions" />
    </div>
    <div class="mb-6">
      <p class="mb-2">Exclusion :</p>
      <div class="mb-4" v-html="detailsData?.exclusions" />
    </div>
    <div class="mb-8">
      <p class="mb-2">Prices:</p>
      <v-row class="mt-4 border pa-4">
        <v-col cols="12" md="6">
          <p>
            Adult (Double Occupancy) :
            {{ detailsData?.prices?.adultDoubleOccupancy }}
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <p>
            Adult (Triple Occupancy) :
            {{ detailsData?.prices?.adultTripleOccupancy }}
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <p>
            Adult (Single Occupancy) :
            {{ detailsData?.prices?.adultSingleOccupancy }}
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <p>Child : {{ detailsData?.prices?.child }}</p>
        </v-col>
        <v-col cols="12" md="6">
          <p>Infant : {{ detailsData?.prices?.infant }}</p>
        </v-col>
      </v-row>
    </div>
    <div class="mb-8">
      <p class="mb-2">Itinerary:</p>
      <v-row class="mt-4">
        <v-col
          v-for="(value, key) in detailsData?.itinerary"
          :key="key"
          cols="6"
          class="rounded border pa-4 shadow"
        >
          <p>
            Date :
            {{ value?.date ? format(new Date(value?.date), 'MM/dd/yyyy') : '' }}
          </p>
          <p>Title: {{ value?.title }}</p>
          <p class="mt-4 mb-2">Description</p>
          <div v-html="value.description" />
        </v-col>
      </v-row>
    </div>
    <div class="mb-8">
      <p class="mb-2">Additional Information:</p>
      <v-row class="mt-4">
        <v-col
          v-for="(value, key) in detailsData?.additionalInformation"
          :key="key"
          cols="6"
          class="rounded border pa-4 shadow"
        >
          <p>Title: {{ value?.title }}</p>
          <p class="mt-4 mb-2">Description</p>
          <div v-html="value.description" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import DocumentEditor from '@/components/DocumentEditor.vue'
import { useAppStore } from '@/store/app'
import { addDays, format } from 'date-fns'
import ImageUploader from './components/ImageUploader.vue'

const validatePositiveInteger = (value) => {
  // Ensure the value is an integer greater than zero
  if (
    value === null ||
    value === undefined ||
    isNaN(value) ||
    !Number.isInteger(Number(value))
  ) {
    return 'Value must be a positive integer'
  }
  return true
}

const validateRequired = (value) => {
  // Check if the value is null, undefined, or an empty string
  if (value === null || value === undefined || value === '') {
    return 'This field is required'
  }
  return true
}
const formatLabel = (key) => {
  return (
    key &&
    key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
      return str.toUpperCase()
    })
  )
}

const currencyList = ref([])
const inclusionIconList = ref([])
const editorKey = ref(0)

const startDateMenu = ref(false)
const endDateMenu = ref(false)

const initialFormData = {
  name: '',
  address: '',
  contactNumber: '',
  duration: {
    nights: '',
    days: ''
  },
  startDate: null,
  endDate: null,
  currency: null,
  prices: {
    adultDoubleOccupancy: '',
    adultTripleOccupancy: '',
    adultSingleOccupancy: '',
    child: '',
    infant: ''
  },
  offerType: '',
  overview: '',
  inclusions: '',
  exclusions: '',
  additionalInformation: [
    {
      title: '',
      description: ''
    }
  ],
  inclusionIcons: [],
  itinerary: [],
  images: [],
  uploads: []
}
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const moduleName = 'Package'
const formMode = computed(() => {
  return route?.query?.mode === 'form'
})
const detailsMode = computed(() => {
  return route?.query?.mode === 'details'
})
const panel = ref([0])
const id = computed(() => {
  return route?.query?.id
})

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 20,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Action', key: 'action', align: 'start' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 50, title: '50' },
    { value: 80, title: '80' }
  ]
})

const onCreate = () => {
  router.push({ name: 'holiday-package', query: { mode: 'form' } })
}

const formData = ref(initialFormData)
const form = ref()
const formValue = ref(false)
const showForm = ref(false)
const detailsData = ref({})
const onEdit = (item) => {
  router.push(`/holiday/package?mode=form&id=${item?._id}`)
}
const onDetails = (item) => {
  router.push(`/holiday/package?mode=details&id=${item?._id}`)
}
const removeUploads = (obj) => {
  let newObject = { ...obj }
  delete newObject.uploads
  return newObject
}
const getFilesPayload = () => {
  const files = []
  const fileMapper = []
  if (formData.value?.uploads?.length) {
    formData.value.uploads.forEach((file) => {
      if (file instanceof File) {
        files.push(file)
        fileMapper.push({
          resource: 'images',
          name: file.name
        })
      }
    })
  }
  return { files, fileMapper }
}
const getDataPayload = () => {
  try {
    let { files, fileMapper } = getFilesPayload()
    let data = removeUploads(formData.value)
    data.fileMapper = fileMapper
    let formdata = new FormData()
    formdata.append('data', JSON.stringify(data))
    files?.forEach((file) => {
      formdata.append('uploads', file)
    })
    return formdata
  } catch (error) {
    console.log(error)
  }
}
const save = async () => {
  panel.value = [0, 1, 2]
  form.value.validate()
  if (form.value.isValid) {
    const payload = getDataPayload()
    const response = id?.value
      ? await axios.patch(`admin/holiday/packages/${id.value}`, payload)
      : await axios.post('admin/holiday/packages', payload)
    if (response.data) {
      store.showSnackbar('Successfully Saved')
      router.back()
    }
  }
}

const loadItems = async () => {
  const payload = {
    page: table_data.value.page,
    perPage: table_data.value.itemsPerPage,
    search: table_data.value.search
  }
  await axios
    .post('admin/holiday/packages-list', {
      ...payload
    })
    .then((res) => {
      table_data.value.serverItems = res?.data?.data
      table_data.value.totalItems = res?.data?.data.length
    })
}
const confirmDelete = async () => {
  await axios
    .delete(`admin/holiday/packages/${store.details?._id}`)
    .then(async () => {
      store.showSnackbar('Successfully Deleted')
      await loadItems({
        page: table_data.value.page,
        itemsPerPage: table_data.value.itemsPerPage,
        sortBy: 'ascending'
      })
      store.closeDialog()
    })
}
const onDelete = (item) => {
  store.setDetails(item)
  const dialogModal = {
    title: `Delete ${moduleName}`,
    content: `Are you sure to delete this ${moduleName}?`,
    confirmText: 'Delete',
    formComponents: { fields: [] },
    confirmFunction: confirmDelete
  }
  store.showDialog(dialogModal)
}
const getCurrencyList = async () => {
  await axios.get('misc/currencies').then((res) => {
    if (res?.data?.length) {
      currencyList.value = res.data
    }
  })
}
const getInclusionIconList = async () => {
  await axios.get('/admin/holiday/inclusion-icons').then((res) => {
    if (res?.data?.length) {
      inclusionIconList.value = res.data
    }
  })
}
const onStartDateChange = (date) => {
  let daysNeedToAdd = formData.value.duration.days
  const reduceDay = Number(daysNeedToAdd) - 1
  const dayNumber = Number(reduceDay)

  formData.value.endDate = addDays(date, dayNumber)

  formData.value.itinerary = [...Array(dayNumber + 1).keys()].map((x) => {
    return {
      date: new Date(
        formData.value.startDate.getTime() + x * 24 * 60 * 60 * 1000
      ),
      title: '',
      description: ''
    }
  })
}
const removeAdditionalInfo = (index) => {
  formData.value.additionalInformation.splice(index, 1)
}
const addMoreAdditionalInfo = () => {
  formData.value.additionalInformation.unshift({
    title: '',
    description: ''
  })
  editorKey.value = editorKey.value + 1
}
const onUploadsUpdate = (images, key) => {
  formData.value[key] = images
}
const onImageUpdate = (data, key) => {
  formData.value[key] = [...data]
}
onBeforeMount(async () => {
  await getCurrencyList()
  await getInclusionIconList()
  if (id.value) {
    const details = await axios.get(`admin/holiday/packages/${id.value}`)

    if (details?.data?._id) {
      if (formMode.value) {
        details.data.startDate = new Date(details?.data?.startDate)
        details.data.endDate = new Date(details?.data?.endDate)
        details.data.itinerary.forEach((element) => {
          element.date = new Date(element.date)
        })
        details.data.inclusionIcons = details.data.inclusionIcons.map(
          (x) => x?._id
        )
        formData.value = { ...details?.data }
      } else if (detailsMode.value) {
        detailsData.value = { ...details?.data }
      }
    }
  }
  showForm.value = true
})
</script>

<style scoped>
.imageDelete {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
