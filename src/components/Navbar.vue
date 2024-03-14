<template>
  <v-layout>
    <v-app-bar density="comfortable">
      <v-app-bar-nav-icon
        v-if="store.getUser"
        variant="text"
        @click.stop="data.drawer = !data.drawer"
      />

      <v-app-bar-title class="cursor-pointer" @click="$router.push('/')">
        <v-img src="@/assets/logo.png" height="56px" width="156px" />
      </v-app-bar-title>

      <v-spacer />

      <v-btn variant="text" icon="mdi-theme-light-dark" @click="toggleTheme" />
      <v-btn
        v-if="!store.getUser"
        text="Login"
        to="/authentication?mode=Login"
      />
      <v-btn v-if="store.getUser" variant="text" icon="mdi-account-circle" />
      <v-btn
        v-if="store.getUser"
        variant="text"
        icon="mdi-logout"
        @click="store.logout('call-api')"
      />
    </v-app-bar>

    <v-navigation-drawer
      v-model="data.drawer"
      location="left"
      v-if="store.user?.data?._id"
      permanent
    >
      <v-list nav>
        <div v-for="(item, index) in filteredItems" :key="index">
          <v-list-item
            :value="item?.value"
            color="primary"
            :to="item?.to"
            v-if="!item.children?.length"
            :prepend-icon="'mdi-' + item?.icon"
            :title="item?.title"
            exact
            link
          />
          <v-list-group v-else :value="item?.value">
            <template #activator="{ props }">
              <v-list-item
                color="primary"
                v-bind="props"
                :prepend-icon="'mdi-' + item?.icon"
                :title="item?.title"
                :value="item?.value"
                exact
                link
              />
            </template>
            <v-list-item
              v-for="(child, childIndex) in item?.children"
              :key="childIndex"
              :title="child?.title"
              :prepend-icon="'mdi-' + child?.icon"
              :value="child?.value"
              :to="child?.to"
              color="primary"
            />
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container style="max-width: 1000px">
        <v-card class="pa-4 overflow-scroll">
          <slot />
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script setup>
import { useAppStore } from '@/store/app'
import { watch, ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { navLinks } from '@/config/userRoutes'
import { onMounted } from 'vue'

const store = useAppStore()
const theme = useTheme()

const data = ref({
  drawer: false,
  group: null,
  items: navLinks,
  open: []
})

const filteredItems = computed(() => {
  return data.value.items.filter((item) => {
    const hasMainRouteRole = item?.role?.includes(store.getUser?.data?.role)
    // i?.role?.includes(store.getUser?.data?.role)
    // Check if the item has children and filter them based on role
    if (item.children && item.children.length > 0) {
      // Filter out child routes that the user doesn't have the required role for
      item.children = item.children.filter((child) =>
        child?.role?.includes(store.getUser?.data?.role)
      )
    }
    return hasMainRouteRole || (item.children && item.children.length > 0)
  })
})

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

watch(
  () => data.value.group,
  () => {
    data.value.drawer = false
  }
)
watch(() => data.value.drawer, (newValue, oldValue) => {
  if (
    (store.user?.data?.role === 'admin' || store?.user?.data?.role === 'employee') && !store?.user?.data?.permissions?.includes('activity-all')
  ) {
    data.value.items =  data.value.items?.filter((x=> x?.title !=='Activity'))
  }
  if (
    (store.user?.data?.role === 'admin' || store?.user?.data?.role === 'employee') && !store?.user?.data?.permissions?.includes('hotel-all')
  ) {
    data.value.items =  data.value.items?.filter((x=> x?.title !=='Hotels'))
  }

})

</script>
