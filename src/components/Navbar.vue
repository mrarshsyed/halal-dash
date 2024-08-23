<template>
  <v-layout>
    <v-app-bar density="comfortable" class="py-1">
      <!-- <v-app-bar-nav-icon
        v-if="store?.user?.data._id"
        variant="text"
        @click.stop="drawer != drawer"
      /> -->

      <v-app-bar-title class="cursor-pointer" @click="$router.push('/')">
        <v-img src="@/assets/logo.svg" height="80px" width="220px" />
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
      v-model="drawer"
      location="left"
      permanent
      style="min-width: max-content"
      class="py-2"
      :key="navKey"
    >
      <v-list nav>
        <div v-for="(item, index) in links" :key="index">
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
        <v-progress-linear v-if="loading" indeterminate color="primary" />
        <v-card class="pa-4 overflow-scroll">
          <slot />
        </v-card>
        <v-progress-linear v-if="loading" indeterminate color="primary" />
      </v-container>
    </v-main>
  </v-layout>
</template>
<script setup>
import { useAppStore } from '@/store/app'
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const store = useAppStore()
const theme = useTheme()

const links = computed(() => {
  return store.sideBarLinks
})

const navKey = computed(() => {
  return store.sideBarLinks?.length ? store.sideBarLinks.length : 0
})
const loading = computed(() => store.isLoading)

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const drawer = computed({
  get: () => {
    return store.sideBarLinks?.length ? true : false
  },
  set: (newValue) => {
    // Assuming fields[2] already exists, if not, you may need to initialize it
    console.log(newValue)
  }
})
</script>
