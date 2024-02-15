<template>
  <div>
    <h4>
      <v-icon icon="mdi-account-circle"> </v-icon> Hi,
      {{ store.getUserName() }}
    </h4>
    <p>
      Your Role is <v-chip>{{ store?.user?.data?.role }}</v-chip>
    </p>
    <p class="mt-4">Welcome To Dashboard</p>
    <!-- <p class="mb-10">Modules</p>
    <v-row class="ga-4">
      <v-col cols="12" v-for="(m, index) in navLinks" :key="index">
        <v-card>
          <v-card-title>
            <v-icon :icon="'mdi-' + m?.icon"></v-icon>
            {{ m?.title }}
          </v-card-title>
        </v-card>
        <v-row class="ga-4 my-4">
          <v-col cols="4" v-for="(c, indexj) in m?.children" :key="indexj">
            <v-card>
              <v-card-title>
                <v-icon :icon="'mdi-' + c?.icon"></v-icon> {{ c?.title }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
  </div>
</template>

<script setup>
import { navLinks } from '@/config/userRoutes'
import { useAppStore } from '@/store/app'
import { ref, onMounted } from 'vue'

const store = useAppStore()
const dashboardRoutes = ref(navLinks)
const routes = ref([])
const modules = [
  {
    title: 'Users Management',
    icon: 'account-circle',
    description: 'Manage All Users',
    to: '/users'
  },
  {
    title: 'Hotels List',
    icon: 'home-city',
    description: 'Manage All hotels',
    to: '/hotels/list'
  }
]

const getUserName = (email) => {
  const emailParts = email.split('@')
  const userName = emailParts[0]
  return userName
}
onMounted(async () => {
  routes.value = dashboardRoutes.value?.filter((x) => x?.children)
  console.log(routes.value)
})
</script>

<style lang="scss" scoped></style>
