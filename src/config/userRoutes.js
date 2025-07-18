export const permissions = {
  // user
  userAll: 'user-all',
  userList: 'user-list',
  userCreate: 'user-create',
  userRolePermissionUpdate: 'user-role_permission_update',
  userDelete: 'user-delete',

  // hotel
  hotelAll: 'hotel-all',
  hotelList: 'hotel-list',
  hotelUpdateManager: 'hotel-update_manager',
  hotelUpdateHalalRatings: 'hotel-update_halal_ratings',
  hotelBookingAll: 'hotel_booking-all',
  hotelBookingList: 'hotel_booking-list',
  hotelHalalRating: 'hotel-halal-rating',
  hotelHalalRatingCategory: 'hotel-halal-rating-category',

  // activity
  activityAll: 'activity-all',
  activityAddToSystem: 'activity-add_to_system',
  activityList: 'activity-list',
  activityUpdateManager: 'activity-update_manager',
  activityUpdateHalalRatings: 'activity-update_halal_ratings',
  activityBookingAll: 'activity_booking-all',
  activityBookingList: 'activity_booking-list',
  activityHalalRating: 'activity-halal-rating',
  activityHalalRatingCategory: 'activity-halal-rating-category',

  // settings
  profitSettings: 'profit-settings',
  settingAll: 'setting-all',

  // cruise
  cruiseAll: 'cruise-all',
  cruiseMasterData: 'cruise-master_data',
  cruiseShip: 'cruise-ship',
  cruisePackage: 'cruise-package',
  cruiseEnquiry: 'cruise_enquiry-all',
  cruiseUpdateManager: 'cruise-update_manager',
  cruiseHalalRatingCategory: 'hotel-halal-rating-category',
  cruiseUpdateHalalRatings: 'cruise-update_halal_ratings',

  // restaurant
  restaurantHalalRating: 'restaurant-halal-rating',
  restaurantMasterData: 'restaurant-master_data',
  restaurantRestaurant: 'restaurant-restaurant',
  restaurantUpdateManager: 'restaurant-update_manager',
  restaurantHalalRatingCategory: 'restaurant-halal-rating-category',
  restaurantUpdateHalalRatings: 'restaurant-update_halal_ratings',

  // holiday
  holidayAll: 'holiday-all',
  holidayMasterData: 'holiday-master_data',
  holidayPackage: 'holiday-package',
  holidayEnquiry: 'holiday_enquiry-all',

  // insurance
  insuranceAll: 'insurance-all', //
  insuranceMasterData: 'insurance-master_data',
  insurancePackage: 'insurance-package',
  insuranceOrder: 'insurance_order-all',

  // transfer
  transferOrder: 'transfer_order-all',

  // custom holiday
  customHoliday: 'full_holiday_package-all',

  // blogs
  blogAll: 'blog-all',
  blogCreate: 'blog-create',
  blogUpdate: 'blog-update',
  blogDelete: 'blog-delete',

  // promo code
  promoAll: 'promo-all',
  promoCreate: 'promo-create',
  promoUpdate: 'promo-update',
  promoDelete: 'promo-delete',

  // carousel slider
  sliderAll: 'slider-all',
  sliderCreate: 'slider-create',
  sliderUpdate: 'slider-update',
  sliderDelete: 'slider-delete',
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
        path: 'ratings-category',
        component: () => import('@/views/hotels/RatingsCategory.vue'),
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
        path: 'ratings-category',
        component: () => import('@/views/activity/RatingsCategory.vue'),
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
    path: '/cruise',
    name: 'cruise',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager'],
      permissions: []
    },
    children: [
      {
        path: 'destination',
        name: 'cruise-destination',
        component: () => import('@/views/cruise/Destination.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.cruiseMasterData]
        }
      },
      {
        path: 'line',
        name: 'cruise-line',
        component: () => import('@/views/cruise/Line.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.cruiseMasterData]
        }
      },
      {
        path: 'port',
        name: 'cruise-port',
        component: () => import('@/views/cruise/Port.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.cruiseMasterData]
        }
      },
      {
        path: 'room-group',
        name: 'cruise-room-group',
        component: () => import('@/views/cruise/RoomGroup.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.cruiseMasterData]
        }
      },
      {
        path: 'ratings-category',
        component: () => import('@/views/cruise/RatingsCategory.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin'],
          permissions: []
        }
      },
      {
        path: 'ratings',
        component: () => import('@/views/cruise/Ratings.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin'],
          permissions: []
        }
      },
      {
        path: 'ship',
        name: 'cruise-ship',
        component: () => import('@/views/cruise/Ship.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: [
            permissions.cruiseShip,
            permissions.cruiseUpdateHalalRatings
          ]
        }
      },
      {
        path: 'package',
        name: 'cruise-package',
        component: () => import('@/views/cruise/Package.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.cruisePackage]
        }
      },
      {
        path: 'enquiry',
        name: 'cruise-enquiry',
        component: () => import('@/views/cruise/Enquiry.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.cruiseEnquiry]
        }
      }
    ]
  },
  {
    path: '/restaurant',
    name: 'restaurant',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager'],
      permissions: []
    },
    children: [
      {
        path: 'ratings-category',
        name: 'restaurant-ratings-category',
        component: () => import('@/views/restaurant/RatingsCategory.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin'],
          permissions: []
        }
      },
      {
        path: 'ratings',
        name: 'restaurant-ratings',
        component: () => import('@/views/restaurant/Ratings.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin'],
          permissions: []
        }
      },
      {
        path: 'cuisine',
        name: 'restaurant-cuisine',
        component: () => import('@/views/restaurant/Cuisine.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.restaurantMasterData]
        }
      },
      {
        path: 'special-diet',
        name: 'restaurant-special-diet',
        component: () => import('@/views/restaurant/SpecialDiet.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.restaurantMasterData]
        }
      },
      {
        path: 'restaurant',
        name: 'restaurant-restaurant',
        component: () => import('@/views/restaurant/Restaurant.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: [permissions.restaurantRestaurant]
        }
      }
    ]
  },
  {
    path: '/holiday',
    name: 'holiday',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee'],
      permissions: []
    },
    children: [
      {
        path: 'inclusion-icon',
        name: 'holiday-inclusion-icon',
        component: () => import('@/views/holiday/InclusionIcon.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.holidayMasterData]
        }
      },
      {
        path: 'package',
        name: 'holiday-package',
        component: () => import('@/views/holiday/Package.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.holidayPackage]
        }
      },
      {
        path: 'enquiry',
        name: 'holiday-enquiry',
        component: () => import('@/views/holiday/Enquiry.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.holidayEnquiry]
        }
      }
    ]
  },
  {
    path: '/insurance',
    name: 'insurance',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee'],
      permissions: []
    },
    children: [
      {
        path: 'type',
        name: 'insurance-type',
        component: () => import('@/views/insurance/Type.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.insuranceMasterData]
        }
      },
      // {
      //   path: 'name',
      //   name: 'insurance-name',
      //   component: () => import('@/views/insurance/Name.vue'),
      //   meta: {
      //     requiresAuth: true,
      //     role: ['super-admin', 'admin', 'employee'],
      //     permissions: [permissions.insuranceMasterData]
      //   }
      // },
      // {
      //   path: 'policy',
      //   name: 'insurance-policy',
      //   component: () => import('@/views/insurance/Policy.vue'),
      //   meta: {
      //     requiresAuth: true,
      //     role: ['super-admin', 'admin', 'employee'],
      //     permissions: [permissions.insuranceMasterData]
      //   }
      // },
      {
        path: 'area',
        name: 'insurance-area',
        component: () => import('@/views/insurance/Area.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.insuranceMasterData]
        }
      },
      {
        path: 'traveller',
        name: 'insurance-traveller',
        component: () => import('@/views/insurance/Traveller.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.insuranceMasterData]
        }
      },
      {
        path: 'insurance',
        name: 'insurance-insurance',
        component: () => import('@/views/insurance/Insurance.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.insuranceMasterData]
        }
      },
      {
        path: 'package',
        name: 'insurance-package',
        component: () => import('@/views/insurance/Package.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.insurancePackage]
        }
      },
      {
        path: 'order',
        name: 'insurance-order',
        component: () => import('@/views/insurance/Order.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.insuranceOrder]
        }
      }
    ]
  },
  {
    path: '/transfer',
    name: 'transfer',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee'],
      permissions: [permissions.transferOrder]
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/transfer/Order.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee'],
          permissions: [permissions.transferOrder]
        }
      }
    ]
  },
  {
    path: '/custom-holiday',
    name: 'custom-holiday',
    component: () => import('@/views/CustomHoliday.vue'),
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee'],
      permissions: [permissions.customHoliday]
    }
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
  },
  {
    path: '/blogs',
    name: 'blogs',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager'],
      permissions: []
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/blogs/View.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: []
        }
      },
      {
        path: 'create',
        component: () => import('@/views/blogs/create/View.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: []
        }
      },
      {
        path: ':slug/edit',
        component: () => import('@/views/blogs/edit/View.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: []
        }
      },
    ]
  },
  {
    path: '/promo',
    name: 'promo',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager'],
      permissions: []
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/promo/View.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: []
        }
      },
      {
        path: 'create',
        component: () => import('@/views/promo/create/View.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: []
        }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/promo/edit/View.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: []
        }
      },
    ]
  },
  {
    path: '/sliders',
    name: 'sliders',
    meta: {
      requiresAuth: true,
      role: ['super-admin', 'admin', 'employee', 'manager'],
      permissions: []
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/sliders/View.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: []
        }
      },
      {
        path: 'create',
        component: () => import('@/views/sliders/create/View.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: []
        }
      },
      {
        path: ':id/edit',
        component: () => import('@/views/sliders/edit/View.vue'),
        meta: {
          requiresAuth: true,
          role: ['super-admin', 'admin', 'employee', 'manager'],
          permissions: []
        }
      },
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
    permissions: [
      permissions.hotelAll,
      permissions.hotelList,
      permissions.hotelBookingAll
    ],
    children: [
      {
        icon: 'list-box',
        title: 'Ratings Category',
        to: '/hotels/ratings-category',
        value: 'hotels-ratings-category',
        role: ['super-admin'],
        permissions: [permissions.hotelHalalRatingCategory]
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
        icon: 'view-list',
        title: 'List',
        to: '/hotels/list',
        value: 'hotels-list',
        role: ['super-admin', 'admin', 'employee', 'manager'],
        permissions: [permissions.hotelAll, permissions.hotelList]
      },
      {
        icon: 'file-document-multiple',
        title: 'Orders',
        to: '/hotels/orders',
        value: 'hotels-orders',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.hotelBookingAll]
      }
    ]
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
        icon: 'list-box',
        title: 'Ratings Category',
        to: '/activity/ratings-category',
        value: 'activity-ratings-category',
        role: ['super-admin'],
        permissions: [permissions.activityHalalRatingCategory]
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
        icon: 'view-list',
        title: 'List',
        to: '/activity/list',
        value: 'activity-list',
        role: ['super-admin', 'admin', 'employee', 'manager'],
        permissions: [permissions.activityAll, permissions.activityList]
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
    title: 'Cruise',
    value: 'cruise',
    icon: 'sail-boat',
    role: ['super-admin', 'admin', 'employee', 'manager'],
    permissions: [
      permissions.cruiseEnquiry,
      permissions.cruiseMasterData,
      permissions.cruisePackage,
      permissions.cruiseShip
    ],
    children: [
      {
        icon: 'list-box',
        title: 'Ratings Category',
        to: '/cruise/ratings-category',
        value: 'cruise-ratings-category',
        role: ['super-admin'],
        permissions: [permissions.cruiseHalalRatingCategory]
      },
      {
        icon: 'star-box',
        title: 'Ratings',
        to: '/cruise/ratings',
        value: 'cruise-ratings',
        role: ['super-admin'],
        permissions: [permissions.hotelHalalRating]
      },
      {
        icon: 'map-marker-radius',
        title: 'Destination',
        to: '/cruise/destination',
        value: 'cruise-master-data-destination',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.cruiseMasterData]
      },
      {
        icon: 'ballot-outline',
        title: 'Line',
        to: '/cruise/line',
        value: 'cruise-master-data-line',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.cruiseMasterData]
      },
      {
        icon: 'passport-biometric',
        title: 'Port',
        to: '/cruise/port',
        value: 'cruise-master-data-port',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.cruiseMasterData]
      },
      {
        icon: 'home-switch',
        title: 'Room Group',
        to: '/cruise/room-group',
        value: 'cruise-master-data-room-group',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.cruiseMasterData]
      },
      {
        icon: 'ferry',
        title: 'Ship',
        to: '/cruise/ship',
        value: 'cruise-ship',
        role: ['super-admin', 'admin', 'employee', 'manager'],
        permissions: [permissions.cruiseShip]
      },
      {
        icon: 'package-variant',
        title: 'Package',
        to: '/cruise/package',
        value: 'cruise-package',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.cruisePackage]
      },
      {
        icon: 'chat-question',
        title: 'Enquiry',
        to: '/cruise/enquiry',
        value: 'cruise-enquiry',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.cruiseEnquiry]
      }
    ]
  },
  {
    title: 'Restaurant',
    value: 'restaurant',
    icon: 'silverware-fork-knife',
    role: ['super-admin', 'admin', 'employee', 'manager'],
    permissions: [
      permissions.restaurantMasterData,
      permissions.restaurantRestaurant
    ],
    children: [
      {
        icon: 'list-box',
        title: 'Ratings Category',
        to: '/restaurant/ratings-category',
        value: 'restaurant-ratings-category',
        role: ['super-admin'],
        permissions: [permissions.restaurantHalalRatingCategory]
      },
      {
        icon: 'star-box',
        title: 'Ratings',
        to: '/restaurant/ratings',
        value: 'restaurant-ratings',
        role: ['super-admin'],
        permissions: [permissions.restaurantHalalRating]
      },
      {
        icon: 'silverware',
        title: 'Cuisine',
        to: '/restaurant/cuisine',
        value: 'restaurant-master-data-cuisine',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.restaurantMasterData]
      },
      {
        icon: 'food-turkey',
        title: 'Special Diet',
        to: '/restaurant/special-diet',
        value: 'restaurant-master-data-special-diet',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.cruiseMasterData]
      },
      {
        icon: 'food-variant',
        title: 'Restaurant',
        to: '/restaurant/restaurant',
        value: 'restaurant-restaurant',
        role: ['super-admin', 'admin', 'employee', 'manager'],
        permissions: [permissions.restaurantRestaurant]
      }
    ]
  },
  {
    title: 'Holiday',
    value: 'holiday',
    icon: 'wan',
    role: ['super-admin', 'admin', 'employee'],
    permissions: [
      permissions.holidayEnquiry,
      permissions.holidayMasterData,
      permissions.holidayPackage
    ],
    children: [
      {
        icon: 'react',
        title: 'Inclusion Icons',
        to: '/holiday/inclusion-icon',
        value: 'holiday-inclusion-icon',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.holidayMasterData]
      },
      {
        icon: 'package-variant',
        title: 'Package',
        to: '/holiday/package',
        value: 'holiday-package',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.holidayPackage]
      },
      {
        icon: 'chat-question',
        title: 'Enquiry',
        to: '/holiday/enquiry',
        value: 'holiday-enquiry',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.holidayEnquiry]
      }
    ]
  },
  {
    title: 'Insurance',
    value: 'insurance',
    icon: 'security',
    role: ['super-admin', 'admin', 'employee'],
    permissions: [
      permissions.insurancePackage,
      permissions.insuranceMasterData,
      permissions.insuranceOrder
    ],
    children: [
      {
        icon: 'candy-outline',
        title: 'Type',
        to: '/insurance/type',
        value: 'insurance-type',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.insuranceMasterData]
      },
      // {
      //   icon: 'text-box-plus-outline',
      //   title: 'Name',
      //   to: '/insurance/name',
      //   value: 'insurance-name',
      //   role: ['super-admin', 'admin', 'employee'],
      //   permissions: [permissions.insuranceMasterData]
      // },
      // {
      //   icon: 'list-box-outline',
      //   title: 'Policy Type',
      //   to: '/insurance/policy',
      //   value: 'insurance-policy',
      //   role: ['super-admin', 'admin', 'employee'],
      //   permissions: [permissions.insuranceMasterData]
      // },
      {
        icon: 'map-marker-radius',
        title: 'Area',
        to: '/insurance/area',
        value: 'insurance-area',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.insuranceMasterData]
      },
      {
        icon: 'cards',
        title: 'Rest Type',
        to: '/insurance/insurance',
        value: 'insurance-insurance',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.insuranceMasterData]
      },
      {
        icon: 'card-account-details',
        title: 'Traveller Type',
        to: '/insurance/traveller',
        value: 'insurance-traveller',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.insuranceMasterData]
      },
      {
        icon: 'package-variant',
        title: 'Package',
        to: '/insurance/package',
        value: 'insurance-package',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.insurancePackage]
      },
      {
        icon: 'file-document-multiple',
        title: 'Orders',
        to: '/insurance/order',
        value: 'insurance-order',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.insuranceOrder]
      }
    ]
  },
  {
    title: 'Transfers',
    value: 'transfers',
    icon: 'car',
    role: ['super-admin', 'admin', 'employee'],
    permissions: [permissions.transferOrder],
    children: [
      {
        icon: 'file-document-multiple',
        title: 'Orders',
        to: '/transfer/order',
        value: 'transfer-order',
        role: ['super-admin', 'admin', 'employee'],
        permissions: [permissions.transferOrder]
      }
    ]
  },
  {
    title: 'Custom Holiday',
    value: 'custom-holiday',
    icon: 'oil-temperature',
    to: '/custom-holiday',
    role: ['super-admin', 'admin', 'employee'],
    children: [],
    permissions: [permissions.customHoliday,]
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
  },
  {
    title: 'Blogs',
    value: 'blogs',
    icon: 'post',
    role: ['super-admin', 'admin', 'employee', 'manager'],
    permissions: [
      permissions.blogAll,
      permissions.blogCreate,
      permissions.blogUpdate,
      permissions.blogDelete,
    ],
    children: [
      {
        icon: 'view-list',
        title: 'List',
        to: '/blogs/list',
        value: 'blogs-list',
        role: ['super-admin', 'admin', 'employee', 'manager'],
        permissions: [permissions.blogAll]
      },
      {
        icon: 'post',
        title: 'Create',
        to: '/blogs/create',
        value: 'blogs-create',
        role: ['super-admin'],
        permissions: [permissions.blogCreate]
      },
    ]
  },
  {
    title: 'Promo Codes',
    value: 'promo',
    icon: 'post',
    role: ['super-admin', 'admin', 'employee', 'manager'],
    permissions: [
      permissions.blogAll,
      permissions.blogCreate,
      permissions.blogUpdate,
      permissions.blogDelete,
    ],
    children: [
      {
        icon: 'view-list',
        title: 'List',
        to: '/promo/list',
        value: 'promo-list',
        role: ['super-admin', 'admin', 'employee', 'manager'],
        permissions: [permissions.blogAll]
      },
      {
        icon: 'post',
        title: 'Create',
        to: '/promo/create',
        value: 'promo-create',
        role: ['super-admin'],
        permissions: [permissions.blogCreate]
      },
    ]
  },
  {
    title: 'Carousel Sliders',
    value: 'sliders',
    icon: 'post',
    role: ['super-admin', 'admin', 'employee', 'manager'],
    permissions: [
      permissions.sliderAll,
      permissions.sliderCreate,
      permissions.sliderUpdate,
      permissions.sliderDelete,
    ],
    children: [
      {
        icon: 'view-list',
        title: 'List',
        to: '/sliders/list',
        value: 'sliders-list',
        role: ['super-admin', 'admin', 'employee', 'manager'],
        permissions: [permissions.sliderAll]
      },
      {
        icon: 'post',
        title: 'Create',
        to: '/sliders/create',
        value: 'sliders-create',
        role: ['super-admin'],
        permissions: [permissions.sliderCreate]
      },
    ]
  },
]

export const userCreatePermissions = [
  {
    title: 'User',
    value: permissions.userList,
    children: [
      // {
      //   title: 'All',
      //   value: permissions.userAll
      // },
      {
        title: 'List',
        value: permissions.userList
      },
      {
        title: 'Create',
        value: permissions.userCreate
      },
      { title: 'Update', value: permissions.userRolePermissionUpdate },
      { title: 'Delete', value: permissions.userDelete }
    ]
  },
  {
    title: 'Hotels',
    value: permissions.hotelList,
    children: [
      // {
      //   title: 'All',
      //   value: permissions.hotelAll
      // },
      {
        title: 'List',
        value: permissions.hotelList
      },
      {
        title: 'Assign & Remove Manager',
        value: permissions.hotelUpdateManager
      },
      { title: 'Add Rating', value: permissions.hotelUpdateHalalRatings },
      { title: 'Order', value: permissions.hotelBookingAll }
    ]
  },
  {
    title: 'Activities',
    value: permissions.activityList,
    children: [
      // {
      //   title: 'All',
      //   value: permissions.activityAll
      // },
      {
        title: 'Search & Add',
        value: permissions.activityAddToSystem
      },
      {
        title: 'List',
        value: permissions.activityList
      },
      {
        title: 'Assign & Remove Manager',
        value: permissions.activityUpdateManager
      },
      { title: 'Add Rating', value: permissions.activityUpdateHalalRatings },
      { title: 'Order', value: permissions.activityBookingAll }
    ]
  },
  {
    title: 'Cruise',
    value: permissions.cruiseAll,
    children: [
      // {
      //   title: 'All',
      //   value: permissions.activityAll
      // },
      {
        title: 'Master Data ( Destination, Line, Port, Room Group )',
        value: permissions.cruiseMasterData
      },
      {
        title: 'Assign & Remove Manager(On Ship)',
        value: permissions.cruiseUpdateManager
      },
      {
        title: 'Add Rating(On Ship)',
        value: permissions.cruiseUpdateHalalRatings
      },
      {
        title: 'Ship',
        value: permissions.cruiseShip
      },
      {
        title: 'Package',
        value: permissions.cruisePackage
      },
      {
        title: 'Enquiry',
        value: permissions.cruiseEnquiry
      }
    ]
  },
  {
    title: 'Restaurant',
    value: permissions.restaurantRestaurant,
    children: [
      {
        title: 'Master Data ( Cuisine, Special Diet )',
        value: permissions.restaurantMasterData
      },
      {
        title: 'Assign & Remove Manager',
        value: permissions.restaurantUpdateManager
      },
      {
        title: 'Add Rating',
        value: permissions.restaurantUpdateHalalRatings
      },
      {
        title: 'Restaurant',
        value: permissions.restaurantRestaurant
      }
    ]
  },
  {
    title: 'Holiday',
    value: permissions.holidayAll,
    children: [
      {
        title: 'Master Data ( Inclusion Icon )',
        value: permissions.holidayMasterData
      },
      {
        title: 'Package',
        value: permissions.holidayPackage
      },
      {
        title: 'Enquiry',
        value: permissions.holidayEnquiry
      },
      { title: 'Custom Holiday Order', value: permissions.customHoliday }

    ]
  },
  {
    title: 'Insurance',
    value: permissions.insuranceAll,
    children: [
      {
        title: 'Master Data ( Area, Name ,... )',
        value: permissions.insuranceMasterData
      },
      {
        title: 'Package',
        value: permissions.insurancePackage
      },
      {
        title: 'Orders',
        value: permissions.insuranceOrder
      }
    ]
  },
  {
    title: 'Transfers',
    value: permissions.transferOrder,
    children: [
      {
        title: 'Orders',
        value: permissions.transferOrder
      }
    ]
  },
  {
    title: 'Blogs',
    value: permissions.blogAll,
    children: [
      {
        title: 'List',
        value: permissions.blogAll
      },
      {
        title: 'Create',
        value: permissions.blogCreate
      },
    ]
  }
]

export const managerCreatePermissions = [
  { title: 'Hotel', value: permissions.hotelList },
  { title: 'Hotel Halal Rating Update', value: permissions.hotelUpdateHalalRatings },

  { title: 'Activity', value: permissions.activityList },
  { title: 'Activity Halal Rating Update', value: permissions.activityUpdateHalalRatings },

  { title: 'Cruise', value: permissions.cruiseShip },
  { title: 'Cruise Halal Rating Update', value: permissions.cruiseUpdateHalalRatings },

  { title: 'Restaurant', value: permissions.restaurantRestaurant },
  { title: 'Restaurant Halal Rating Update', value: permissions.restaurantUpdateHalalRatings }
]
