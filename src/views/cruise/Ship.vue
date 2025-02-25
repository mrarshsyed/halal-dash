<template>
  <v-row class="mb-4" v-if="!formMode && !detailsMode">
    <v-col cols="12" md="8">
      <v-text-field
        v-model="searchKeyword"
        placeholder="Enter search here ..."
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-btn
        v-if="!store.isRoleManager()"
        @click="onCreate"
        block
        color="primary"
      >
        + Add New Ship
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table-server
        density="compact"
        v-model:search="searchKeyword"
        v-model:items-per-page="table_data.itemsPerPage"
        :headers="table_data.headers"
        :items-length="table_data.totalItems"
        :items="table_data.serverItems"
        :items-per-page-options="table_data.itemsPerPageOption"
        v-model:page="table_data.page"
        show-current-page
        @update:options="loadItems"
        item-value="name"
      >
        <template #item.name="{ item }">
          {{ item?.name }}
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
        <template #item.ship_line="{ item }">
          {{ item?.shipLine?.name ?? '-' }}
        </template>
        <template #item.action="{ item }">
          <div class="d-flex ga-3">
            <v-tooltip
              text="Ratings"
              location="top"
              v-if="store.hasPermission(permissions.cruiseUpdateHalalRatings)"
            >
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  @click="onRatingIconClick(item)"
                  icon="mdi-star"
                />
              </template>
            </v-tooltip>
            <v-tooltip
              v-if="store.hasPermission(permissions.cruiseUpdateManager)"
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
              v-if="store.hasPermission(permissions.cruiseUpdateManager)"
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
            <v-icon
              v-if="!store.isRoleManager()"
              class="cursor-pointer"
              @click="onDetails(item)"
              icon="mdi-eye"
            />
            <v-icon
              v-if="!store.isRoleManager()"
              class="cursor-pointer"
              @click="onEdit(item)"
              icon="mdi-pencil-box"
            />
            <v-icon
              v-if="!store.isRoleManager()"
              @click="onDelete(item)"
              class="cursor-pointer"
            >
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
          @click="router.push('/cruise/ship')"
        />
        <h3 class="mt-4">
          {{ id ? 'Update Ship' : 'Create New Ship' }}
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
          label="Select Line"
          :items="lines"
          item-title="name"
          item-value="_id"
          required
          :rules="[(v) => !!v || `Line is required`]"
          v-model="formData.shipLine"
        />
      </v-col>

      <v-col cols="12">
        <p>Ship Info</p>
        <DocumentEditor height="200px" v-model="formData.description" />
      </v-col>
      <v-col cols="12">
        <ImageUploader
          :value="formData.uploads"
          @update="(data) => onImageUpdate(data, 'images')"
          :image-list="formData.images"
          @update-image-link="(data) => onUpdateImageLink(data)"
        />
      </v-col>
      <!-- facts -->
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel title="Ship Facts">
            <v-expansion-panel-text>
              <v-row>
                <v-col
                  v-for="(value, key) in formData.facts"
                  :key="key"
                  cols="12"
                  sm="4"
                  md="3"
                >
                  <v-text-field
                    v-model="formData.facts[key]"
                    :label="formatLabel(key)"
                    outlined
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <!-- rooms -->
      <v-col cols="12">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel title="Rooms">
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" class="text-right">
                  <v-btn color="primary" @click="addMore('rooms')">
                    + Add More
                  </v-btn>
                </v-col>
                <v-col
                  v-for="(room, index) in formData.rooms"
                  :key="index"
                  cols="12"
                  class="border mb-4 rounded"
                >
                  <div class="text-right mb-4" v-if="formData.rooms.length > 1">
                    <v-btn
                      icon="mdi-delete"
                      color="error"
                      size="x-small"
                      @click="RemoveItem('rooms', index)"
                    />
                  </div>
                  <div class="d-flex flex-wrap ga-4">
                    <v-autocomplete
                      clearable
                      label="Select Room Group"
                      :items="room_groups"
                      item-title="name"
                      item-value="_id"
                      required
                      :rules="[(v) => !!v || `Room Group is required`]"
                      v-model="room.roomGroup"
                    />
                    <v-text-field
                      v-model="room.name"
                      label="Name"
                      outlined
                      :rules="[(v) => !!v || `Name is required`]"
                    />
                  </div>
                  <DocumentEditor
                    :key="docKey"
                    height="200px"
                    v-model="room.description"
                    class="mb-4"
                  />
                  <ImageUploader
                    :key="roomKey"
                    :value="room.uploads"
                    @update="(data) => onRoomImageUpdate(data, index)"
                    @update-image-link="
                      (data) => onUpdateImageLinks('rooms', index, data)
                    "
                    :image-list="room?.images ?? []"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <!-- highlights -->
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel title="What's Included?">
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" class="text-right">
                  <v-btn color="primary" @click="addMore('highlights')">
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
                    @update-image-link="
                      (data) => onUpdateImageLinks('highlights', indexH, data)
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
      <v-col cols="12">
        <div class="text-right d-flex justify-end ga-4">
          <v-btn color="error" @click="router.push('/cruise/ship')">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="saveShip"> Save </v-btn>
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
      @click="router.push('/cruise/ship')"
    />
    <p class="mb-4">Ship Name : {{ detailsData?.name }}</p>
    <p class="mb-4">Ship Line : {{ detailsData?.shipLine?.name }}</p>
    <p class="mb-2">Description :</p>
    <div class="mb-4" v-html="detailsData?.description" />
    <p class="mb-2">Images :</p>
    <v-row class="mb-4">
      <v-col
        cols="12"
        sm="2"
        md="3"
        lg="4"
        xl="5"
        xxl="6"
        v-for="(i, index) in detailsData?.images"
        :key="index"
      >
        <v-img cover :src="i" height="150" class="rounded" />
      </v-col>
    </v-row>
    <p class="mb-2">Ship Facts :</p>
    <v-row class="mb-4">
      <v-col
        v-for="(value, key) in detailsData?.facts"
        :key="key"
        cols="12"
        sm="4"
        md="3"
      >
        <p>{{ formatLabel(key) }} : {{ detailsData.facts[key] }}</p>
      </v-col>
    </v-row>
    <p class="mb-2">Rooms :</p>
    <v-row class="mb-4">
      <v-col
        v-for="(room, key) in detailsData?.rooms"
        :key="key"
        cols="12"
        sm="6"
      >
        <v-card>
          <v-card-text>
            <p>Room Group : {{ room?.roomGroup?.name }}</p>
            <p class="mb-4">Name : {{ room?.name }}</p>
            <p class="mb-2">Description :</p>
            <div class="mb-4" v-html="room?.description" />
            <v-row>
              <v-col
                cols="12"
                sm="6"
                v-for="(i, index) in room?.images"
                :key="index"
              >
                <v-img cover :src="i" height="150" class="rounded" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <p class="mb-2">What's included? :</p>
    <v-row class="mb-4">
      <v-col
        v-for="(room, key) in detailsData?.highlights"
        :key="key"
        cols="12"
        sm="6"
      >
        <v-card>
          <v-card-text>
            <p class="mb-4">Name : {{ room?.name }}</p>
            <p class="mb-2">Description :</p>
            <div class="mb-4" v-html="room?.description" />
            <v-row>
              <v-col
                cols="12"
                sm="6"
                v-for="(i, index) in room?.images"
                :key="index"
              >
                <v-img cover :src="i" height="150" class="rounded" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <v-dialog v-model="assignRatingDialogShow">
    <v-card>
      <v-card-title>Select Rating</v-card-title>
      <v-card-text>
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
        <v-btn color="primary" @click="onAssignManager"> Assign Manager </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import DocumentEditor from '@/components/DocumentEditor.vue'
import ImageUploader from './components/ImageUploader.vue'
import { useAppStore } from '@/store/app'
import { permissions } from '@/config/userRoutes'

const store = useAppStore()
const route = useRoute()
const router = useRouter()
const formMode = computed(() => {
  return route?.query?.mode === 'form'
})
const detailsMode = computed(() => {
  return route?.query?.mode === 'details'
})
const docKey = ref(1)
const roomKey = ref(3)
const highlightsKey = ref(5)
const panel = ref([0])
const managerForm = ref()
const selectedManager = ref(null)

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
    { title: 'Rating(%)', key: 'rating', align: 'start' },
    { title: 'Manager Name', key: 'manager_name', align: 'start' },
    { title: 'Manager Email', key: 'manager', align: 'start' },
    { title: 'Ship Line', key: 'ship_line', align: 'start' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 50, title: '50' },
    { value: 80, title: '80' }
  ]
})

const onCreate = () => {
  router.push({ name: 'cruise-ship', query: { mode: 'form' } })
}
const initialFormData = {
  name: null,
  description: '',
  shipLine: null,
  uploads: [],
  images: [],
  facts: {
    maidenVoyage: '',
    registry: '',
    grossTonnage: '',
    builtIn: '',
    beam: '',
    maximumSpeed: '',
    shipLength: '',
    stateroomsSuites: '',
    passengerCapacity: '',
    numberOfCrews: '',
    crewNationality: '',
    diningRestaurants: '',
    numberOfDecks: '',
    officersNationality: '',
    barsLounges: '',
    lounge: '',
    nonSmokingShip: '',
    nonSmokingDining: '',
    spa: '',
    fitnessCenter: '',
    elevators: '',
    kidsFriendly: '',
    rockClimbing: '',
    waterSlide: '',
    wheelchairAccessible: ''
  },
  highlights: [
    {
      name: 'Food & Dining',
      description: '',
      uploads: [],
      images: []
    },
    {
      name: 'Accommodation',
      description: '',
      uploads: [],
      images: []
    },
    {
      name: 'Onboard Activities and Entertainment',
      description: '',
      uploads: [],
      images: []
    }
  ],
  rooms: [
    {
      roomGroup: null,
      name: null,
      description: '',
      uploads: [],
      images: []
    }
  ]
}
const formData = ref(initialFormData)
const form = ref()
const formValue = ref(false)
const lines = ref([])
const room_groups = ref([])
const showForm = ref(false)
const ratings = ref([])
const selectedRatings = ref([])
const assignRatingDialogShow = ref(false)
const assignManagerDialogShow = ref(false)
const managerSearch = ref('')
const detailsData = ref({})
const searchKeyword = ref('')

const onRatingIconClick = async (item) => {
  store.setDetails(item)
  if (item?.halal_ratings?.length) {
    selectedRatings.value = item?.halal_ratings
  }
  assignRatingDialogShow.value = true
}

const onEdit = (item) => {
  router.push(`/cruise/ship?mode=form&id=${item?._id}`)
}
const onDetails = (item) => {
  router.push(`/cruise/ship?mode=details&id=${item?._id}`)
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
const formatLabel = (key) => {
  if (key === 'barsLounges') {
    return 'Bar/Lounge'
  }
  if (key === 'stateroomsSuites') {
    return 'No. of Suits'
  }

  return (
    key &&
    key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
      return str.toUpperCase()
    })
  )
}

const addMore = async (name) => {
  formData.value[name].unshift({
    name: '',
    description: '',
    uploads: [],
    roomGroup: null,
    images: []
  })
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
  if (formData.value?.rooms?.length) {
    formData.value.rooms.forEach((room, index) => {
      if (room?.uploads?.length) {
        room.uploads.forEach((file) => {
          if (file instanceof File) {
            files.push(file)
            fileMapper.push({
              resource: `rooms_${index}`,
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
      ? await axios.patch(`admin/cruise/ships/${id.value}`, payload)
      : await axios.post('admin/cruise/ships', payload)
    if (response.data) {
      store.showSnackbar('Successfully Saved')
      router.push({ name: 'cruise-ship' })
    }
  }
}
const onImageUpdate = (images) => {
  formData.value.uploads = images
}
const onRoomImageUpdate = (images, index) => {
  formData.value.rooms[index].uploads = images
}
const onHighlightsImageUpdate = (images, index) => {
  formData.value.highlights[index].uploads = images
}
const loadItems = async () => {
  let payload = {
    page: table_data.value.page,
    perPage: table_data.value.itemsPerPage,
    name: searchKeyword.value
  }
  await axios
    .get('admin/cruise/ships', {
      params: {
        ...payload
      }
    })
    .then((res) => {
      table_data.value.serverItems = res?.data?.data
      table_data.value.totalItems = res?.data?.data.length
    })
}
const managers = computed(() => {
  return store.managers
})
const confirmDelete = async () => {
  await axios
    .delete(`admin/cruise/ships/${store.details?._id}`)
    .then(async () => {
      store.showSnackbar('Successfully Deleted')
      await loadItems()
      store.closeDialog()
    })
}
const onDelete = (item) => {
  store.setDetails(item)
  const dialogModal = {
    title: 'Delete Ship',
    content: `Are you sure to delete this Ship?`,
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
const sumOfSelectedRatings = computed(() => {
  return selectedRatings.value.reduce((total, r) => total + r.rating, 0)
})
const sumOfTotalRating = computed(() => {
  return ratings.value.reduce((total, r) => total + r.rating, 0)
})
const ratingPercentage = computed(() => {
  return Math.ceil((sumOfSelectedRatings.value / sumOfTotalRating.value) * 100)
})
const onAssignRating = async () => {
  const ids = selectedRatings.value?.map((x) => {
    return x._id
  })
  axios
    .patch(`admin/cruise/ships/${store.details?._id}/update-halal-ratings`, {
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
const onManagerSearch = (data) => {
  managerSearch.value = data
}
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
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
              [permissions.cruiseShip,permissions.cruiseUpdateHalalRatings]
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
    .patch(`admin/cruise/ships/${store.details?._id}/update-manager`, {
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
const handelAssignManagerIconClick = (item) => {
  store.setDetails(item)
  if (item?.manager?._id) {
    selectedManager.value = item?.manager
  }
  assignManagerDialogShow.value = true
}
const removeManager = async () => {
  await axios
    .patch(`admin/cruise/ships/${store.details?._id}/update-manager`, {
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

onBeforeMount(async () => {
  if (store.hasPermission(permissions.userList)) {
    await axios.get('admin/users').then((res) => {
      if (res?.data?.length) {
        const managerList = res?.data?.filter((x) => x?.role === 'manager')
        store.setManager(managerList)
      }
    })
  }
  if (store.hasPermission(permissions.cruiseUpdateHalalRatings)) {
    await axios.get('admin/cruise-halal-ratings').then((res) => {
      if (res?.data?.length) {
        ratings.value = res?.data
      }
    })
  }
  await getLines()
  await getRoomGroups()
  if (id.value) {
    const details = await axios.get(`admin/cruise/ships/${id.value}`)
    if (details?.data?._id) {
      if (formMode.value) {
        formData.value = { ...details?.data }
        formData.value.shipLine = formData.value.shipLine._id
        formData.value.rooms.forEach((element) => {
          element.roomGroup = element.roomGroup._id
        })
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
