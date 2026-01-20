<template>
  <v-row class="mb-4 d-flex justify-end">
    <v-col
      cols="12"
      md="3"
    >
      <v-select
        label="Filter Currency"
        :items="['Enabled', 'Disabled']"
        v-model="table_data.filter"
        @update:model-value="filterList"
      />
    </v-col>
    <v-col
      cols="12"
      md="3"
    >
      <v-text-field
        label="Search"
        v-model="table_data.search"
      />
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
    <template #item.action="{ item }">
      <div
        v-if="item?.code !== 'AED'"
        class="d-flex ga-3"
      >
        <v-icon
          class="cursor-pointer"
          @click="onEdit(item)"
          icon="mdi-pencil-box"
        />
      </div>
    </template>
  </v-data-table>
  <v-dialog
    v-model="showDialog"
    width="auto"
  >
    <v-card
      width="800"
      prepend-icon="mdi-update"
      text="Update Currency"
      title="Update Currency"
    >
      <v-card-text>
        <v-form ref="formRef">
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                readonly
                label="Name"
                v-model="form.name"
                :clearable="false"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                readonly
                label="code"
                v-model="form.code"
                :clearable="false"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                readonly
                label="symbol"
                v-model="form.symbol"
                :clearable="false"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                label="conversionRate"
                v-model="form.conversionRate"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-switch
                label="Enabled"
                v-model="form.enabled"
                color="primary"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="hideDialog"
          variant="outlined"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="elevated"
          color="primary"
          @click="updateCurrency"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useAppStore } from '@/store/app'

const store = useAppStore()
const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 10,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Symbol', key: 'symbol', align: 'start' },
    { title: 'Conversion Rate', key: 'conversionRate', align: 'start' },
    { title: 'Code', key: 'code', align: 'start' },
    { title: 'Enabled', key: 'enabled', align: 'start' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ],
  serverObjects: {},
  serverResponse: [],
  filter: null
})
const form = ref({
  code: '',
  conversionRate: null,
  decimalDigits: 2,
  enabled: false,
  name: '',
  namePlural: '',
  rounding: 0,
  symbol: '',
  symbolNative: '',
  _id: ''
})
const showDialog = ref(false)
const formRef = ref(null)
const onEdit = async (item) => {
  form.value = {
    ...item
  }
  showDialog.value = true
}
const fetchList = async () => {
  await axios.get('/admin/misc/currencies').then((response) => {
    table_data.value.serverResponse = response.data
    table_data.value.serverItems = response.data
    table_data.value.totalItems = response.data.length
    if (table_data.value.filter) {
      filterList(table_data.value.filter)
    }
  })
}
const filterList = async (data) => {
  if (!data) {
    await fetchList()
  }
  if (data === 'Enabled') {
    table_data.value.serverItems = table_data.value.serverResponse.filter(
      (item) => item.enabled
    )
  } else if (data === 'Disabled') {
    table_data.value.serverItems = table_data.value.serverResponse.filter(
      (item) => !item.enabled
    )
  }
}
const hideDialog = () => {
  showDialog.value = false
  form.value = {
    code: '',
    conversionRate: null,
    decimalDigits: 2,
    enabled: false,
    name: '',
    namePlural: '',
    rounding: 0,
    symbol: '',
    symbolNative: '',
    _id: ''
  }
}
const updateCurrency = async () => {
  if (!form.value.conversionRate) {
    store.showSnackbar('Conversion rate is required', 'error')
    return
  }
  try {
    const rate = Number(form.value.conversionRate)
    if (isNaN(rate)) {
      throw new Error('Conversion rate must be a number')
    }
    form.value.conversionRate = rate
  } catch (error) {
    store.showSnackbar('Conversion rate must be a number', 'error')
    return
  }
  await axios
    .patch(`/admin/misc/currencies/${form.value._id}`, form.value)
    .then(async () => {
      store.showSnackbar('Currency updated successfully', 'success')
      await fetchList()
      hideDialog()
    })
}
onMounted(async () => {
  await fetchList()
})
</script>
