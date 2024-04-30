<template>
  <div>
    <h4>
      <v-icon icon="mdi-account-circle"> </v-icon> Hi,
      {{
        store?.user?.data?.name
          ? store?.user?.data?.name
          : store.getUserName(store?.user?.data?.email)
      }}
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
import { useAppStore } from '@/store/app'
import { onMounted } from 'vue'

const store = useAppStore()


onMounted(async () => {
  if (store.user?.data?._id) {
    const userInfo = await store.getUserInfo()
    if (userInfo?.data?._id) {
      store.setUser({ data: userInfo.data })
    }
  }
})
</script>

<style lang="scss" scoped></style>
