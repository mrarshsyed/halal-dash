<template>
  <p class="mt-3 mb-1">
    Assign Permission
  </p>
  <v-list
    :opened="['hotel', 'activity']"
    style="width: 100%; overflow: hidden"
    class="border rounded"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in navLinks"
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
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="item?.title"
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
import { ref ,computed,} from 'vue'

const store = useAppStore()

const navLinks = [
  {
    title: 'Hotels',
    value: 'hotel-all',
    children: []
    // {
    //     title: 'List',
    //     value: 'hotel-list'
    //   },
    //   {
    //     title: 'Assign & Remove Manager',
    //     value: 'hotel-update-manager'
    //   },
    //   { title: 'Add Rating', value: 'hotel-update-halal-ratings' },
    //   { title: 'Order', value: 'hotel-booking-all' }
    
  },
  {
    title: 'Activities',
    value: 'activity-all',
    children: []
    
    //   {
    //     title: 'Search & Add',
    //     value: 'activity-add-to-system'
    //   },
    //   {
    //     title: 'List',
    //     value: 'activity-list'
    //   },
    //   {
    //     title: 'Assign & Remove Manager',
    //     value: 'activity-update-manager'
    //   },
    //   { title: 'Add Rating', value: 'activity-update-halal-ratings' },
    //   { title: 'Order', value: 'activity-booking-all' }
    // 
  },
]
const selectedItems = computed({
  get: () => {
    return store.dialog.formComponents?.fields[2]?.value;
  },
  set: (newValue) => {
    // Assuming fields[2] already exists, if not, you may need to initialize it
    if (store.dialog.formComponents?.fields[2]) {
      store.dialog.formComponents.fields[2].value = newValue;
    }
  },
});

</script>
