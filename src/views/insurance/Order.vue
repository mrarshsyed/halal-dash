<template>
  <div>
    <v-data-table-server
      class="mt-4"
      density="compact"
      v-model:items-per-page="table_data.itemsPerPage"
      :headers="table_data.headers"
      :items-length="table_data.totalItems"
      :items="table_data.serverItems"
      :search="table_data.search"
      :items-per-page-options="table_data.itemsPerPageOption"
      :page="table_data.page"
      @update:options="loadItems"
      :show-current-page="true"
    >
      <template #item.id="{ item }">
        {{ item?._id }}
      </template>
      <template #item.package="{ item }">
        {{ item?.insurancePackage?.name }}
      </template>
      <template #item.user_name="{ item }">
        {{ item?.mainContact?.name }}
      </template>
      <template #item.user="{ item }">
        {{ item?.mainContact.email }}
      </template>
      <template #item.contactNumber="{ item }">
        {{ item?.mainContact?.phone }}
      </template>
      <template #item.dates="{ item }">
        <div
          class="d-block"
          style="width: max-content"
        >
          <p>
            Start Date: {{ format(new Date(item?.travelingDate?.start), 'dd MMM yyyy') ?? '-' }}
          </p>
          <p>
            End Date: {{ format(new Date(item?.travelingDate?.end), 'dd MMM yyyy') ?? '-' }}
          </p>
        </div>
      </template>
      <template #item.guests="{ item }">
        <div
          class="d-block"
          style="width: max-content"
        >
          <p>Adults : {{ item?.travelerInformation?.adults?.count }}</p>
          <p>Children : {{ item?.travelerInformation?.children?.count }}</p>
          <p>Senior: {{ item?.travelerInformation?.seniors?.count }}</p>
        </div>
      </template>
      <template #item.price="{ item }">
        AED {{ item?.quotedPrice }}
      </template>
      <template #item.port="{ item }">
        {{ item?.preferredDeparturePort?.name }}
      </template>
      <template #item.enquiry_on="{ item }">
        {{ format(new Date(item?.createdAt), 'dd MMM yyyy') ?? '-' }}
      </template>
    </v-data-table-server>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axiosInstance from '@/plugins/axios'
  import { format } from 'date-fns'
  
  const table_data = ref({
    loading: true,
    search: '',
    itemsPerPage: 20,
    totalItems: 0,
    page: 1,
    serverItems: [],
    headers: [
      { title: 'ID', key: 'id', align: 'start' },
      { title: 'Package', key: 'package', align: 'start' },
      { title: 'User Name', key: 'user_name', align: 'start' },
      { title: 'User Email', key: 'user', align: 'start' },
      { title: 'Contact Number', key: 'contactNumber', align: 'start' },
      { title: 'Dates', key: 'dates', align: 'start' },
      { title: 'Travellers', key: 'guests', align: 'start' },
      { title: 'Price', key: 'price', align: 'start' },
      { title: 'Enquiry On', key: 'enquiry_on', align: 'start' }
    ],
    itemsPerPageOption: [
      { value: 20, title: '20' },
      { value: 40, title: '40' }
    ]
  })
  const loadItems = async ({ page, itemsPerPage, sortBy }) => {
    table_data.value.page = page
    await axiosInstance
      .get(`admin/insurance/orders`, {
        params: {
          page: page,
          perPage: itemsPerPage
        }
      })
      .then((res) => {
        // store.setUserList(res?.data?.data)
        table_data.value.serverItems = res?.data?.data
        table_data.value.totalItems = res?.data?.total
      })
  }
  onMounted(async () => {})
  </script>
  