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
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager']
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/Users.vue'),
    meta: { requiresAuth: true, role: ['super-admin', 'admin', 'employee'] }
  },
  {
    path: '/hotels',
    name: 'hotels',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hotels/List.vue'),
        meta: { requiresAuth: true, role: ['super-admin', 'admin', 'employee'] }
      },
      {
        path: 'ratings',
        component: () => import('@/views/hotels/Ratings.vue'),
        meta: { requiresAuth: true, role: ['super-admin', 'admin'] }
      },
      {
        path: 'orders',
        component: () => import('@/views/hotels/Orders.vue'),
        meta: { requiresAuth: true, role: ['super-admin', 'admin', 'employee'] }
      }
    ]
  },
  {
    path: '/activity',
    name: 'activity',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager']
    },
    children: [
      {
        path: 'search-and-add',
        component: () => import('@/views/activity/searchAndAdd.vue'),
        meta: { requiresAuth: true, role: ['super-admin', 'admin', 'employee'] }
      },
      {
        path: 'list',
        component: () => import('@/views/activity/List.vue'),
        meta: { requiresAuth: true, role: ['super-admin', 'admin', 'employee'] }
      },
      {
        path: 'ratings',
        component: () => import('@/views/activity/Ratings.vue'),
        meta: { requiresAuth: true, role: ['super-admin', 'admin'] }
      },
      {
        path: 'orders',
        component: () => import('@/views/activity/Orders.vue'),
        meta: { requiresAuth: true, role: ['super-admin', 'admin', 'employee'] }
      }
    ]
  }
]

export const navLinks = [
  {
    title: 'Dashboard',
    value: 'dashboard',
    icon: 'clock',
    to: '/dashboard',
    role: ['super-admin', 'admin', 'employee', 'manager'],
    children: []
  },
  {
    title: 'Users',
    value: 'users',
    icon: 'account-box',
    to: '/users',
    role: ['super-admin', 'admin', 'employee'],
    children: []
  },
  {
    title: 'Hotels',
    value: 'hotels',
    icon: 'home-city',
    role: ['super-admin', 'admin', 'employee', 'manager'],
    children: [
      {
        icon: 'view-list',
        title: 'List',
        to: '/hotels/list',
        value: 'hotels-list',
        role: ['super-admin', 'admin', 'employee', 'manager']
      },
      {
        icon: 'star-box',
        title: 'Ratings',
        to: '/hotels/ratings',
        value: 'hotels-ratings',
        role: ['super-admin']
      },
      {
        icon: 'file-document-multiple',
        title: 'Orders',
        to: '/hotels/orders',
        value: 'hotels-orders',
        role: ['super-admin', 'admin', 'employee']
      }
    ]
  },
  {
    title: 'Activity',
    value: 'activity',
    icon: 'hydro-power',
    role: ['super-admin', 'admin', 'employee', 'manager'],
    children: [
      {
        icon: 'text-box-search',
        title: 'Search And Add',
        to: '/activity/search-and-add',
        value: 'activity-search-and-add',
        role: ['super-admin', 'admin', 'employee', 'manager']
      },
      {
        icon: 'view-list',
        title: 'List',
        to: '/activity/list',
        value: 'activity-list',
        role: ['super-admin', 'admin', 'employee', 'manager']
      },
      {
        icon: 'star-box',
        title: 'Ratings',
        to: '/activity/ratings',
        value: 'activity-ratings',
        role: ['super-admin']
      },
      {
        icon: 'file-document-multiple',
        title: 'Orders',
        to: '/activity/orders',
        value: 'activity-orders',
        role: ['super-admin', 'admin', 'employee']
      }
    ]
  }
]
