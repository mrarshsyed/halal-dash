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
        component: () => import('@/views/hotels/Ratings.vue'),
        meta: { requiresAuth: true, role: ['admin', 'employee'] }
      },
      {
        path: 'orders',
        component: () => import('@/views/hotels/Orders.vue'),
        meta: { requiresAuth: true, role: ['admin', 'employee'] }
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
    title: 'Users',
    value: 'users',
    icon: 'account-box',
    to: '/users',
    role: ['admin', 'employee'],
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
        value: 'hotels-list',
        role: ['admin', 'employee', 'manager']
      },
      {
        icon: 'star-box',
        title: 'Ratings',
        to: '/hotels/ratings',
        value: 'hotels-ratings',
        role: ['admin', 'employee']
      },
      {
        icon: 'file-document-multiple',
        title: 'Orders',
        to: '/hotels/orders',
        value: 'hotels-orders',
        role: ['admin', 'employee']
      }
    ]
  }
]
