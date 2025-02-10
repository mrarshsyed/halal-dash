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
        <template #item.action="{ item }">
          <div class="d-flex ga-3">
            <v-tooltip
              text="Ratings"
              location="top"
              v-if="
                store.hasPermission(permissions.restaurantUpdateHalalRatings)
              "
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
              v-if="store.hasPermission(permissions.restaurantUpdateManager)"
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
              v-if="store.hasPermission(permissions.restaurantUpdateManager)"
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
        <v-text-field
          v-model="formData.contactNumber"
          label="Contact Number"
          required
          :rules="[(v) => !!v || 'Contact Number is required']"
        />
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          clearable
          label="Meal Options"
          :items="categoriesList"
          required
          :rules="[(v) => (v && v.length > 0) || 'This field is required']"
          v-model="formData.categories"
          multiple
          chips
          item-title="title"
          item-value="value"
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
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="formData.website"
          label="Web Site"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          type="number"
          v-model="formData.rating"
          label="Rating"
          :rules="[
            (v) => {
              const rating = parseFloat(v)
              return (
                v === null ||
                (Number.isFinite(rating) && rating >= 0 && rating <= 5) ||
                'Rating must be a number between 0 and 5'
              )
            }
          ]"
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          type="number"
          v-model.number="formData.startPrice"
          label="Start Price"
          :rules="[
            (v) => v !== null || 'Start Price is required',
            (v) =>
              (typeof v === 'number' && v >= 0) ||
              'Start Price must be a non-negative number'
          ]"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          type="number"
          v-model.number="formData.endPrice"
          label="End Price"
          :rules="[
            (v) => v !== null || 'End Price is required',
            (v) =>
              (typeof v === 'number' && v >= 0) ||
              'End Price must be a non-negative number'
          ]"
        />
      </v-col>
      <v-col cols="12">
        <p>Description</p>
        <DocumentEditor
          height="200px"
          v-model="formData.description"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Cuisines"
          :items="cuisinesList"
          required
          :rules="[(v) => (v && v.length > 0) || 'This field is required']"
          v-model="formData.cuisines"
          multiple
          chips
          item-title="name"
          item-value="_id"
          return-object
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          clearable
          label="Special Diets"
          :items="specialDietsList"
          required
          :rules="[(v) => (v && v.length > 0) || 'This field is required']"
          v-model="formData.specialDiets"
          multiple
          chips
          item-title="name"
          item-value="_id"
          return-object
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
        <v-file-input
          v-if="formData.menu?.length === 0"
          label="Menu"
          :prepend-icon="null"
          prepend-inner-icon="mdi-file-pdf-box"
          variant="outlined"
          :chips="true"
          :multiple="false"
          accept="application/pdf"
          v-model:model-value="formData.menuUploads"
        />
        <div
          v-else
          class="d-flex flex-wrap ga-4 align-center"
        >
          <p>Menu :</p>
          <a
            :href="formData.menu?.[0]"
            target="_blank"
            :download="getFileName(formData.menu?.[0])"
          >
            <v-chip append-icon="mdi-open-in-new">{{
              getFileName(formData.menu?.[0])
            }}</v-chip>
          </a>
          <v-btn
            @click="formData.menu = []"
            icon="mdi-delete"
            class="imageLinkDelete"
            color="error"
            size="x-small"
          />
        </div>
      </v-col>
      <v-col cols="12">
        <v-file-input
          v-if="formData.halalCertificates?.length === 0"
          label="Halal Certificate"
          :prepend-icon="null"
          prepend-inner-icon="mdi-file-pdf-box"
          variant="outlined"
          :chips="true"
          :multiple="false"
          accept="application/pdf"
          v-model:model-value="formData.halalCertificatesUploads"
        />
        <div
          v-else
          class="d-flex flex-wrap ga-4 align-center"
        >
          <p>Halal Certificate :</p>
          <a
            :href="formData.halalCertificates?.[0]"
            target="_blank"
            :download="getFileName(formData.halalCertificates?.[0])"
          >
            <v-chip append-icon="mdi-open-in-new">{{
              getFileName(formData.halalCertificates?.[0])
            }}</v-chip>
          </a>
          <v-btn
            @click="formData.halalCertificates = []"
            icon="mdi-delete"
            class="imageLinkDelete"
            color="error"
            size="x-small"
          />
        </div>
      </v-col>

      <v-col cols="12">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel title="Working Hours">
            <v-expansion-panel-text class="pb-10">
              <v-autocomplete
                item-title="day"
                item-value="day"
                clearable
                label="Select Working Days"
                :items="workingDaysList"
                required
                :rules="[
                  (v) => (v && v.length > 0) || 'This field is required'
                ]"
                v-model="formData.workingHours"
                multiple
                chips
                return-object
              />
              <v-row class="mt-4">
                <v-col
                  v-for="(workingHour, indexH) in formData.workingHours"
                  :key="indexH"
                  cols="12"
                  md="6"
                  class="border px-2 mb-4 rounded"
                >
                  <v-text-field
                    label="Day"
                    v-model="workingHour.day"
                    readonly
                    :clearable="false"
                  />
                  <v-text-field
                    v-model="workingHour.startTime"
                    label="Opening Time"
                    prepend-inner-icon="mdi-clock-time-four-outline"
                    readonly
                    required
                    :rules="[(v) => !!v || 'Start time is required']"
                    @click="workingHour.startTimeMenu = true" 
                  >
                    <v-dialog
                      v-model="workingHour.startTimeMenu"
                      activator="parent"
                      width="auto"
                    >
                      <v-card>
                        <v-time-picker
                          v-if="workingHour.startTimeMenu"
                          v-model="workingHour.startTime"
                          full-width
                          format="24hr"
                        />
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            variant="outlined"
                            color="primary"
                            @click="workingHour.startTimeMenu = false"
                          >
                            Save & Close
                          </v-btn>
                          <v-btn
                            variant="outlined"
                            color="error"
                            @click="
                              workingHour.startTime = '';
                              workingHour.startTimeMenu = false;  
                            "
                          >
                            Reset
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-text-field>
                  <v-text-field
                    v-model="workingHour.endTime"
                    label="Closing Time"
                    prepend-inner-icon="mdi-clock-time-four-outline"
                    readonly
                    :rules="[(v) => !!v || 'Closing time is required']"
                    @click="workingHour.endTimeMenu = true"
                  >
                    <v-dialog
                      v-model="workingHour.endTimeMenu"
                      activator="parent"
                      width="auto"
                    >
                      <v-card>
                        <v-time-picker
                          v-if="workingHour.endTimeMenu"
                          v-model="workingHour.endTime"
                          full-width
                          format="24hr"
                        />
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            variant="outlined"
                            color="primary"
                            @click="workingHour.endTimeMenu = false"
                          >
                            Save & Close
                          </v-btn>
                          <v-btn
                            variant="outlined"
                            color="error"
                            @click="
                              workingHour.endTime = '';
                              workingHour.endTimeMenu = false;
                            "
                          >
                            Reset
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-text-field>
                  <v-text-field
                    v-model="workingHour.breakStartTime"
                    label="Break Start Time"
                    prepend-inner-icon="mdi-clock-time-four-outline"
                    readonly
                    required
                    @click="workingHour.breakStartTimeMenu = true"
                  >
                    <v-dialog
                      v-model="workingHour.breakStartTimeMenu"
                      activator="parent"
                      width="auto"
                    >
                      <v-card>
                        <v-time-picker
                          v-if="workingHour.breakStartTimeMenu"
                          v-model="workingHour.breakStartTime"
                          full-width
                          format="24hr"
                        />
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            variant="outlined"
                            color="primary"
                            @click="workingHour.breakStartTimeMenu = false"
                          >
                            Save & Close
                          </v-btn>
                          <v-btn
                            variant="outlined"
                            color="error"
                            @click="
                              workingHour.breakStartTime = '';
                              workingHour.breakStartTimeMenu = false;
                            "
                          >
                            Reset
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-text-field>
                  <v-text-field
                    v-model="workingHour.breakEndTime"
                    label="Break End Time"
                    prepend-inner-icon="mdi-clock-time-four-outline"
                    readonly
                    @click="workingHour.breakEndTimeMenu = true"
                  >
                    <v-dialog
                      v-model="workingHour.breakEndTimeMenu"
                      activator="parent"
                      width="auto"
                    >
                      <v-card>
                        <v-time-picker
                          v-if="workingHour.breakEndTimeMenu"
                          v-model="workingHour.breakEndTime"
                          full-width
                          format="24hr"
                        />
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            variant="outlined"
                            color="primary"
                            @click="workingHour.breakEndTimeMenu = false"
                          >
                            Save & Close
                          </v-btn>
                          <v-btn
                            variant="outlined"
                            color="error"
                            @click="
                              workingHour.breakEndTime = '';
                              workingHour.breakEndTimeMenu = false;
                            "
                          >
                            Reset
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-text-field>
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
  <v-dialog v-model="assignRatingDialogShow">
    <v-card>
      <v-card-title>Select Rating</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col
            cols="12"
            v-for="(r, index) in ratings"
            :key="index"
          >
            <v-checkbox
              v-model="selectedRatings"
              :value="r"
            >
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
        <v-btn
          color="primary"
          @click="onAssignRating"
        >
          Save
        </v-btn>
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
        <v-btn
          color="primary"
          @click="onAssignManager"
        >
          Assign Manager
        </v-btn>
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

const workingDaysList = [
  {
    day: 'Monday',
    startTime: '',
    endTime: '',
    startTimeMenu: false,
    endTimeMenu: false,
    breakStartTime: '',
    breakEndTime: '',
    breakStartTimeMenu: false,
    breakEndTimeMenu: false
  },
  {
    day: 'Tuesday',
    startTime: '',
    endTime: '',
    startTimeMenu: false,
    endTimeMenu: false,
    breakStartTime: '',
    breakEndTime: '',
    breakStartTimeMenu: false,
    breakEndTimeMenu: false
  },
  {
    day: 'Wednesday',
    startTime: '',
    endTime: '',
    startTimeMenu: false,
    endTimeMenu: false,
    breakStartTime: '',
    breakEndTime: '',
    breakStartTimeMenu: false,
    breakEndTimeMenu: false
  },
  {
    day: 'Thursday',
    startTime: '',
    endTime: '',
    startTimeMenu: false,
    endTimeMenu: false,
    breakStartTime: '',
    breakEndTime: '',
    breakStartTimeMenu: false,
    breakEndTimeMenu: false
  },
  {
    day: 'Friday',
    startTime: '',
    endTime: '',
    startTimeMenu: false,
    endTimeMenu: false,
    breakStartTime: '',
    breakEndTime: '',
    breakStartTimeMenu: false,
    breakEndTimeMenu: false
  },
  {
    day: 'Saturday',
    startTime: '',
    endTime: '',
    startTimeMenu: false,
    endTimeMenu: false,
    breakStartTime: '',
    breakEndTime: '',
    breakStartTimeMenu: false,
    breakEndTimeMenu: false
  },
  {
    day: 'Sunday',
    startTime: '',
    endTime: '',
    startTimeMenu: false,
    endTimeMenu: false,
    breakStartTime: '',
    breakEndTime: '',
    breakStartTimeMenu: false,
    breakEndTimeMenu: false
  }
]

const initialFormData = {
  name: '',
  address: '',
  contactNumber: '',
  website: '',
  rating: null,
  startPrice: null,
  endPrice: null,
  description: '',
  categories: [],
  workingHours: [],
  cuisines: [],
  specialDiets: [],
  uploads: [],
  images: [],
  menu: [],
  menuUploads: [],
  halalCertificates: [],
  halalCertificatesUploads: [],
  fileMapper: []
}
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const moduleName = 'Restaurant'
const formMode = computed(() => {
  return route?.query?.mode === 'form'
})
const detailsMode = computed(() => {
  return route?.query?.mode === 'details'
})

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
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 20, title: '20' },
    { value: 50, title: '50' },
    { value: 80, title: '80' }
  ]
})

const onCreate = () => {
  router.push({ name: 'restaurant-restaurant', query: { mode: 'form' } })
}
const formData = ref(initialFormData)
const form = ref()
const formValue = ref(false)
const showForm = ref(false)
const ratings = ref([])
const selectedRatings = ref([])
const assignRatingDialogShow = ref(false)
const assignManagerDialogShow = ref(false)
const managerSearch = ref('')
const detailsData = ref({})
const cuisinesList = ref([])
const specialDietsList = ref([])

const categoriesList = [
  { title: 'Breakfast', value: 'breakfast' },
  { title: 'Brunch', value: 'brunch' },
  { title: 'Lunch', value: 'lunch' },
  { title: 'Dinner', value: 'dinner' }
]

const onRatingIconClick = async (item) => {
  store.setDetails(item)
  if (item?.halal_ratings?.length) {
    selectedRatings.value = item?.halal_ratings
  }
  assignRatingDialogShow.value = true
}
const onEdit = (item) => {
  router.push(`/restaurant/restaurant?mode=form&id=${item?._id}`)
}
const onDetails = (item) => {
  router.push(`/restaurant/restaurant?mode=details&id=${item?._id}`)
}
const removeUploads = (obj) => {
  let newObject = { ...obj }
  delete newObject.uploads
  delete newObject.menuUploads
  delete newObject.halalCertificatesUploads
  console.log(newObject)
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
  if (formData.value?.menuUploads?.length) {
    formData.value.menuUploads.forEach((file) => {
      if (file instanceof File) {
        files.push(file)
        fileMapper.push({
          resource: 'menu',
          name: file.name
        })
      }
    })
  }
  if (formData.value?.halalCertificatesUploads?.length) {
    formData.value.halalCertificatesUploads.forEach((file) => {
      if (file instanceof File) {
        files.push(file)
        fileMapper.push({
          resource: 'halalCertificates',
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
      ? await axios.patch(`admin/restaurant/restaurants/${id.value}`, payload)
      : await axios.post('admin/restaurant/restaurants', payload)
    if (response.data) {
      store.showSnackbar('Successfully Saved')
      router.back()
    }
  } else {
    panel.value = [0]
  }
}
const onUploadsUpdate = (images, key) => {
  formData.value[key] = images
}
const loadItems = async () => {
  const payload = {
    page: table_data.value.page,
    perPage: table_data.value.itemsPerPage,
    search: table_data.value.search
  }
  await axios
    .post('admin/restaurant/restaurants-list', {
      ...payload
    })
    .then((res) => {
      table_data.value.serverItems = res?.data?.data
      table_data.value.totalItems = res?.data?.total
    })
}
const managers = computed(() => {
  return store.managers
})
const confirmDelete = async () => {
  await axios
    .delete(`admin/restaurant/restaurants/${store.details?._id}`)
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
const onImageUpdate = (data, key) => {
  formData.value[key] = [...data]
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
    .patch(
      `admin/restaurant/restaurants/${store.details?._id}/update-halal-ratings`,
      {
        ratingIds: ids
      }
    )
    .then(async (res) => {
      store.showSnackbar('Ratings updated successfully')
      store.setDetails({})
      await loadItems()
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
            await loadItems()
            store.showSnackbar('Invitation sent Successfully')
            await store.updateUserRoleAndPermissions(
              selectedManager.value._id,
              'manager',
              [permissions.restaurantRestaurant,permissions.restaurantUpdateHalalRatings]
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
    .patch(
      `admin/restaurant/restaurants/${store.details?._id}/update-manager`,
      {
        managerId: selectedManager.value?._id
      }
    )
    .then(async (res) => {
      if (res?.status === 200) {
        store.showSnackbar('Manager assigned successfully')
        await loadItems()
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
    .patch(
      `admin/restaurant/restaurants/${store.details?._id}/update-manager`,
      {
        managerId: null
      }
    )
    .then(async (res) => {
      if (res?.status === 200) {
        store.showSnackbar('Manager removed successfully')
        await loadItems()
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
const getCuisinesList = async () => {
  await axios.get('admin/restaurant/cuisines').then((res) => {
    cuisinesList.value = res.data
  })
}
const getSpecialDietsList = async () => {
  await axios.get('admin/restaurant/special-diets').then((res) => {
    specialDietsList.value = res.data
  })
}
const getFileName = (url) => {
  if (!url) return 'File'
  return url.split('/').pop()
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
  if (store.hasPermission(permissions.restaurantUpdateHalalRatings)) {
    await axios.get('admin/restaurant-halal-ratings').then((res) => {
      if (res?.data?.length) {
        ratings.value = res?.data
      }
    })
  }
  await getCuisinesList()
  await getSpecialDietsList()
  if (id.value) {
    const details = await axios.get(`admin/restaurant/restaurants/${id.value}`)
    if (details?.data?._id) {
      if (formMode.value) {
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
