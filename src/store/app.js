// Utilities
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { navLinks, permissions } from '@/config/userRoutes'

export const useAppStore = defineStore('app', {
  setup() {
    const router = useRouter()
    return {
      router
    }
  },
  state: () => ({
    loading: false,
    snackbar: {
      show: false,
      variant: 'success',
      message: 'Hello,welcome to Dev Script'
    },
    dialog: {
      show: false,
      title: '',
      content: '',
      confirmText: '',
      cancelText: 'Close',
      confirmFunction: () => {},
      formComponents: []
    },
    user: JSON.parse(localStorage.getItem('user')) || null,
    tokens: JSON.parse(localStorage.getItem('tokens')) || null,
    userList: [],
    hotel_details: {},
    rating_details: {},
    formComponents: {
      // type:['email','text','number']
      fields: [
        { type: '', label: '', is_required: true, value: null },
        {
          type: '',
          label: '',
          is_required: true,
          value: null,
          options: [],
          itemTitle: 'name',
          itemValue: 'id',
          multiple: false
        }
      ]
    },
    managers: [],
    countries: [],
    details: {},
    cruiseMasterData : {},
    sideBarLinks: JSON.parse(localStorage.getItem('navLinks')) || []
  }),
  getters: {
    isLoading: (state) => state.loading,
    getSnackbar: (state) => state.snackbar,
    getUser: (state) => {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      return state.user || (storedUser ? storedUser : null)
    },
    getTokens: (state) => {
      const storedTokens = JSON.parse(localStorage.getItem('tokens'))
      return state.tokens || (storedTokens ? storedTokens : null)
    }
  },
  actions: {
    startLoading() {
      this.loading = true
    },
    stopLoading() {
      this.loading = false
    },
    showSnackbar(message, variant) {
      this.snackbar.show = true
      this.snackbar.message = message
      this.snackbar.variant = variant ?? 'success'
    },
    showDialog({
      title,
      content,
      confirmText,
      cancelText,
      confirmFunction,
      formComponents
    }) {
      this.dialog.show = true
      this.dialog.title = title ?? 'Welcome to Dev Script'
      this.dialog.content =
        content ?? 'Here You will find the best teacher for you coding'
      this.dialog.confirmText = confirmText ?? 'Save'
      this.dialog.cancelText = cancelText ?? 'Close'
      this.dialog.confirmFunction = confirmFunction
      this.dialog.formComponents = formComponents?.fields?.length
        ? formComponents
        : {}
    },
    closeDialog() {
      const dialog = {
        show: false,
        title: '',
        content: '',
        confirmText: '',
        cancelText: 'Close',
        confirmFunction: () => {},
        formComponents: []
      }
      this.dialog.show = false
    },
    getNavbarList(user) {
      if (!user) return []
    
      const userRole = user?.data?.role
      const userPermissions = user?.data?.permissions 
      // Define a recursive function to filter the links and their children
      function filterLinks(links) {
        return links.map((link) => {
          // Create a shallow copy of the link
          const newLink = { ...link }
    
          // If the user is super-admin, return the link with all children
          if (userRole === 'super-admin') {
            if (newLink.children && newLink.children.length > 0) {
              newLink.children = filterLinks(newLink.children) // Recursive call to include all children
            }
            return newLink
          }
    
          // If the link doesn't have permissions, allow it
          if (newLink.permissions.length === 0) {
            if (newLink.children && newLink.children.length > 0) {
              newLink.children = filterLinks(newLink.children) // Recursive call to filter children
            }
            return newLink
          }
    
          // Check if any of the user's permissions match the link's permissions
          if (newLink.permissions.some((permission) =>
            userPermissions.includes(permission)
          )) {
            if (newLink.children && newLink.children.length > 0) {
              newLink.children = filterLinks(newLink.children) // Recursive call to filter children
            }
            return newLink
          }
    
          return null
        }).filter(link => link !== null) // Filter out null links
      }
    
      // Filter the top-level navigation links
      const filteredNavLinks = filterLinks(navLinks)
    
      return filteredNavLinks
    },
    
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(this.user))
      const links = this.getNavbarList(user)
      this.sideBarLinks = [...links]
      localStorage.setItem('navLinks', JSON.stringify(this.sideBarLinks))
    },
    setAuthToken(token){
      localStorage.setItem('authToken', token)
    },
    getAuthToken(){
      localStorage.getItem('authToken')
    },
    setTokens(tokens) {
      this.tokens = tokens
      localStorage.setItem('tokens', JSON.stringify(tokens))
    },
    async logout(callApi) {
      try {
        if (callApi) {
          await axios.get('admin/auth/logout')
        }
        localStorage.clear()
        this.user = null
        this.tokens = null
        this.sideBarLinks = []
        this.router.replace('/authentication?mode=Login')
      } catch (error) {
        localStorage.clear()
        this.user = null
        this.tokens = null
        this.sideBarLinks = []
        this.router.replace('/authentication?mode=Login')
      }
    },
    setUserList(list) {
      this.userList = list
    },
    setRatingDetails(details) {
      this.rating_details = details
    },
    setHotelDetails(detail) {
      this.hotel_details = detail
    },
    setDetails(detail) {
      this.details = detail
    },
    setManager(list) {
      this.managers = list
    },
    async createUser(email, role) {
      const payload = {
        email: email,
        role: role
      }
      return await axios.post('admin/users', payload)
    },
    setCountries(list) {
      this.countries = list
    },
    getUserName(email) {
      return email ? email.split('@')[0] : ''
      // return email.split('@')[0]
    },
    async getUserInfo() {
      return await axios.get('admin/auth/user')
    },
    getFieldValue(key) {
      const field = this.dialog.formComponents.fields?.find(
        (field) => field?.key === key
      )
      return field ? field.value : null
    },
    async updateUserRoleAndPermissions(id, roleData, permissionsData) {
      let payload = {
        role: roleData,
        permissions: permissionsData
      }
      if (payload.role === 'manager') {
        payload.permissions = [
          // hotel
          permissions.hotelList,
          permissions.hotelUpdateHalalRatings,

          // activity
          permissions.activityList,
          permissions.activityUpdateHalalRatings,

          // ship
          permissions.cruiseShip,
          permissions.cruiseUpdateHalalRatings,

          // restaurant
          permissions.restaurantRestaurant,
          permissions.restaurantUpdateHalalRatings,
        ]
      }

      return await axios.patch(
        `admin/users/${id}/update-role-permissions`,
        payload
      )
    },
    hasPermission(permissionName) {
      if (this.user?.data?.role === 'super-admin') {
        return true
      } else if (this?.user?.data?.permissions?.includes(permissionName)) {
        return true
      } else {
        return false
      }
    },
    setCruiseMasterData(data) {
      this.cruiseMasterData = data
    },
    updateField(key, value) {
      const fieldIndex = this.dialog.formComponents.fields?.findIndex(
        (field) => field?.key === key
      )
      if (fieldIndex !== -1) {
        this.dialog.formComponents.fields[fieldIndex].value = value
      }
    },
    isRoleManager(){
      if (this.user?.data?.role === 'manager') {
        return true
      }
      else return false
    }
  }
})
