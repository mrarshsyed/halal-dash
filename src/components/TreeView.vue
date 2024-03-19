<template>
  <p class="mt-3 mb-1">
    Assign Permission
  </p>
  <v-list
    density="compact"
    :opened="['user']"
    style="width: 100%; overflow: hidden"
    class="border rounded px-4"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in userCreatePermissions"
        :key="index"
      >
        <div v-if="!item.children?.length">
          <v-list-item
            :title="item?.title"
            :value="item?.value"
          >
            <template #prepend="">
              <v-list-item-action start>
                <v-checkbox-btn
                  :value="item.value"
                  v-model="selectedItems"
                />
              </v-list-item-action>
            </template>
          </v-list-item>
        </div>
        <v-list-group
          v-else
          :value="item.value"
          class="lp-3 shadow border"
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="item?.title"
              class="rounded mt-1"
            />
          </template>
          <v-list-item
            v-for="(child, childIndex) in item?.children"
            :key="childIndex"
            :title="child?.title"
          >
            <template #prepend="">
              <v-list-item-action start>
                <v-checkbox-btn
                  :value="child.value"
                  v-model="selectedItems"
                />
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list-group>
      </v-col>
    </v-row>
  </v-list>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import {  computed } from 'vue'
import { userCreatePermissions } from '@/config/userRoutes'

const store = useAppStore()


const selectedItems = computed({
  get: () => {
    return store.dialog.formComponents?.fields[2]?.value
  },
  set: (newValue) => {
    // Assuming fields[2] already exists, if not, you may need to initialize it
    if (store.dialog.formComponents?.fields[2]) {
      store.dialog.formComponents.fields[2].value = newValue
    }
  }
})
</script>
