<template>
  <v-row
    class="mb-4"
    v-if="!formMode"
  >
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
        @click="onCreate"
        block
        color="primary"
      >
        + Add New Package
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table
        density="compact"
        :items-per-page="table_data.itemsPerPage"
        :headers="table_data.headers"
        :items-length="table_data.totalItems"
        :items="table_data.serverItems"
        :search="table_data.search"
        :items-per-page-options="table_data.itemsPerPageOption"
        :page="table_data.page"
        show-current-page
      >
        <template #item.name="{ item }">
          {{ item?.name }}
        </template>
        <template #item.description="{ item }">
          {{ item?.description ?? '-' }}
        </template>
        <template #item.ship_line="{ item }">
          {{ item?.shipLine?.name ?? '-' }}
        </template>
        <template #item.action="{ item }">
          <div class="d-flex ga-3">
            <v-icon
              class="cursor-pointer"
              @click="onEdit(item)"
              icon="mdi-pencil-box"
            />
            <v-icon
              @click="onDelete(item)"
              color="error"
              class="cursor-pointer"
            >
              mdi-delete
            </v-icon>
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <v-form
    v-model="formValue"
    ref="form"
    v-else-if="formMode"
  >
    <v-row v-if="showForm">
      <v-col cols="12">
        <v-btn
          size="x-small"
          color="primary"
          icon="mdi-arrow-left"
          @click="router.push('/cruise/package')"
        />
        <h3 class="mt-4">
          {{ id ? 'Update Package' : 'Create New Package' }}
        </h3>
      </v-col>
      <!-- name -->
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="formData.name"
          label="Name"
          required
          :rules="[(v) => !!v || 'Name is required']"
        />
      </v-col>
      <!-- currency -->
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Select Currency"
          :items="currencyList"
          item-title="name"
          item-value="_id"
          required
          :rules="[(v) => !!v || `Currency is required`]"
          v-model="formData.currency"
        />
      </v-col>
      <!-- start date -->
      <v-col
        cols="12"
        md="6"
      >
        <v-menu
          v-model="startDateMenu"
          :close-on-content-click="false"
        >
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
          />
        </v-menu>
      </v-col>
      <!-- end date -->
      <v-col
        cols="12"
        md="6"
      >
        <v-menu
          :disabled="!formData.startDate"
          v-model="endDateMenu"
          :close-on-content-click="false"
        >
          <template #activator="{ props }">
            <v-text-field
              label="End Date"
              :rules="[(v) => !!v || 'End Date is required']"
              v-model="formData.endDate"
              v-bind="props"
              prepend-inner-icon="mdi-calendar"
              readonly
            />
          </template>
          <v-date-picker
            v-bind="$attrs"
            v-model="formData.endDate"
            color="primary"
            :min="formData.startDate"
          />
        </v-menu>
      </v-col>
      <!-- destination -->
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Select Destinations"
          :items="destinationList"
          item-title="name"
          item-value="_id"
          required
          multiple
          chips
          :rules="[
            (v) =>
              formData.destinations.length > 0 || `Destinations are required`
          ]"
          v-model="formData.destinations"
        />
      </v-col>
      <!-- start location -->
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Select Start Location"
          :items="portList"
          item-title="name"
          item-value="_id"
          required
          :rules="[(v) => !!v || 'Start Location is required']"
          v-model="formData.startLocation"
        />
      </v-col>
      <!-- end location -->
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Select End Location"
          :items="portList"
          item-title="name"
          item-value="_id"
          required
          :rules="[(v) => !!v || 'End Location is required']"
          v-model="formData.endLocation"
        />
      </v-col>
      <!-- end location -->
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Select Ship"
          :items="shipList"
          item-title="name"
          item-value="_id"
          required
          :rules="[(v) => !!v || 'Ship is required']"
          v-model="formData.ship"
        />
      </v-col>

      <!-- description -->
      <v-col cols="12">
        <p>Description</p>
        <DocumentEditor
          height="200px"
          v-model="formData.description"
        />
      </v-col>
      <!-- highlights -->
      <v-col cols="12">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel title="Highlights">
            <v-expansion-panel-text>
              <v-row>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    @click="addMore('highlights')"
                  >
                    + Add More
                  </v-btn>
                </v-col>
                <v-col
                  v-for="(highlight, indexH) in formData.highlights"
                  :key="indexH"
                  cols="12"
                  class="border mb-4 rounded"
                >
                  <div
                    class="text-right mb-4"
                    v-if="formData.highlights.length > 1"
                  >
                    <v-btn
                      icon="mdi-delete"
                      color="error"
                      size="x-small"
                      @click="RemoveItem('highlights', indexH)"
                    />
                  </div>
                  <v-text-field
                    v-model="highlight.name"
                    label="Name"
                    outlined
                    :rules="[(v) => !!v || `Name is required`]"
                  />
                  <DocumentEditor
                    :key="docKey"
                    height="200px"
                    v-model="highlight.description"
                    class="mb-4"
                  />
                  <ImageUploader
                    :value="highlight.uploads"
                    @update="(data) => onHighlightsImageUpdate(data, indexH)"
                    @update-image-link="(data) => onUpdateImageLinks('highlights', indexH, data)
                    "
                    :image-list="highlight?.images ?? []"
                    :key="highlightsKey"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <!-- policies -->
      <v-col cols="12">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel title="Policies">
            <v-expansion-panel-text>
              <v-row>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    @click="addMore('policies')"
                  >
                    + Add More
                  </v-btn>
                </v-col>
                <v-col
                  v-for="(policy, indexP) in formData.policies"
                  :key="indexP"
                  cols="12"
                  class="border mb-4 rounded"
                >
                  <div
                    class="text-right mb-4"
                    v-if="formData.policies.length > 1"
                  >
                    <v-btn
                      icon="mdi-delete"
                      color="error"
                      size="x-small"
                      @click="RemoveItem('policies', indexP)"
                    />
                  </div>
                  <v-text-field
                    v-model="policy.name"
                    label="Name"
                    outlined
                    :rules="[(v) => !!v || `Name is required`]"
                  />
                  <DocumentEditor
                    :key="docKey"
                    height="200px"
                    v-model="policy.description"
                    class="mb-4"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <!-- itinerary -->
      <v-col cols="12">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel title="Itinerary">
            <v-expansion-panel-text>
              <v-row>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    @click="addMore('itinerary')"
                  >
                    + Add More
                  </v-btn>
                </v-col>
                <v-col
                  v-for="(itinerary, indexI) in formData.itinerary"
                  :key="indexI"
                  cols="12"
                  class="border mb-4 rounded"
                >
                  <div
                    class="text-right mb-4"
                    v-if="formData.itinerary.length > 1"
                  >
                    <v-btn
                      icon="mdi-delete"
                      color="error"
                      size="x-small"
                      @click="RemoveItem('itinerary', indexI)"
                    />
                  </div>
                  <div class="d-flex flex-wrap ga-4 mb-2">
                    <v-menu
                      v-model="itinerary.dateMenu"
                      :close-on-content-click="false"
                    >
                      <template #activator="{ props }">
                        <v-text-field
                          label="Date"
                          :rules="[(v) => !!v || 'Date is required']"
                          v-model="itinerary.date"
                          v-bind="props"
                          prepend-inner-icon="mdi-calendar"
                          readonly
                        />
                      </template>
                      <v-date-picker
                        v-bind="$attrs"
                        v-model="itinerary.date"
                        color="primary"
                      />
                    </v-menu>
                    <v-autocomplete
                      clearable
                      label="Select Port"
                      :items="portList"
                      item-title="name"
                      item-value="_id"
                      required
                      :rules="[(v) => !!v || 'Port is required']"
                      v-model="itinerary.port"
                    />
                  </div>
                  <div class="d-flex flex-warp ga-4 mb-2">
                    <v-text-field
                      v-model="itinerary.arrivalTime"
                      :active="itinerary.arrivalTimeMenu"
                      :focus="itinerary.arrivalTimeMenu"
                      label="Arrival Time"
                      prepend-inner-icon="mdi-clock-time-four-outline"
                      readonly
                    >
                      <v-menu
                        v-model="itinerary.arrivalTimeMenu"
                        :close-on-content-click="false"
                        activator="parent"
                        transition="scale-transition"
                      >
                        <v-time-picker
                          v-if="itinerary.arrivalTimeMenu"
                          v-model="itinerary.arrivalTime"
                          full-width
                        />
                      </v-menu>
                    </v-text-field>
                    <v-text-field
                      v-model="itinerary.departureTime"
                      :active="itinerary.departureTimeMenu"
                      :focus="itinerary.departureTimeMenu"
                      label="Departure Time"
                      prepend-inner-icon="mdi-clock-time-four-outline"
                      readonly
                    >
                      <v-menu
                        v-model="itinerary.departureTimeMenu"
                        :close-on-content-click="false"
                        activator="parent"
                        transition="scale-transition"
                      >
                        <v-time-picker
                          v-if="itinerary.departureTimeMenu"
                          v-model="itinerary.departureTime"
                          full-width
                        />
                      </v-menu>
                    </v-text-field>
                  </div>
                  <DocumentEditor
                    :key="docKey"
                    height="200px"
                    v-model="itinerary.description"
                    class="mb-4"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <!-- images  -->
      <v-col cols="12">
        <ImageUploader
          :value="formData.uploads"
          @update="(data) => onImageUpdate(data, 'images')"
          :image-list="formData.images"
          @update-image-link="(data) => onUpdateImageLink(data)"
        />
      </v-col>

      <v-col cols="12">
        <div class="text-right d-flex justify-end ga-4">
          <v-btn
            color="error"
            @click="router.push('/cruise/package')"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveShip"
          >
            Save
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import DocumentEditor from '@/components/DocumentEditor.vue'
import ImageUploader from './components/ImageUploader.vue'
import { useAppStore } from '@/store/app'

const store = useAppStore()
const route = useRoute()
const router = useRouter()
const formMode = computed(() => {
  return route?.query?.mode === 'form'
})
const docKey = ref(1)
const roomKey = ref(3)
const highlightsKey = ref(5)
const panel = ref([0])

const id = computed(() => {
  return route?.query?.id
})

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 10,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Description', key: 'description', align: 'start' },
    { title: 'Ship Line', key: 'ship_line', align: 'start' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

const onCreate = () => {
  router.push({ name: 'cruise-package', query: { mode: 'form' } })
}
const initialFormData = {
  name: null,
  description: '',
  currency: null,
  startDate: null,
  endDate: null,
  destinations: [],
  startLocation: null,
  endLocation: null,
  ship: null,
  highlights: [{ name: null, description: '', uploads: [], images: [] }],
  policies: [{ name: null, description: '' }],
  itinerary: [
    {
      dateMenu:false,
      date: null,
      port: null,
      description: '',
      arrivalTime: null,
      departureTime: null,
      arrivalTimeMenu: false,
      departureTimeMenu: false
    }
  ],
  uploads: [],
  images: [],
  
}

const formData = ref(initialFormData)
const form = ref()
const formValue = ref(false)
const currencyList = ref([])
const destinationList = ref([])
const portList = ref([])
const shipList = ref([])

const lines = ref([])
const room_groups = ref([])
const showForm = ref(false)
const startDateMenu = ref(false)
const endDateMenu = ref(false)

const onEdit = (item) => {
  router.push(`/cruise/package?mode=form&id=${item?._id}`)
}
const getLines = async () => {
  await axios.get('admin/cruise/ship-lines').then((res) => {
    if (res?.data?.length) {
      lines.value = res.data
    }
  })
}
const getRoomGroups = async () => {
  await axios.get('admin/cruise/room-groups').then((res) => {
    if (res?.data?.length) {
      room_groups.value = res.data
    }
  })
}
const getCurrencyList = async () => {
  await axios.get('misc/currencies').then((res) => {
    if (res?.data?.length) {
      currencyList.value = res.data
    }
  })
}
const getDestinationList = async () => {
  await axios.get('admin/cruise/destinations').then((res) => {
    if (res?.data?.length) {
      destinationList.value = res.data
    }
  })
}
const getPortList = async () => {
  await axios.get('admin/cruise/ports').then((res) => {
    if (res?.data?.length) {
      portList.value = res.data
    }
  })
}
const getShipList = async () => {
  await axios.get('admin/cruise/ships').then((res) => {
    if (res?.data?.length) {
      shipList.value = res.data
    }
  })
}
const addMore = async (name) => {
  if (name === 'itinerary') {
    formData.value[name].unshift({
      dateMenu:false,
      date: null,
      port: null,
      description: '',
      arrivalTime: null,
      departureTime: null,
      arrivalTimeMenu: false,
      departureTimeMenu: false
    })
  }
  else {
    formData.value[name].unshift({
      name: '',
      description: '',
      uploads: [],
      roomGroup: null,
      images: []
    })

  }
  docKey.value = docKey.value + 1
  roomKey.value = roomKey.value + 1
  highlightsKey.value = highlightsKey.value + 1
}
const RemoveItem = async (name, index) => {
  formData.value[name].splice(index, 1)
  docKey.value = docKey.value + 1
  roomKey.value = roomKey.value + 1
  highlightsKey.value = highlightsKey.value + 1
}
const removeUploads = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeUploads(item))
  } else if (obj && typeof obj === 'object') {
    const newObj = { ...obj }
    if ('uploads' in newObj) {
      delete newObj.uploads
    }
    for (const key in newObj) {
      newObj[key] = removeUploads(newObj[key])
    }
    return newObj
  } else {
    return obj
  }
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
  if (formData.value?.highlights?.length) {
    formData.value.highlights.forEach((highlight, index) => {
      if (highlight?.uploads?.length) {
        highlight.uploads.forEach((file) => {
          if (file instanceof File) {
            files.push(file)
            fileMapper.push({
              resource: `highlights_${index}`,
              name: file.name
            })
          }
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
    console.log(data)
    console.log(files)
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
const saveShip = async () => {
  form.value.validate()
  if (form.value.isValid) {
    const payload = getDataPayload()
    const response = id?.value
      ? await axios.patch(`admin/cruise/packages/${id.value}`, payload)
      : await axios.post('admin/cruise/packages', payload)
    if (response.data) {
      store.showSnackbar('Successfully Saved')
      router.push({ name: 'cruise-ship' })
    }
  }
}
const onImageUpdate = (images) => {
  formData.value.uploads = images
}
const onHighlightsImageUpdate = (images, index) => {
  formData.value.highlights[index].uploads = images
}
const loadItems = async () => {
  await axios.get('admin/cruise/ships').then((res) => {
    if (res?.data?.length) {
      table_data.value.serverItems = res?.data
      table_data.value.totalItems = res?.data?.length
    }
  })
}
const confirmDelete = async () => {
  await axios
    .delete(`admin/cruise/packages/${store.details?._id}`)
    .then(async () => {
      store.showSnackbar('Successfully Deleted')
      await loadItems()
      store.closeDialog()
    })
}
const onDelete = (item) => {
  store.setDetails(item)
  const dialogModal = {
    title: 'Delete Package',
    content: `Are you sure to delete this Package?`,
    confirmText: 'Delete',
    formComponents: { fields: [] },
    confirmFunction: confirmDelete
  }
  store.showDialog(dialogModal)
}
const onUpdateImageLink = (data) => {
  formData.value.images = [...data]
}
const onUpdateImageLinks = (key, index, data) => {
  formData.value[key][index].images = data
}
onBeforeMount(async () => {
  await getLines()
  await getRoomGroups()
  await loadItems()
  await getCurrencyList()
  await getDestinationList()
  await getPortList()
  await getShipList()
  // if (
  //   id.value &&
  //   table_data.value.serverItems?.find((x) => x?._id === id.value)
  // ) {
  //   formData.value = table_data.value.serverItems?.find(
  //     (x) => x?._id === id.value
  //   )
  //   formData.value.shipLine = formData.value.shipLine._id
  //   formData.value.rooms.forEach((element) => {
  //     element.roomGroup = element.roomGroup._id
  //   })
  // }
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
