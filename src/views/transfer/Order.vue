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
      <template #item.user_name="{ item }">
        {{ item?.user?.name }}
      </template>
      <template #item.user="{ item }">
        {{ item?.user.email }}
      </template>
      <template #item.contactNumber="{ item }">
        {{ item?.user?.contactNumber }}
      </template>
      <template #item.from="{ item }">
        {{ item?.search?.from?.description }}
      </template>
      <template #item.to="{ item }">
        {{ item?.search?.to?.description }}
      </template>
      
     
      <template #item.guests="{ item }">
        <div
          class="d-block"
          style="width: max-content"
        >
          <p>Adults : {{ item?.search?.occupancy?.adults }}</p>
          <p>Children : {{ item?.search?.occupancy?.children }}</p>
        </div>
      </template>
      <template #item.price="{ item }">
        {{ item?.service?.price?. currencyId }} {{ item?.service?.price?.clientAmount }}
      </template>

      <template #item.enquiry_on="{ item }">
        {{ item?.createdAt ? format(new Date(item?.createdAt), 'dd MMM yyyy') : '-' }}
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
      { title: 'Reference', key: 'clientReference', align: 'start' },
      { title: 'User Name', key: 'user_name', align: 'start' },
      { title: 'User Email', key: 'user', align: 'start' },
      { title: 'Contact Number', key: 'contactNumber', align: 'start' },
      { title: 'Status', key: 'status', align: 'start' },
      {title: 'From', key: 'from', align: 'start'},
      {title: 'To', key: 'to', align: 'start'},
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
      .get(`admin/transfer/bookings`, {
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
  