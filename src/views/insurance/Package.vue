<template>
  <v-row
    class="mb-4"
    v-if="!formMode && !detailsMode"
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
        v-if="!store.isRoleManager()"
        @click="onCreate"
        block
        color="primary"
      >
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
        <template #item.insuranceName="{ item }">
          {{ item?.insuranceName?.name }}
        </template>
        <template #item.insurancePolicy="{ item }">
          {{ item?.insurancePolicy?.name }}
        </template>
        <template #item.insuranceType="{ item }">
          {{ item?.insuranceType?.name }}
        </template>
        <template #item.insuranceArea="{ item }">
          {{ item?.insuranceArea?.name }}
        </template>
        <template #item.travelerType="{ item }">
          {{ item?.travelerType?.name }}
        </template>
        <template #item.ageGroup="{ item }">
          {{ item?.prices[0]?.ageStart }} - {{ item?.prices[0]?.ageEnd }}
        </template>
        <template #item.tripDuration="{ item }">
          Up to {{ item?.prices[0]?.durationEnd }} days
        </template>
        <template #item.insuranceRestType="{ item }">
          {{ item?.insuranceRestType?.name }}
        </template>
        <template #item.tripType="{ item }">
          {{ item?.tripType }}
        </template>
        <template #item.terrorismExtension="{ item }">
          {{ item?.terrorismExtension ? 'Yes' : 'No' }}
        </template>
        <template #item.price="{ item }">
          {{ item?.prices[0]?.priceIncludingVat }}
        </template>
        <template #item.createdAt="{ item }">
          {{
            item?.createdAt
              ? format(new Date(item?.createdAt), 'dd MMM yyyy')
              : '-'
          }}
        </template>
        <template #item.action="{ item }">
          <div class="d-flex ga-3">
            <!-- <v-icon
              class="cursor-pointer"
              @click="onDetails(item)"
              icon="mdi-eye"
            /> -->
            <v-icon
              class="cursor-pointer"
              @click="onEdit(item)"
              icon="mdi-pencil-box"
            />
            <v-icon
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
  <v-form
    v-model="formValue"
    ref="form"
    v-else-if="formMode && !detailsMode"
  >
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
      <v-col cols="12">
        <v-text-field
          v-model="formData.name"
          label="Package Name"
          required
          :rules="[(v) => !!v || 'Package Name is required']"
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Type"
          :items="insuranceTypeList"
          required
          :rules="[(v) => !!v || 'Type is required']"
          v-model="formData.insuranceType"
          chips
          item-title="name"
          item-value="_id"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Insurance Name"
          :items="insuranceNameList"
          required
          :rules="[(v) => !!v || 'Insurance Name is required']"
          v-model="formData.insuranceName"
          chips
          item-title="name"
          item-value="_id"
          :disabled="!formData.insuranceType"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Insurance Policy"
          :items="insurancePolicyList"
          required
          :rules="[(v) => !!v || 'Insurance Policy is required']"
          v-model="formData.insurancePolicy"
          chips
          item-title="name"
          item-value="_id"
          :disabled="!formData.insuranceName"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Insurance Area"
          :items="insuranceAreaList"
          required
          :rules="[(v) => !!v || 'Insurance Area is required']"
          v-model="formData.insuranceArea"
          chips
          item-title="name"
          item-value="_id"
          :disabled="!formData.insurancePolicy"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Rest Type"
          :items="insuranceRestTypeList"
          required
          :rules="[(v) => !!v || 'Insurance Rest Type is required']"
          v-model="formData.insuranceRestType"
          chips
          item-title="name"
          item-value="_id"
          :disabled="!formData.insuranceArea"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Traveler Type"
          :items="travelerTypeList"
          required
          :rules="[(v) => !!v || 'Traveler Type is required']"
          v-model="formData.travelerType"
          chips
          return-object
          item-title="name"
          item-value="_id"
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="formData.tripType"
          label="Trip Type"
          :items="[
            { title: 'Single', value: 'single' },
            { title: 'Double', value: 'double' },
            { title: 'Multiple', value: 'multiple' }
          ]"
          required
          :rules="[(v) => !!v || 'Trip Type is required']"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="formData.terrorismExtension"
          label="Terrorism Extension"
          :items="[
            { value: true, title: 'Yes' },
            { value: false, title: 'No' }
          ]"
          required
          item-title="title"
          item-value="value"
          :rules="[
            (v) =>
              (v !== undefined && v !== null) ||
              'Terrorism Extension is required'
          ]"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="formData.maximumMedicalExpense"
          label="Maximum Medical Expense"
          required
          :rules="[(v) => !!v || 'Maximum Medical Expense is required']"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="formData.lossOfBaggage"
          label="Loss of Baggage"
          required
          :rules="[(v) => !!v || 'Loss of Baggage is required']"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="formData.personalLiability"
          label="Personal Liability"
          required
          :rules="[(v) => !!v || 'Personal Liability is required']"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="formData.covid19Coverage"
          label="Covid-19 Coverage"
          required
          :rules="[(v) => !!v || 'Covid-19 Coverage is required']"
        />
      </v-col>
      <v-col cols="12">
        <v-file-input
          v-if="formData.files?.length === 0"
          label="Full Policy Details"
          :prepend-icon="null"
          prepend-inner-icon="mdi-file-pdf-box"
          variant="outlined"
          :chips="true"
          :multiple="true"
          accept="application/pdf"
          v-model:model-value="formData.uploads"
        />
        <div
          v-else
          class="d-flex flex-wrap ga-4 align-center"
        >
          <p>Full Policy Details :</p>
          <a
            :href="formData.files?.[0]"
            target="_blank"
            :download="getFileName(formData.files?.[0])"
          >
            <v-chip append-icon="mdi-open-in-new">{{
              getFileName(formData.files?.[0])
            }}</v-chip>
          </a>
          <v-btn
            @click="formData.files = []"
            icon="mdi-delete"
            class="imageLinkDelete"
            color="error"
            size="x-small"
          />
        </div>
      </v-col>

      <v-col cols="12">
        <v-card title="Prices">
          <v-card-text>
            <div class="text-right mb-6">
              <v-btn
                @click="addMorePrice"
                color="primary"
              >
                + Add more price
              </v-btn>
            </div>
            <v-row
              v-for="(price, index) in formData.prices"
              class="mb-5"
              :key="index"
            >
              <v-col
                cols="12"
                class="text-right"
                v-if="formData.prices?.length > 1"
              >
                <v-btn
                  @click="removePrice(index)"
                  color="error"
                  icon="mdi-delete"
                  size="x-small"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="price.ageStart"
                  label="Start Age"
                  type="number"
                  required
                  :rules="[(v) => !!v || 'Start Age is required']"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="price.ageEnd"
                  label="End Age"
                  type="number"
                  required
                  :rules="[(v) => !!v || 'End Age is required']"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="price.durationStart"
                  label="Start Duration"
                  type="number"
                  required
                  :rules="[(v) => !!v || 'Start Duration is required']"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="price.durationEnd"
                  label="End Duration"
                  type="number"
                  required
                  :rules="[(v) => !!v || 'End Duration is required']"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="price.price"
                  label="Price"
                  type="number"
                  required
                  :rules="[
                    (v) => !!v || 'Price is required',
                    (v) => v > 0 || 'Price must be a positive number'
                  ]"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="price.vat"
                  label="VAT"
                  type="number"
                  :rules="[
                    (v) => !!v || 'VAT is required',
                    (v) => v > 0 || 'VAT must be a positive number'
                  ]"
                  @update:model-value="(data) => updateTotal(data, index)"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="price.total"
                  label="Total"
                  type="number"
                  readonly
                  :clearable="false"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <div class="text-right d-flex justify-end ga-4">
          <v-btn
            color="error"
            @click="router.back()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="save"
          >
            Save
          </v-btn>
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
    <p class="mb-4">
      Name : {{ detailsData?.name }}
    </p>
    <p class="mb-4">
      Contact Number : {{ detailsData?.contactNumber }}
    </p>
    <p class="mb-4">
      Address : {{ detailsData?.address }}
    </p>
    <p class="mb-4">
      Website : {{ detailsData?.website }}
    </p>
    <p class="mb-4">
      Rating : {{ detailsData?.rating }}
    </p>
    <p class="mb-4">
      Start Price : {{ detailsData?.startPrice }}
    </p>
    <p class="mb-4">
      End Price : {{ detailsData?.endPrice }}
    </p>
    <p class="mb-2">
      Description :
    </p>
    <div
      class="mb-4"
      v-html="detailsData?.description"
    />
    <div class="mb-4">
      <p class="mb-2">
        Cuisines:
      </p>
      <div class="d-flex flex-wrap ga-4">
        <v-chip
          v-for="(c, index) in detailsData?.cuisines"
          :key="index"
        >
          {{ c?.name }}
        </v-chip>
      </div>
    </div>
    <div class="mb-4">
      <p class="mb-2">
        Special Diets:
      </p>
      <div class="d-flex flex-wrap ga-4">
        <v-chip
          v-for="(s, index) in detailsData?.specialDiets"
          :key="index"
        >
          {{ s?.name }}
        </v-chip>
      </div>
    </div>
    <p class="mb-4">
      Images :
    </p>
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
        <v-img
          cover
          :src="i"
          height="150"
          class="rounded"
        />
      </v-col>
    </v-row>
    <p class="mb-4">
      Menu :
    </p>
    <v-row class="mb-4">
      <v-col
        cols="12"
        v-for="(i, index) in detailsData?.menu"
        :key="index"
      >
        <a
          :href="i"
          target="_blank"
          :download="getFileName(i)"
        >
          <v-chip append-icon="mdi-open-in-new">{{ getFileName(i) }}</v-chip>
        </a>
      </v-col>
    </v-row>
    <p class="mb-4">
      Halal Certificates :
    </p>
    <v-row class="mb-4">
      <v-col
        cols="12"
        v-for="(i, index) in detailsData?.halalCertificates"
        :key="index"
      >
        <a
          :href="i"
          target="_blank"
          :download="getFileName(i)"
        >
          <v-chip append-icon="mdi-open-in-new">{{ getFileName(i) }}</v-chip>
        </a>
      </v-col>
    </v-row>

    <p class="mb-4">
      Working Hours :
    </p>
    <v-row class="mb-4">
      <v-col
        cols="12"
        sm="2"
        md="3"
        lg="4"
        xl="5"
        xxl="6"
        v-for="(i, index) in detailsData?.workingHours"
        :key="index"
        class="border rounded"
      >
        <p>{{ i?.day }}</p>
        <p>Opening Time : {{ i?.startTime }}</p>
        <p>Closing Time : {{ i?.endTime }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { useAppStore } from '@/store/app'
import { format } from 'date-fns'

const insuranceTypeList = ref([])
const insuranceNameList = ref([])
const masterInsuranceNameList = ref([])
const insurancePolicyList = ref([])
const masterInsurancePolicyList = ref([])
const insuranceAreaList = ref([])
const masterInsuranceAreaList = ref([])
const travelerTypeList = ref([])
const insuranceRestTypeList = ref([])
const masterInsuranceRestTypeList = ref([])

const initialFormData = {
  name: '',
  insuranceType: null,
  insuranceName: null,
  insurancePolicy: null,
  insuranceArea: null,
  travelerType: null,
  insuranceRestType: null,
  tripType: null,
  terrorismExtension: null,
  maximumMedicalExpense: null,
  lossOfBaggage: '',
  personalLiability: '',
  covid19Coverage: '',
  prices: [
    {
      ageStart: null,
      ageEnd: null,
      durationStart: null,
      durationEnd: null,
      price: null,
      vat: null,
      total: null
    }
  ],

  files: [],
  uploads: [],
  fileMapper: []
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

const id = computed(() => {
  return route?.query?.id
})

const table_data = ref({
  loading: true,
  search: null,
  itemsPerPage: 20,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Name Of The product', key: 'insuranceName', align: 'start' },
    { title: 'Policy Type', key: 'insurancePolicy', align: 'start' },
    { title: 'Type', key: 'insuranceType', align: 'start' },
    { title: 'Area', key: 'insuranceArea', align: 'start' },
    { title: 'Traveler Type', key: 'travelerType', align: 'start' },
    { title: 'Age Group', key: 'ageGroup', align: 'start' },
    { title: 'Trip Duration', key: 'tripDuration', align: 'start' },
    { title: 'Insurance Type', key: 'insuranceRestType', align: 'start' },
    { title: 'Trip Type', key: 'tripType', align: 'start' },
    { title: 'Terrorism Extension', key: 'terrorismExtension', align: 'start' },
    { title: 'Price', key: 'price', align: 'start' },
    { title: 'Date Added', key: 'createdAt', align: 'start' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 50, title: '50' },
    { value: 80, title: '80' }
  ]
})

const onCreate = () => {
  router.push({ name: 'insurance-package', query: { mode: 'form' } })
}
const formData = ref(initialFormData)
const form = ref()
const formValue = ref(false)
const showForm = ref(false)
const detailsData = ref({})

const onEdit = (item) => {
  router.push(`/insurance/package?mode=form&id=${item?._id}`)
}
const onDetails = (item) => {
  router.push(`/restaurant/restaurant?mode=details&id=${item?._id}`)
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
  form.value.validate()
  if (form.value.isValid) {
    const payload = getDataPayload()
    const response = id?.value
      ? await axios.patch(`admin/insurance/packages/${id.value}`, payload)
      : await axios.post('admin/insurance/packages', payload)
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
    .post('admin/insurance/packages-list', {
      ...payload
    })
    .then((res) => {
      table_data.value.serverItems = res?.data?.data
      table_data.value.totalItems = res?.data?.total
    })
}
const confirmDelete = async () => {
  await axios
    .delete(`admin/insurance/packages/${store.details?._id}`)
    .then(async () => {
      store.showSnackbar('Successfully Deleted')
      await loadItems()
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

const getFileName = (url) => {
  if (!url) return 'File'
  return url.split('/').pop()
}
const getInsuranceTypeList = async () => {
  await axios.get('admin/insurance/types').then((res) => {
    insuranceTypeList.value = res.data
  })
}

const getInsuranceNameList = async () => {
  await axios.get('admin/insurance/names').then((res) => {
    insuranceNameList.value = res.data
    masterInsuranceNameList.value = res.data
  })
}

const getInsurancePolicyList = async () => {
  await axios.get('admin/insurance/policies').then((res) => {
    insurancePolicyList.value = res.data
    masterInsurancePolicyList.value = res.data
  })
}

const getInsuranceAreaList = async () => {
  await axios.get('admin/insurance/areas').then((res) => {
    insuranceAreaList.value = res.data
    masterInsuranceAreaList.value = res.data
  })
}

const getTravelerTypeList = async () => {
  await axios.get('admin/insurance/traveler-types').then((res) => {
    travelerTypeList.value = res.data
  })
}

const getInsuranceRestTypeList = async () => {
  await axios.get('admin/insurance/rest-types').then((res) => {
    insuranceRestTypeList.value = res.data
    masterInsuranceRestTypeList.value = res.data
  })
}

const updateTotal = (data, index) => {
  // Convert the VAT (data) and price to numbers
  const vat = Number(data);
  const price = Number(formData.value.prices[index].price);

  // If VAT or price is not a valid number, set total to null and return
  if (isNaN(vat) || isNaN(price)) {
    formData.value.prices[index].total = null;
    return;
  }

  // Calculate the total by adding VAT and price
  formData.value.prices[index].total = vat + price;
};

const addMorePrice = () => {
  formData.value.prices.unshift({
    ageStart: null,
    ageEnd: null,
    durationStart: null,
    durationEnd: null,
    price: null,
    vat: null,
    total: null
  })
}
const removePrice = (index) => {
  formData.value.prices.splice(index, 1)
}

onBeforeMount(async () => {
  await getInsuranceTypeList()
  await getInsuranceNameList()
  await getInsurancePolicyList()
  await getInsuranceAreaList()
  await getTravelerTypeList()
  await getInsuranceRestTypeList()
  // add

  if (id.value) {
    const details = await axios.get(`admin/insurance/packages/${id.value}`)
    if (details?.data?._id) {
      if (formMode.value) {
        formData.value = { ...details?.data }
        formData.value.insuranceType = formData.value.insuranceType?._id
        formData.value.insuranceName = formData.value.insuranceName?._id
        formData.value.insurancePolicy = formData.value.insurancePolicy?._id
        formData.value.insuranceArea = formData.value.insuranceArea?._id
        formData.value.insuranceRestType = formData.value.insuranceRestType?._id
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
