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
    meta: { requiresAuth: true, role: ['admin', 'employee', 'manager'] }
  },
  {
    path: '/hotels',
    name: 'hotels',
    meta: { requiresAuth: true, role: ['admin', 'employee', 'manager'] },
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
    meta: { requiresAuth: true, role: ['admin', 'employee'] }
  }
]

export const navLinks = [
  {
    title: 'Dashboard',
    value: 'dashboard',
    icon: 'clock',
    to: '/dashboard',
    role: ['admin', 'employee', 'manager'],
    children: []
  },
  {
    title: 'Hotels',
    value: 'hotels',
    icon: 'home-city',
    role: ['admin', 'employee', 'manager'],
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
    role: ['admin', 'employee'],
    children: []
  }
]
