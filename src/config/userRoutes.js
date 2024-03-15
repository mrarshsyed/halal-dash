export const permissions = {
  userAll: 'user-all',
  userList: 'user-list',
  userCreate: 'user-create',
  userRolePermissionUpdate: 'user-role_permission_update',
  userDelete: 'user-delete',
  hotelAll: 'hotel-all',
  hotelList: 'hotel-list',
  hotelUpdateManager: 'hotel-update_manager',
  hotelUpdateHalalRatings: 'hotel-update_halal_ratings',
  hotelBookingAll: 'hotel_booking-all',
  hotelBookingList: 'hotel_booking-list',
  activityAll: 'activity-all',
  activityAddToSystem: 'activity-add_to_system',
  activityList: 'activity-list',
  activityUpdateManager: 'activity-update_manager',
  activityUpdateHalalRatings: 'activity-update_halal_ratings',
  activityBookingAll: 'activity_booking-all',
  activityBookingList: 'activity_booking-list',
  settingAll:'setting-all',
  hotelHalalRating :'hotel-halal-rating',
  activityHalalRating: 'activity-halal-rating',
  profitSettings:'profit-settings',
}

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
      permissions: [permissions.userAll, permissions.userList]
    }
  },
  {
    path: '/hotels',
    name: 'hotels',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager'],
      permissions: []
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hotels/List.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: [permissions.hotelAll, permissions.hotelList]
        }
      },
      {
        path: 'ratings',
        component: () => import('@/views/hotels/Ratings.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin'],
          permissions: []
        }
      },
      {
        path: 'orders',
        component: () => import('@/views/hotels/Orders.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.hotelBookingAll]
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
          permissions: [
            permissions.activityAll,
            permissions.activityAddToSystem
          ]
        }
      },
      {
        path: 'list',
        component: () => import('@/views/activity/List.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: [permissions.activityAll, permissions.activityList]
        }
      },
      {
        path: 'ratings',
        component: () => import('@/views/activity/Ratings.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin'],
          permissions: []
        }
      },
      {
        path: 'orders',
        component: () => import('@/views/activity/Orders.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.activityBookingAll]
        }
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    meta: {
      requiresAuth: true,
      role: ['super-admin'],
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
    children: [],
    permissions: []
  },
  {
    title: 'Users',
    value: 'users',
    icon: 'account-box',
    to: '/users',
    role: ['super-admin', 'admin', 'employee'],
    children: [],
    permissions: [permissions.userAll, permissions.userList]
  },
  {
    title: 'Hotels',
    value: 'hotels',
    icon: 'home-city',
    role: ['super-admin', 'admin', 'employee', 'manager'],    
    permissions: [permissions.hotelAll, permissions.hotelList, permissions.hotelBookingAll],
    children: [
      {
        icon: 'view-list',
        title: 'List',
        to: '/hotels/list',
        value: 'hotels-list',
        role: ['super-admin', 'admin', 'employee', 'manager'],
        permissions: [
          permissions.hotelAll,
          permissions.hotelList,
         
        ]
      },
      {
        icon: 'star-box',
        title: 'Ratings',
        to: '/hotels/ratings',
        value: 'hotels-ratings',
        role: ['super-admin'],
        permissions: [permissions.hotelHalalRating]
      },
      {
        icon: 'file-document-multiple',
        title: 'Orders',
        to: '/hotels/orders',
        value: 'hotels-orders',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.hotelBookingAll]
      }
    ],
  },
  {
    title: 'Activity',
    value: 'activity',
    icon: 'hydro-power',
    role: ['super-admin', 'admin', 'employee', 'manager'],
    permissions: [
      permissions.activityAll,
      permissions.activityList,
      permissions.activityBookingAll,
      permissions.activityAddToSystem
    ],
    children: [
      {
        icon: 'text-box-search',
        title: 'Search And Add',
        to: '/activity/search-and-add',
        value: 'activity-search-and-add',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.activityAll, permissions.activityAddToSystem]
      },
      {
        icon: 'view-list',
        title: 'List',
        to: '/activity/list',
        value: 'activity-list',
        role: ['super-admin', 'admin', 'employee', 'manager'],
        permissions: [permissions.activityAll, permissions.activityList]
      },
      {
        icon: 'star-box',
        title: 'Ratings',
        to: '/activity/ratings',
        value: 'activity-ratings',
        role: ['super-admin'],
        permissions: [permissions.hotelHalalRating]
      },
      {
        icon: 'file-document-multiple',
        title: 'Orders',
        to: '/activity/orders',
        value: 'activity-orders',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.activityBookingAll]
      }
    ]
  },
  {
    title: 'Settings',
    value: 'settings',
    icon: 'cog',
    role: ['super-admin'],
    permissions: [permissions.settingAll],
    children: [
      {
        icon: 'cash',
        title: 'Profit',
        to: '/settings/profit',
        value: 'settings-profit',
        role: ['super-admin'],
        permissions: [permissions.profitSettings]
      }
    ]
  }
]
