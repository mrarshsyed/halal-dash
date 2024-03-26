<template>
  <v-row class="mb-4" v-if="!formMode">
    <v-col cols="12" md="8">
      <v-text-field v-model="table_data.search" placeholder="Enter search here ..." />
    </v-col>
    <v-col cols="12" md="4">
      <v-btn @click="onCreate" block color="primary">
        + Add New Ship
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table density="compact" :items-per-page="table_data.itemsPerPage" :headers="table_data.headers"
        :items-length="table_data.totalItems" :items="table_data.serverItems" :search="table_data.search"
        :items-per-page-options="table_data.itemsPerPageOption" :page="table_data.page" show-current-page>
        <template #item.name="{ item }">
          {{ item?.name }}
        </template>
        <template #item.description="{ item }">
          {{ item?.description ?? '-' }}
        </template>
        <template #item.action="{ item }">
          <div class="d-flex ga-3">
            <v-icon class="cursor-pointer" @click="onEdit(item)" icon="mdi-pencil-box" />
            <v-icon class="cursor-pointer" @click="onDelete(item)" icon="mdi-delete" />
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <v-form v-model="formValue" ref="form" v-else>
    <v-row>
      <v-col cols="12">
        <v-btn size="x-small" color="primary" icon="mdi-arrow-left" @click="router.push('/cruise/ship')" />
        <h3 class="mt-4">
          {{ id ? 'Update Ship' : 'Create New Ship' }}
        </h3>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="formData.name" label="Name" required :rules="[(v) => !!v || 'Name is required']" />
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete clearable label="Select Line" :items="lines" item-title="name" item-value="_id" required
          :rules="[(v) => !!v || `Line is required`]" v-model="formData.shipLine" />
      </v-col>

      <v-col cols="12">
        <p>Description</p>
        <DocumentEditor height="200px" v-model="formData.description" />
      </v-col>
      <!-- facts -->
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel title="Facts">
            <v-expansion-panel-text>
              <v-row>
                <v-col v-for="(value, key) in formData.facts" :key="key" cols="12" sm="4" md="3">
                  <v-text-field v-model="formData.facts[key]" :label="formatLabel(key)" outlined />
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
                <v-col v-for="(room, index) in formData.rooms" :key="index" cols="12" class="border mb-4 rounded">
                  <div class="text-right mb-4">
                    <v-btn icon="mdi-delete" color="error" size="x-small" @click="RemoveItem('rooms', index)" />
                  </div>
                  <div class="d-flex flex-wrap ga-4">
                    <v-autocomplete clearable label="Select Room Group" :items="room_groups" item-title="name"
                      item-value="_id" required :rules="[(v) => !!v || `Room Group is required`]"
                      v-model="room.room_groups" />
                    <v-text-field v-model="room.name" label="Name" outlined />
                  </div>
                  <DocumentEditor :key="docKey" height="200px" v-model="room.description" />
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
                <v-col cols="12" class="text-right">
                  <v-btn color="primary" @click="addMore('highlights')">
                    + Add More
                  </v-btn>
                </v-col>
                <v-col v-for="(highlight, index) in formData.highlights" :key="index" cols="12"
                  class="border mb-4 rounded">
                  <div class="text-right mb-4">
                    <v-btn icon="mdi-delete" color="error" size="x-small" @click="RemoveItem('highlights', index)" />
                  </div>
                  <v-text-field v-model="highlight.name" label="Name" outlined />
                  <DocumentEditor :key="docKey" height="200px" v-model="highlight.description" />
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
          <v-btn color="primary" @click="saveShip">
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
import store from '@/store';

const route = useRoute()
const router = useRouter()
const formMode = computed(() => {
  return route?.query?.mode === 'form'
})
const docKey = ref(0)
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
    { name: 'Food & Dining', description: 'Food and Dining description' },
    {
      name: 'Accommodation',
      description: 'Accommodation description'
    },
    {
      name: 'Onboard Activities and Entertainment',
      description: 'Onboard Activities and Entertainment description'
    }
  ],
  rooms: [
    { room_groups: null, name: 'Room 1', description: 'Room 1 description' },
  ]
}
const formData = ref(initialFormData)
const form = ref()
const formValue = ref(false)
const lines = ref([])
const room_groups = ref([])
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
    description: ''
  })
  docKey.value = docKey.value + 1
}
const RemoveItem = async (name, index) => {
  formData.value[name].splice(index, 1)
}

const saveShip = async () => {
  form.value.validate();
  if (form.value.isValid) {
    console.log(formData.value);
    let data = { ...formData.value }
    const formdata = new FormData()
    formdata.append('data', JSON.stringify(data))
    const response = id?.value ? await axios.put(`admin/cruise/ship/${id.value}`, formdata) : await axios.post('admin/cruise/ship', formdata)
    if (response.data) {
      store.showSuccess("Successfully Saved")
      router.push({ name: 'cruise-ship' })
    }
  }

}

onMounted(async () => {
  await getLines()
  await getRoomGroups()
})
</script>

<style lang="scss" scoped></style>
