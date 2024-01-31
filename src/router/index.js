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
      if (
        to.meta?.role?.length &&
        to.meta?.role.includes(store.getUser?.data?.role)
      ) {
        next()
      } else {
        next({
          name: 'pageNotFound',
          params: { pathMatch: ['not', 'found'] }
        })
      }
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
