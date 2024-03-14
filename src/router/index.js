// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store/app'
import { routes } from '@/config/userRoutes'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta?.requiresAuth)) {
    const store = useAppStore()
    if (!store.getUser) {
      next({
        name: 'authentication',
        query: { mode: 'Login' }
      })
    } else {
      const user = await store.getUserInfo()
      if (user?.data?._id) {
        let data = store.user
        data.data = user?.data
        store.setUser(data)
      }
      if (
        to.meta?.role?.length &&
        to.meta?.role.includes(store.getUser?.data?.role)
      ) {
        console.log();
        next()

        // if (
        //   (store.getUser?.data?.role === 'admin' ||
        //     store.getUser?.data?.role === 'employee') &&
        //   to.matched[0]?.name === 'hotels' &&
        //   !store.getUser?.data?.permissions?.includes('hotel-all')
        // ) {
        //   next({ name: 'dashboard' })
        // } 
        
        // else {
        //   if (
        //     (store.getUser?.data?.role === 'admin' ||
        //       store.getUser?.data?.role === 'employee') &&
        //     to.matched[0]?.name === 'activity' &&
        //     !store.getUser?.data?.permissions?.includes('activity-all')
        //   ) {
        //     next({ name: 'dashboard' })
        //   }
        //   else {
        //     next()
        //   }
        // }

      } else {
        next({
          name: 'authentication',
          query: { mode: 'Login' }
        })
      }
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
