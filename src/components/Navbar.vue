<template>
  <v-layout>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-nav-icon
        v-if="store.getUser"
        variant="text"
        @click.stop="data.drawer = !data.drawer"
      />

      <v-app-bar-title class="cursor-pointer" @click="$router.push('/')">
        Halal Explore
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
        @click="store.logout()"
      />
    </v-app-bar>

    <v-navigation-drawer
      v-model="data.drawer"
      location="left"
      v-if="store.getUser"
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
          >
          </v-list-item>
          <v-list-group v-else :value="item?.value">
            <template v-slot:activator="{ props }">
              <v-list-item
                color="primary"
                v-bind="props"
                :prepend-icon="'mdi-' + item?.icon"
                :title="item?.title"
                :value="item?.value"
                exact
                link
              ></v-list-item>
            </template>
            <v-list-item
              v-for="(child, childIndex) in item?.children"
              :key="childIndex"
              :title="child?.title"
              :prepend-icon="'mdi-' + child?.icon"
              :value="child?.value"
              :to="child?.to"
              color="primary"
            ></v-list-item>
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

const store = useAppStore()
const theme = useTheme()

const data = ref({
  drawer: false,
  group: null,
  items: [
    {
      title: 'Dashboard',
      value: 'dashboard',
      icon: 'clock',
      to: '/dashboard',
      role: ['admin', 'staff', 'manager'],
      children: []
    },
    {
      title: 'Hotels',
      value: 'hotels',
      icon: 'home-city',
      role: ['admin', 'staff', 'manager'],
      children: [
        {
          icon: 'view-list',
          title: 'List',
          to: '/hotels/list',
          value: 'hotels-list'
        },
        {
          icon: 'star-box',
          title: 'Ratings',
          to: '/hotel/ratings',
          value: 'hotels-ratings'
        },
        {
          icon: 'file-document-multiple',
          title: 'Orders',
          to: '/hotel/orders',
          value: 'hotels-orders'
        }
      ]
    },
    {
      title: 'Users',
      value: 'users',
      icon: 'account-box',
      to: '/users',
      role: ['admin', 'staff'],
      children: []
    }
  ],
  open: []
})

const filteredItems = computed(() => {
  return data.value.items.filter((i) =>
    i?.role?.includes(store.getUser?.data?.role)
  )
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
</script>
