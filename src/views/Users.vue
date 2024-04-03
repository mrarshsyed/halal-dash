<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="table_data.search"
          placeholder="Enter search here ..."
        />
      </v-col>
      <v-col
        v-if="store.hasPermission(permissionList.userCreate)"
        cols="12"
        md="4"
      >
        <v-btn @click="showDialog" block color="primary">
          + Add New User
        </v-btn>
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
      :page="table_data.page"
      :show-current-page="true"
    >
      <template #item.role="{ item }">
        <v-chip>
          <div style="min-width: 50px" class="text-center">
            {{ item?.role }}
          </div>
        </v-chip>
      </template>
      <template #item.isVerified="{ item }">
        <v-icon
          v-if="item?.isVerified"
          color="success"
          icon="mdi-check-circle"
        />
        <v-icon v-else color="error" icon="mdi-close-circle" />
      </template>
      <template #item.action="{ item }">
        <v-icon
          v-if="store.hasPermission(permissionList.userRolePermissionUpdate)"
          @click="onEdit(item)"
          color="primary"
          class="cursor-pointer"
        >
          mdi-pen
        </v-icon>
        <v-icon
          @click="onDelete(item)"
          v-if="store.hasPermission(permissionList.userDelete)"
          color="error"
          class="cursor-pointer"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <!-- @update:options="loadItems" -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/app'
import axiosInstance from '@/plugins/axios'
import { permissions as permissionList } from '@/config/userRoutes'
const store = useAppStore()
const user = ref(null)

const getUserOption = () => {
  const current_role = store.user?.data?.role
  if (current_role === 'super-admin') {
    return [
      { id: 'admin', title: 'Admin' },
      { id: 'employee', title: 'Employee' },
      { id: 'manager', title: 'Manager' }
    ]
  } else if (current_role === 'admin') {
    return [
      { id: 'employee', title: 'Employee' },
      { id: 'manager', title: 'Manager' }
    ]
  } else if (current_role === 'employee') {
    return [{ id: 'manager', title: 'Manager' }]
  } else {
    return []
  }
}

const userForm = ref({
  fields: [
    {
      type: 'email',
      label: 'Email Address',
      isRequired: true,
      value: null,
      key: 'email'
    },
    {
      type: 'select',
      label: 'Role',
      isRequired: true,
      options: getUserOption(),
      value: null,
      key: 'role'
    },
    {
      type: 'treeview',
      isRequired: true,
      value: [],
      cols: '12',
      md: '12',
      show: store.user.data?.role === 'employee' ? false : true,
      key: 'permission'
    }
  ]
})

const updateRoleAndPermission = async () => {
  await store
    .updateUserRoleAndPermissions(
      user.value._id,
      store.getFieldValue('role'),
      store.getFieldValue('permission')
    )
    .then(async (res) => {
      if (res?.data?._id) {
        store.showSnackbar('successfully updated')
        await loadItems({
          page: table_data.value.page,
          itemsPerPage: table_data.value.itemsPerPage,
          sortBy: 'ascending'
        })
        user
        store.dialog.show = false
      }
    })
}

const onEdit = (item) => {
  user.value = item
  userForm.value.fields[0].value = item?.email
  userForm.value.fields[1].value = item?.role
  userForm.value.fields[2].value = item?.permissions
  const dialogModal = {
    title: 'Update User',
    content: '',
    confirmText: 'Update',
    formComponents: userForm.value,
    confirmFunction: updateRoleAndPermission
  }
  store.showDialog(dialogModal)
}

const resetForm = async () => {
  userForm.value.fields = userForm.value.fields?.map((form) => {
    return {
      ...form,
      value: form?.type === 'treeview' ? [] : null
    }
  })
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  await axiosInstance
    .get('admin/users', {
      page: page,
      itemsPerPage: itemsPerPage,
      sortBy: sortBy
    })
    .then((res) => {
      if (res?.data?.length) {
        // store.setUserList(res?.data?.data)
        if (store.user.data?.role === 'super-admin') {
          table_data.value.serverItems = res?.data?.filter(
            (x) => x?.role !== 'super-admin'
          )
        } else if (store.user.data?.role === 'admin') {
          table_data.value.serverItems = res?.data?.filter(
            (x) => x?.role !== 'admin' && x?.role !== 'super-admin'
          )
        } else if (store.user.data?.role === 'employee') {
          table_data.value.serverItems = res?.data?.filter(
            (x) => x?.role == 'manager'
          )
        }
        table_data.value.totalItems = res?.data?.length
      }
    })
}

const table_data = ref({
  loading: true,
  search: '',
  itemsPerPage: 10,
  totalItems: 0,
  page: 1,
  serverItems: [],
  headers: [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Email', key: 'email', align: 'start' },
    { title: 'Role', key: 'role', align: 'center' },
    { title: 'Is Verified', key: 'isVerified', align: 'center' },
    { title: 'Action', key: 'action', align: 'center' }
  ],
  itemsPerPageOption: [
    { value: 10, title: '10' },
    { value: 100, title: '20' },
    { value: -1, title: 'All' }
  ]
})

const sendVerificationEmail = async () => {
  const payload = {
    email: store.dialog.formComponents?.fields[0]?.value,
    role: store.dialog.formComponents?.fields[1]?.value,
    permissions: store.dialog.formComponents?.fields[2].value
  }

  await store.createUser(payload.email, payload.role).then(async (res) => {
    if (res?.status === 200) {
      store.showSnackbar('Invitation Link sent Successfully')
      await loadItems({
        page: table_data.value.page,
        itemsPerPage: table_data.value.itemsPerPage,
        sortBy: 'ascending'
      })
      user.value = res?.data
      await updateRoleAndPermission()
      user.value = null
      store.closeDialog()
      resetForm()
    }
  })
}

const showDialog = () => {
  resetForm()
  const dialogModal = {
    title: 'Add new user with role',
    content: '',
    confirmText: 'Send Email Verification Link',
    formComponents: userForm.value,
    confirmFunction: sendVerificationEmail
  }
  store.showDialog(dialogModal)
}

const permissions = ref([])

const loadPermissions = async () => {
  await axiosInstance.get('admin/settings/permissions').then((res) => {
    permissions.value = res.data?.data
  })
}

onMounted(async () => {
  await loadItems({
    page: table_data.value.page,
    itemsPerPage: table_data.value.itemsPerPage,
    sortBy: 'ascending'
  })
  await loadPermissions()
})

const canDelete = (item) => {
  const current_role = store.user?.data?.role
  if (current_role === 'super-admin' && item?.role === 'super-admin') {
    return false
  }
  if (current_role === 'admin' && item?.role === 'super-admin') {
    return false
  }
  if (current_role === 'admin' && item?.role === 'admin') {
    return false
  }
  if (current_role === 'employee' && item?.role === 'super-admin') {
    return false
  }
  if (current_role === 'employee' && item?.role === 'admin') {
    return false
  }
  if (current_role === 'employee' && item?.role === 'employee') {
    return false
  }
  return true
}

const confirmDelete = async () => {
  await axiosInstance
    .delete(`admin/users/${user.value?._id}`)
    .then(async () => {
      store.showSnackbar('Successfully Deleted')
      await loadItems({
        page: table_data.value.page,
        itemsPerPage: table_data.value.itemsPerPage,
        sortBy: 'ascending'
      })
      store.closeDialog()
    })
}

const onDelete = (item) => {
  user.value = item
  const dialogModal = {
    title: 'Delete User',
    content: `Are you sure to delete this user?`,
    confirmText: 'Delete',
    formComponents: { fields: [] },
    confirmFunction: confirmDelete
  }
  store.showDialog(dialogModal)
}
watch(
  () => store.getFieldValue('role'),
  () => {
    console.log(store.getFieldValue('role'))
    if (
      store.getFieldValue('role') === 'admin' ||
      store.getFieldValue('role') === 'employee'
    ) {
      store.dialog.formComponents.fields[2].show = true
    } else {
      store.dialog.formComponents.fields[2].show = false
    }
  }
)
</script>

<style lang="scss" scoped></style>
