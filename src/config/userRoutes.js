export const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'pageNotFound',
    component: () => import('@/views/PageNotFound.vue'),
    meta: { requiresAuth: false, role: [], permissions: [] }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false, role: [], permissions: [] }
  },
  {
    path: '/authentication',
    name: 'authentication',
    component: () => import('@/views/Auth.vue'),
    meta: { requiresAuth: false, role: [], permissions: [] }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: false,
      role: ['super-admin', 'admin', 'employee', 'manager'],
      permissions: []
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/Users.vue'),
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee'],
      permissions: ['user-all','user-list']
    }
  },
  {
    path: '/hotels',
    name: 'hotels',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager'],
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hotels/List.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: ['hotel-list','hotel-all']
        }
      },
      {
        path: 'ratings',
        component: () => import('@/views/hotels/Ratings.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin',],
          permissions: []
        }
      },
      {
        path: 'orders',
        component: () => import('@/views/hotels/Orders.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: ['hotel-booking-all']
        }
      }
    ]
  },
  {
    path: '/activity',
    name: 'activity',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager'],
      permissions: []
    },
    children: [
      {
        path: 'search-and-add',
        component: () => import('@/views/activity/searchAndAdd.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: ['activity-all','activity-add-to-system']
        }
      },
      {
        path: 'list',
        component: () => import('@/views/activity/List.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: ['activity-all','activity-list']
        }
      },
      {
        path: 'ratings',
        component: () => import('@/views/activity/Ratings.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin',],
          permissions: []
        }
      },
      {
        path: 'orders',
        component: () => import('@/views/activity/Orders.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: ['activity-all','activity-booking-all']
        }
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    meta: {
      requiresAuth: true,
      role: ['super-admin',],
      permissions: []
    },
    children: [
      {
        path: 'profit',
        component: () => import('@/views/settings/Profit.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin'],
          permissions: ['']
        }
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
        role: ['super-admin', 'admin', 'employee']
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
  },
  {
    title: 'Settings',
    value: 'settings',
    icon: 'cog',
    role: ['super-admin', ],
    children: [
      {
        icon: 'cash',
        title: 'Profit',
        to: '/settings/profit',
        value: 'settings-profit',
        role: ['super-admin']
      }
    ]
  }
]
