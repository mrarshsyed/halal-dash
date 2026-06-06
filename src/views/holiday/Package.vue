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
        <v-sheet elevation="2">
          <v-tabs
            v-model="activeTab"
            color="primary"
          >
            <v-tab value="basic">Basic Info</v-tab>
            <v-tab value="dates">Duration &amp; Dates</v-tab>
            <v-tab value="gallery">Gallery</v-tab>
            <v-tab value="details">Details</v-tab>
            <v-tab value="itinerary">Itinerary &amp; Info</v-tab>
            <v-tab value="prices">Prices</v-tab>
          </v-tabs>
          <v-divider />
          <v-window v-model="activeTab">

            <!-- Basic Info -->
            <v-window-item value="basic">
              <v-row class="pa-4">
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="formData.name"
                    label="Name"
                    required
                    :rules="[
                      (v) => !!v || 'Name is required',
                      (v) => (v && v.length <= 25) || 'Name must be 25 characters or less'
                    ]"
                    @update:model-value="onNameChange"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="formData.slug"
                    label="Slug Preview"
                    :rules="[(v) => !!v || 'Slug is required']"
                  />
                </v-col>
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
                    :rules="[(v) => !!v || 'Currency is required']"
                    v-model="formData.currency"
                    return-object
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
                    clearable
                    label="Category"
                    :items="categoryList"
                    item-title="name"
                    item-value="_id"
                    required
                    :rules="[(v) => !!v || 'Category is required']"
                    v-model="formData.category"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
                    clearable
                    label="Type"
                    :items="typeList"
                    item-title="name"
                    item-value="_id"
                    required
                    :rules="[(v) => !!v || 'Type is required']"
                    v-model="formData.type"
                    @update:model-value="onTypeChange"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
                    clearable
                    label="Offer"
                    :items="getFilteredOfferList()"
                    item-title="name"
                    item-value="_id"
                    required
                    :rules="[(v) => !!v || 'Offer is required']"
                    v-model="formData.offer"
                    :disabled="!formData.type"
                    :hint="!formData.type ? 'Select a type first' : ''"
                    persistent-hint
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
                    clearable
                    label="Select Country"
                    :items="countryList"
                    :item-title="(item) => item.country?.name"
                    item-value="_id"
                    :rules="[(v) => !!v || 'Country is required']"
                    v-model="formData.country"
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
              </v-row>
            </v-window-item>

            <!-- Duration & Dates -->
            <v-window-item value="dates">
              <v-row class="pa-4">
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="formData.duration.days"
                    label="Duration (Days)"
                    type="number"
                    :rules="[validatePositiveInteger, validateRequired]"
                    required
                    @update:model-value="onDurationChange"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="formData.duration.nights"
                    label="Duration (Nights)"
                    type="number"
                    :rules="[validatePositiveInteger, validateRequired]"
                    required
                    @update:model-value="onDurationChange"
                  />
                </v-col>
                <v-col cols="12">
                  <v-btn-toggle
                    v-model="dateMode"
                    mandatory
                    color="primary"
                    density="compact"
                    @update:model-value="onDateModeChange"
                  >
                    <v-btn value="fixed">
                      Fixed Dates
                    </v-btn>
                    <v-btn value="approx">
                      Approximate Dates
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <template v-if="dateMode === 'fixed'">
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <div
                      class="border pa-4"
                      v-if="formData.duration.nights === '' || formData.duration.days === ''"
                    >
                      Start Date: Add Duration (Days &amp; Nights) First
                    </div>
                    <v-menu
                      v-else
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
                        @update:model-value="onStartDateChange"
                      />
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <div
                      class="border pa-4"
                      v-if="formData.duration.nights === '' || formData.duration.days === ''"
                    >
                      End Date: Add Duration (Days &amp; Nights) First
                    </div>
                    <v-menu
                      v-else
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
                </template>
                <template v-if="dateMode === 'approx'">
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="approxStartMonth"
                      label="Approx Start Date"
                      type="month"
                      :rules="[(v) => !!v || 'Approx Start Date is required']"
                      prepend-inner-icon="mdi-calendar"
                      @update:model-value="onApproxStartMonthChange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="approxEndMonth"
                      label="Approx End Date (optional)"
                      type="month"
                      prepend-inner-icon="mdi-calendar"
                      :rules="[
                        (v) =>
                          !v ||
                          !approxStartMonth ||
                          v >= approxStartMonth ||
                          'End date must be after start date'
                      ]"
                      @update:model-value="onApproxEndMonthChange"
                    />
                  </v-col>
                </template>
              </v-row>
            </v-window-item>

            <!-- Gallery -->
            <v-window-item value="gallery">
              <v-row class="pa-4">
                <v-col
                  cols="12"
                  md="6"
                >
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
                    enable-video
                    :video-upload="formData.videoUpload"
                    :video-url="formData.video"
                    @update:video-upload="(f) => { formData.videoUpload = f }"
                    @update:video-url="(url) => { formData.video = url }"
                    @error="(msg) => store.showSnackbar(msg, 'error')"
                  />
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Details -->
            <v-window-item value="details">
              <v-row class="pa-4">
                <v-col cols="12">
                  <p class="mb-2">
                    Offer Type
                  </p>
                  <DocumentEditor
                    height="200px"
                    v-model="formData.offerType"
                    class="mb-4"
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
              </v-row>
            </v-window-item>

            <!-- Itinerary & Info -->
            <v-window-item value="itinerary">
              <v-row class="pa-4">
                <v-col cols="12">
                  <p class="text-subtitle-1 font-weight-bold mb-2">
                    Itinerary
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  v-if="dateMode === 'approx'"
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    size="small"
                    @click="addItineraryItem"
                  >
                    + Add Itinerary
                  </v-btn>
                </v-col>
                <v-col
                  v-if="!formData.itinerary?.length"
                  cols="12"
                >
                  <div class="text-center pa-4 border">
                    {{
                      dateMode === 'fixed'
                        ? 'Select start date first'
                        : 'No itinerary items. Click Add Itinerary.'
                    }}
                  </div>
                </v-col>
                <v-col
                  v-else
                  v-for="(itinerary, indexI) in formData.itinerary"
                  :key="indexI"
                  cols="12"
                  class="border mb-4 rounded pa-4"
                >
                  <div
                    v-if="dateMode === 'approx'"
                    class="text-right mb-2"
                  >
                    <v-btn
                      color="error"
                      size="x-small"
                      @click="removeItineraryItem(indexI)"
                    >
                      Delete
                    </v-btn>
                  </div>
                  <v-text-field
                    v-if="dateMode === 'fixed'"
                    label="Date"
                    :rules="[(v) => !!v || 'Date is required']"
                    v-model="itinerary.date"
                    :clearable="false"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                  />
                  <v-text-field
                    v-else
                    label="Date"
                    type="date"
                    :rules="[(v) => !!v || 'Date is required']"
                    v-model="itinerary.date"
                    prepend-inner-icon="mdi-calendar"
                  />
                  <v-text-field
                    label="Title"
                    :rules="[(v) => !!v || 'Title is required']"
                    v-model="itinerary.title"
                    :clearable="true"
                  />
                  <p class="mt-8 mb-2">
                    Description
                  </p>
                  <DocumentEditor
                    :key="`itinerary-description-${editorKey}`"
                    height="200px"
                    v-model="itinerary.description"
                    class="mb-4"
                  />
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-6" />
                  <p class="text-subtitle-1 font-weight-bold mb-4">
                    Additional Information
                  </p>
                </v-col>
                <v-col cols="12">
                  <div class="text-right">
                    <v-btn
                      color="primary"
                      size="small"
                      @click="addMoreAdditionalInfo"
                    >
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
                    <v-btn
                      color="error"
                      size="x-small"
                      @click="removeAdditionalInfo(key)"
                    >
                      Delete
                    </v-btn>
                  </div>
                  <v-text-field
                    v-model="value.title"
                    label="Title"
                    :rules="[validateRequired]"
                  />
                  <p class="mt-6 mb-2">
                    Description
                  </p>
                  <DocumentEditor
                    :key="`additional-info-description-${editorKey}`"
                    height="200px"
                    v-model="value.description"
                    class=""
                  />
                  <p
                    v-if="!value.description"
                    class="text-error"
                  >
                    Description is required
                  </p>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Prices -->
            <v-window-item value="prices">
              <v-row class="pa-4">
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="formData.prices.adultSingleOccupancy"
                    label="Adult (Single Occupancy)"
                    :rules="[validatePositiveInteger, validateRequired]"
                    required
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="formData.prices.adultDoubleOccupancy"
                    label="Adult (Double Occupancy)"
                    :rules="[validatePositiveInteger]"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="formData.prices.adultTripleOccupancy"
                    label="Adult (Triple Occupancy)"
                    :rules="[validatePositiveInteger]"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="formData.prices.child"
                    label="Child"
                    :rules="[validatePositiveInteger]"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="formData.prices.infant"
                    label="Infant"
                    :rules="[validatePositiveInteger]"
                  />
                </v-col>
              </v-row>
            </v-window-item>

          </v-window>
        </v-sheet>
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

  <!-- Details View -->
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
      Currency : {{ detailsData?.currency?.code }}
    </p>
    <p class="mb-4">
      Category : {{ detailsData?.category?.name }}
    </p>
    <p class="mb-4">
      Type : {{ detailsData?.type?.name ?? '—' }}
    </p>
    <p class="mb-4">
      Offer : {{ detailsData?.offer?.name ?? '—' }}
    </p>
    <p class="mb-4">
      Country : {{ detailsData?.country?.country?.name ?? '—' }}
    </p>
    <p class="mb-4">
      Address : {{ detailsData?.address }}
    </p>
    <p class="mb-4">
      Duration ( Days ) : {{ detailsData?.duration?.days }}
    </p>
    <p class="mb-4">
      Duration ( Nights ) : {{ detailsData?.duration?.nights }}
    </p>
    <template v-if="detailsData?.startDate">
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
    </template>
    <template v-else-if="detailsData?.approxStartDate">
      <p class="mb-4">
        Approx Start Date :
        {{
          detailsData?.approxStartDate
            ? format(new Date(detailsData?.approxStartDate), 'MMM yyyy')
            : ''
        }}
      </p>
      <p class="mb-4">
        Approx End Date :
        {{
          detailsData?.approxEndDate
            ? format(new Date(detailsData?.approxEndDate), 'MMM yyyy')
            : ''
        }}
      </p>
    </template>
    <p class="mb-2">
      Offer Type :
    </p>
    <div
      class="mb-5"
      v-html="detailsData?.offerType"
    />
    <div class="mb-4">
      <p class="mb-2">
        Inclusion Icons :
      </p>
      <v-row>
        <v-col
          cols="2"
          v-for="(i, index) in detailsData?.inclusionIcons"
          :key="index"
        >
          <v-img
            :src="i?.image"
            height="70px"
            width="70px"
            :alt="i?.name"
          />
        </v-col>
      </v-row>
    </div>
    <div class="mb-6">
      <p class="mb-2">
        Overview :
      </p>
      <div
        class="mb-4"
        v-html="detailsData?.overview"
      />
    </div>
    <div class="mb-6">
      <p class="mb-2">
        Inclusion :
      </p>
      <div
        class="mb-4"
        v-html="detailsData?.inclusions"
      />
    </div>
    <div class="mb-6">
      <p class="mb-2">
        Exclusion :
      </p>
      <div
        class="mb-4"
        v-html="detailsData?.exclusions"
      />
    </div>
    <div class="mb-8">
      <p class="mb-2">
        Prices:
      </p>
      <v-row class="mt-4 border pa-4">
        <v-col
          cols="12"
          md="6"
        >
          <p>
            Adult (Single Occupancy) :
            {{ detailsData?.prices?.adultSingleOccupancy }}
          </p>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <p>
            Adult (Double Occupancy) :
            {{ detailsData?.prices?.adultDoubleOccupancy }}
          </p>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <p>
            Adult (Triple Occupancy) :
            {{ detailsData?.prices?.adultTripleOccupancy }}
          </p>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <p>Child : {{ detailsData?.prices?.child }}</p>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <p>Infant : {{ detailsData?.prices?.infant }}</p>
        </v-col>
      </v-row>
    </div>
    <div
      class="mb-8"
      v-if="detailsData?.itinerary?.length"
    >
      <p class="mb-2">
        Itinerary:
      </p>
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
          <p class="mt-4 mb-2">
            Description
          </p>
          <div v-html="value.description" />
        </v-col>
      </v-row>
    </div>
    <div class="mb-8">
      <p class="mb-2">
        Additional Information:
      </p>
      <v-row class="mt-4">
        <v-col
          v-for="(value, key) in detailsData?.additionalInformation"
          :key="key"
          cols="6"
          class="rounded border pa-4 shadow"
        >
          <p>Title: {{ value?.title }}</p>
          <p class="mt-4 mb-2">
            Description
          </p>
          <div v-html="value.description" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import DocumentEditor from '@/components/DocumentEditor.vue'
import { useAppStore } from '@/store/app'
import { addDays, format } from 'date-fns'
import ImageUploader from './components/ImageUploader.vue'
import slugify from 'slugify'

const store = useAppStore()
const route = useRoute()
const router = useRouter()

const moduleName = 'Package'

const initialFormData = {
  name: '',
  slug: '',
  address: '',
  country: null,
  category: null,
  type: null,
  offer: null,
  duration: { nights: '', days: '' },
  startDate: null,
  endDate: null,
  approxStartDate: null,
  approxEndDate: null,
  currency: null,
  prices: {
    adultSingleOccupancy: '',
    adultDoubleOccupancy: '',
    adultTripleOccupancy: '',
    child: '',
    infant: ''
  },
  offerType: '',
  overview: '',
  inclusions: '',
  exclusions: '',
  additionalInformation: [{ title: '', description: '' }],
  inclusionIcons: [],
  itinerary: [],
  images: [],
  uploads: [],
  video: null,
  videoUpload: null
}

const currencyList = ref([])
const countryList = ref([])
const inclusionIconList = ref([])
const categoryList = ref([])
const typeList = ref([])
const offerList = ref([])

const formMode = ref(false)
const detailsMode = ref(false)
const id = ref(null)
const dateMode = ref('fixed')
const approxStartMonth = ref('')
const approxEndMonth = ref('')

const editorKey = ref(0)
const startDateMenu = ref(false)
const endDateMenu = ref(false)
const formData = ref({ ...initialFormData })
const form = ref()
const formValue = ref(false)
const showForm = ref(false)
const detailsData = ref({})
const activeTab = ref('basic')

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

const validateRequired = (v) => !!v || 'This field is required'
const validatePositiveInteger = (v) =>
  !v || Number(v) > 0 || 'Must be greater than 0'

// Pure functions replacing computed/watch
const getFilteredOfferList = () => {
  if (!formData.value.type) return offerList.value
  return offerList.value.filter(
    (o) => (o.type?._id ?? o.type) === formData.value.type
  )
}

const onNameChange = (val) => {
  formData.value.slug = slugify(val)
}

const onTypeChange = () => {
  formData.value.offer = null
}

const onDurationChange = () => {
  formData.value.startDate = null
  formData.value.endDate = null
}

const onDateModeChange = (val) => {
  if (val === 'fixed') {
    formData.value.approxStartDate = null
    formData.value.approxEndDate = null
    approxStartMonth.value = ''
    approxEndMonth.value = ''
  } else {
    formData.value.startDate = null
    formData.value.endDate = null
    formData.value.itinerary = [] // clear auto-generated fixed items
  }
}

const onApproxStartMonthChange = (val) => {
  formData.value.approxStartDate = val ? `${val}-01` : null
}

const onApproxEndMonthChange = (val) => {
  formData.value.approxEndDate = val ? `${val}-01` : null
}

const onCreate = () => {
  router.push({ name: 'holiday-package', query: { mode: 'form' } })
}
const onEdit = (item) => {
  router.push(`/holiday/package?mode=form&id=${item?._id}`)
}
const onDetails = (item) => {
  router.push(`/holiday/package?mode=details&id=${item?._id}`)
}

const removeUploads = (obj) => {
  let newObject = { ...obj }
  delete newObject.uploads
  delete newObject.videoUpload
  return newObject
}

const getFilesPayload = () => {
  const files = []
  const fileMapper = []
  if (formData.value?.uploads?.length) {
    formData.value.uploads.forEach((file) => {
      if (file instanceof File) {
        files.push(file)
        fileMapper.push({ resource: 'images', name: file.name })
      }
    })
  }
  if (formData.value?.videoUpload instanceof File) {
    // index in uploads array must match index in fileMapper
    files.push(formData.value.videoUpload)
    fileMapper.push({ resource: 'video', name: formData.value.videoUpload.name })
  }
  return { files, fileMapper }
}

const getDataPayload = () => {
  try {
    let { files, fileMapper } = getFilesPayload()
    let data = removeUploads(formData.value)
    data.fileMapper = fileMapper

    if (dateMode.value === 'fixed') {
      delete data.approxStartDate
      delete data.approxEndDate
    } else {
      delete data.startDate
      delete data.endDate
    }

    // Strip time from itinerary dates — backend expects YYYY-MM-DD only
    if (data.itinerary?.length) {
      data.itinerary = data.itinerary.map((el) => ({
        ...el,
        date: el.date instanceof Date ? format(el.date, 'yyyy-MM-dd') : el.date?.substring(0, 10) ?? ''
      }))
    }

    // Convert empty string optional prices to null so yup number() doesn't receive NaN
    const optionalPriceFields = [
      'adultDoubleOccupancy',
      'adultTripleOccupancy',
      'child',
      'infant'
    ]
    optionalPriceFields.forEach((field) => {
      if (data.prices[field] === '' || data.prices[field] === undefined) {
        data.prices[field] = null
      }
    })

    // If a new video file is being uploaded, clear the stored URL so they don't conflict
    if (formData.value?.videoUpload instanceof File) {
      delete data.video
    }

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
  await form.value.validate()

  if (!formData.value.itinerary?.length) {
    store.showSnackbar('Itinerary must have at least 1 item', 'error')
    return
  }

  const hasInvalidAdditionalInfo = formData.value.additionalInformation?.some(
    (item) => !item.description
  )
  if (hasInvalidAdditionalInfo) {
    store.showSnackbar(
      'Additional information description is required',
      'error'
    )
    return
  }

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
    .post('admin/holiday/packages-list', { ...payload })
    .then((res) => {
      table_data.value.serverItems = res?.data?.data
      table_data.value.totalItems = res?.data?.total
    })
}

const confirmDelete = async () => {
  await axios
    .delete(`admin/holiday/packages/${store.details?._id}`)
    .then(async () => {
      store.showSnackbar('Successfully Deleted')
      await loadItems()
      store.closeDialog()
    })
}

const onDelete = (item) => {
  store.setDetails(item)
  store.showDialog({
    title: `Delete ${moduleName}`,
    content: `Are you sure to delete this ${moduleName}?`,
    confirmText: 'Delete',
    formComponents: { fields: [] },
    confirmFunction: confirmDelete
  })
}

const getCurrencyList = async () => {
  try {
    const res = await axios.get('misc/currencies')
    if (res?.data?.length) currencyList.value = res.data
  } catch {}
}

const getCountryList = async () => {
  try {
    const res = await axios.get('admin/misc/countries')
    if (res?.data?.length) countryList.value = res.data
  } catch {}
}

const getInclusionIconList = async () => {
  try {
    const res = await axios.get('/admin/holiday/inclusion-icons')
    if (res?.data?.length) inclusionIconList.value = res.data
  } catch {}
}

const getCategoryList = async () => {
  try {
    const res = await axios.get('admin/holiday/categories')
    if (res?.data?.length) categoryList.value = res.data
  } catch {}
}

const getTypeList = async () => {
  try {
    const res = await axios.get('admin/holiday/types')
    if (res?.data?.length) typeList.value = res.data
  } catch {}
}

const getOfferList = async () => {
  try {
    const res = await axios.get('admin/holiday/offers')
    if (res?.data?.length) offerList.value = res.data
  } catch {}
}

const onStartDateChange = (date) => {
  const reduceDay = Number(formData.value.duration.days) - 1
  formData.value.endDate = addDays(date, reduceDay)
  formData.value.itinerary = [...Array(reduceDay + 1).keys()].map((x) => ({
    date: new Date(
      formData.value.startDate.getTime() + x * 24 * 60 * 60 * 1000
    ),
    title: '',
    description: ''
  }))
}

const addItineraryItem = () => {
  formData.value.itinerary.push({ date: '', title: '', description: '' })
}

const removeItineraryItem = (index) => {
  formData.value.itinerary.splice(index, 1)
}

const removeAdditionalInfo = (index) => {
  formData.value.additionalInformation.splice(index, 1)
}

const addMoreAdditionalInfo = () => {
  formData.value.additionalInformation.unshift({ title: '', description: '' })
  editorKey.value = editorKey.value + 1
}

const onUploadsUpdate = (images, key) => {
  formData.value[key] = images
}

const onImageUpdate = (data, key) => {
  formData.value[key] = [...data]
}

onBeforeMount(async () => {
  formMode.value = route?.query?.mode === 'form'
  detailsMode.value = route?.query?.mode === 'details'
  id.value = route?.query?.id ?? null

  await Promise.all([
    getCurrencyList(),
    getCountryList(),
    getInclusionIconList(),
    getCategoryList(),
    getTypeList(),
    getOfferList()
  ])

  if (id.value) {
    try {
      const details = await axios.get(`admin/holiday/packages/${id.value}`)

      if (details?.data?._id) {
        if (formMode.value) {
          const data = { ...details.data }

          // Normalize populated objects to ObjectId strings for form selects
          data.country = data.country?._id ?? data.country ?? null
          data.category = data.category?._id ?? data.category ?? null
          data.type = data.type?._id ?? data.type ?? null
          data.offer = data.offer?._id ?? data.offer ?? null
          data.inclusionIcons = data.inclusionIcons?.map((x) => x?._id ?? x)

          if (data.approxStartDate) {
            dateMode.value = 'approx'
            approxStartMonth.value = data.approxStartDate.substring(0, 7)
            approxEndMonth.value = data.approxEndDate?.substring(0, 7) ?? ''
            data.approxStartDate = data.approxStartDate.substring(0, 10)
            data.approxEndDate = data.approxEndDate ? data.approxEndDate.substring(0, 10) : null
            data.itinerary?.forEach((el) => {
              el.date = el.date ? el.date.substring(0, 10) : ''
            })
          } else {
            dateMode.value = 'fixed'
            if (data.startDate) data.startDate = new Date(data.startDate)
            if (data.endDate) data.endDate = new Date(data.endDate)
            data.itinerary?.forEach((el) => {
              el.date = new Date(el.date)
            })
          }
          formData.value = { ...data, videoUpload: null, video: data.video || null }
        } else if (detailsMode.value) {
          // Keep full populated objects for display
          detailsData.value = { ...details.data }
        }
      }
    } catch {}
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
