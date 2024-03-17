// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store/app'
import { routes } from '@/config/userRoutes'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const store = useAppStore()

  // Check if the route requires authentication
  if (to.meta?.requiresAuth) {
    try {
      // Ensure user is logged in
      if (!store.getUser) {
        throw new Error('User not logged in')
      }

      // Fetch user information
      const userInfo = await store.getUserInfo()

      // Update user information in the store
      if (userInfo?.data?._id) {
        store.setUser({ data: userInfo.data })
      }

      // Check user roles for authorization
      if (to.meta.role && !to.meta.role.includes(store.getUser.data.role)) {
        throw new Error('Unauthorized access')
      }
      if (userInfo.data?.role === 'super-admin') {
        return next()
      }

      if (
        to.meta.permissions &&
        !to.meta.permissions.some((permission) =>
          (store.getUser.data.permissions || []).includes(permission)
        )
      ) {
        throw new Error('Insufficient permissions')
      }
    } catch (error) {
      // Redirect to authentication page for login or handle unauthorized access
      return next({ name: 'pageNotFound',})
    }
  }

  // Allow access to the route
  next()
})

export default router
