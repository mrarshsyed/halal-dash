// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store/app'

export const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'pageNotFound',
    component: () => import('@/views/PageNotFound.vue'),
    meta: { requiresAuth: false, role: [] }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false, role: [] }
  },
  {
    path: '/authentication',
    name: 'authentication',
    component: () => import('@/views/Auth.vue'),
    meta: { requiresAuth: false, role: [] }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, role: ['admin', 'staff', 'manager'] }
  },
  {
    path: '/hotels',
    name: 'hotels',
    meta: { requiresAuth: true, role: ['admin', 'staff', 'manager'] },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hotels/List.vue')
      },
      {
        path: 'ratings',
        component: () => import('@/views/hotels/Ratings.vue')
      },
      {
        path: 'orders',
        component: () => import('@/views/hotels/Orders.vue')
      }
    ]
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/Users.vue'),
    meta: { requiresAuth: true, role: ['admin', 'staff'] }
  }
]

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
