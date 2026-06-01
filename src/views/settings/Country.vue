<template>
  <div>
    <v-text-field v-model="search" placeholder="Enter search here ..." class="mb-4" />
    <v-data-table
      density="compact"
      :headers="headers"
      :items="filteredItems()"
      item-value="_id"
    >
      <template #item.image="{ item }">
        <v-img v-if="item?.image" :src="item?.image" height="30" width="30" cover class="icon-preview" />
      </template>
      <template #item.name="{ item }">
        {{ item?.country?.name }}
      </template>
      <template #item.region="{ item }">
        {{ item?.region?.name }}
        <v-chip v-if="item?.region?.holidayIndex > 0" size="x-small" class="ml-1">{{ item?.region?.holidayIndex }}</v-chip>
      </template>
      <template #item.subRegion="{ item }">
        {{ item?.subRegion?.name }}
        <v-chip v-if="item?.subRegion?.holidayIndex > 0" size="x-small" class="ml-1">{{ item?.subRegion?.holidayIndex }}</v-chip>
      </template>
      <template #item.action="{ item }">
        <v-icon class="cursor-pointer" @click="onEdit(item)" icon="mdi-pencil-box" />
      </template>
    </v-data-table>

    <v-dialog v-model="dialog.show" max-width="970" persistent>
      <v-card :title="`Update Image — ${dialog.countryName}`">
        <v-card-text>
          <v-file-input
            v-model="dialog.file"
            label="Image"
            prepend-inner-icon="mdi-paperclip"
            :prepend-icon="null"
            accept="image/*"
            variant="outlined"
          />
          <v-row v-if="dialog.file || dialog.existingImage">
            <v-col cols="12" sm="6" md="4" class="pa-4">
              <div style="position: relative">
                <v-img
                  :src="dialog.file ? getPreviewUrl(dialog.file) : dialog.existingImage"
                  height="250"
                  class="rounded icon-preview"
                  alt="image"
                />
                <v-btn
                  @click="dialog.file = null; dialog.existingImage = null"
                  icon="mdi-delete"
                  class="imageDelete"
                  color="error"
                  size="x-small"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-4 pr-4">
          <v-spacer />
          <v-btn color="error" variant="outlined" @click="dialog.show = false">Close</v-btn>
          <v-btn color="primary" variant="elevated" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.imageDelete {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/app'
import axios from '@/plugins/axios'

const search = ref('')
const items = ref([])
const store = useAppStore()

const dialog = ref({
  show: false,
  countryCode: null,
  countryName: '',
  regionId: null,
  subRegionId: null,
  existingImage: null,
  file: null
})

const filteredItems = () => {
  if (!search.value) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter((item) =>
    item?.country?.name?.toLowerCase().includes(q) ||
    item?.region?.name?.toLowerCase().includes(q) ||
    item?.subRegion?.name?.toLowerCase().includes(q)
  )
}

const headers = [
  { title: 'Image', key: 'image', align: 'start' },
  { title: 'Country', key: 'name', align: 'start' },
  { title: 'Region', key: 'region', align: 'start' },
  { title: 'Sub Region', key: 'subRegion', align: 'start' },
  { title: 'Action', key: 'action', align: 'start' }
]

const loadItems = async () => {
  await axios.get('admin/misc/countries').then((res) => {
    if (res?.data?.length) {
      items.value = res?.data
    }
  })
}

const getPreviewUrl = (file) => {
  const f = Array.isArray(file) ? file[0] : file
  return f ? URL.createObjectURL(f) : null
}

const onEdit = (item) => {
  dialog.value.countryCode = item?.country?.code
  dialog.value.countryName = item?.country?.name
  dialog.value.regionId = item?.region?._id
  dialog.value.subRegionId = item?.subRegion?._id
  dialog.value.existingImage = item?.image ?? null
  dialog.value.file = null
  dialog.value.show = true
}

const save = async () => {
  const file = Array.isArray(dialog.value.file) ? dialog.value.file[0] : dialog.value.file
  if (!file) {
    store.showSnackbar('Please select an image', 'error')
    return
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('data', JSON.stringify({
    region: dialog.value.regionId,
    subRegion: dialog.value.subRegionId
  }))

  const response = await axios.patch(`admin/misc/countries/${dialog.value.countryCode}`, formData)
  if (response?.status === 200) {
    store.showSnackbar('Image updated successfully')
    await loadItems()
    dialog.value.show = false
  }
}

onMounted(async () => {
  await loadItems()
})
</script>
