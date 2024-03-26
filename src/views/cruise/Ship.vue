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
        + Add New Ship
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
    v-else
  >
    <v-row>
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
      <v-col
        cols="12"
        md="6"
      >
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
        <p>Description</p>
        <DocumentEditor
          height="200px"
          v-model="formData.description"
        />
      </v-col>
      <v-col cols="12">
        <ImageUploader
          :value="formData.uploads"
          @update="(data) => onImageUpdate(data, 'images')"
          :images="formData.images"
          @update-image-link="(data) => onUpdateImageLink(data)"
        />
      </v-col>
      <!-- facts -->
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel title="Facts">
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
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    @click="addMore('rooms')"
                  >
                    + Add More
                  </v-btn>
                </v-col>
                <v-col
                  v-for="(room, index) in formData.rooms"
                  :key="index"
                  cols="12"
                  class="border mb-4 rounded"
                >
                  <div
                    class="text-right mb-4"
                    v-if="formData.rooms.length > 1"
                  >
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
                    @update-image-link="(data) => onUpdateImageLinks('room', index, data)"
                    :images="room?.images ?? []"
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
                    @update-image-link="(data) => onUpdateImageLinks('highlights', indexH, data)"
                    :images="highlight?.images ?? []"
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
          <v-btn
            color="error"
            @click="router.push('/cruise/ship')"
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import DocumentEditor from '@/components/DocumentEditor.vue'
import ImageUploader from './components/ImageUploader.vue'
import { useAppStore } from '@/store/app';


const store = useAppStore();
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
    { name: 'Food & Dining', description: 'Food and Dining description', uploads: [], images: [] },
    // {
    //   name: 'Accommodation',
    //   description: 'Accommodation description', uploads: []
    // },
    // {
    //   name: 'Onboard Activities and Entertainment',
    //   description: 'Onboard Activities and Entertainment description', uploads: []
    // }
  ],
  rooms: [
    { roomGroup: null, name: 'Room 1', description: 'Room 1 description', uploads: [], images: [] },
  ]
}
const formData = ref(initialFormData)
const form = ref()
const formValue = ref(false)
const lines = ref([])
const room_groups = ref([])

const onEdit = (item) => {
  router.push(`/cruise/ship?mode=form&id=${item?._id}`)
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
    return obj.map(item => removeUploads(item));
  } else if (obj && typeof obj === 'object') {
    const newObj = { ...obj };
    if ('uploads' in newObj) {
      delete newObj.uploads;
    }
    for (const key in newObj) {
      newObj[key] = removeUploads(newObj[key]);
    }
    return newObj;
  } else {
    return obj;
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
          name: file.name,
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
              name: file.name,
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
              name: file.name,
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
    console.log(data);
    console.log(files);
    let formdata = new FormData();
    formdata.append('data', JSON.stringify(data));
    formdata.append("uploads", files)
    return formdata
  } catch (error) {
    console.log(error);
  }
}
const saveShip = async () => {
  form.value.validate();
  if (form.value.isValid) {
    const payload = getDataPayload();
    const response = id?.value ? await axios.patch(`admin/cruise/ships/${id.value}`, payload) : await axios.post('admin/cruise/ships', payload)
    if (response.data) {
      store.showSnackbar("Successfully Saved")
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
  await axios
    .get('admin/cruise/ships',)
    .then((res) => {
      if (res?.data?.length) {
        table_data.value.serverItems = res?.data
        table_data.value.totalItems = res?.data?.length
      }
    })
}

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
onMounted(async () => {
  await getLines()
  await getRoomGroups()
  await loadItems()
  if (id.value && table_data.value.serverItems?.find((x) => x?._id === id.value)) {
    formData.value = table_data.value.serverItems?.find((x) => x?._id === id.value)
    formData.value.shipLine = formData.value.shipLine._id
    formData.value.rooms.forEach(element => {
      element.roomGroup = element.roomGroup._id
    });
    console.log(formData.value);
  }
})

const onUpdateImageLink = (data) => {
  formData.value.images = data
}
const onUpdateImageLinks = (key, index, data) => {
  formData.value[key][index].images = data
}
</script>

<style scoped>
.imageDelete {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
