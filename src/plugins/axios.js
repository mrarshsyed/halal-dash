// axios.js

import axios from 'axios'
import { useAppStore } from '@/store/app'

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL
axios.defaults.withCredentials = true

axios.interceptors.request.use(
  (config) => {
    const store = useAppStore()
    store.startLoading()
    const token = store.getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    const store = useAppStore()
    store.stopLoading()
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    const store = useAppStore()
    store.stopLoading()
    if (response?.headers['x-new-access-token']) {
      store.setAuthToken(response?.headers['x-new-access-token'])
    }
    return response
  },
  (error) => {
    const store = useAppStore()
    store.stopLoading()
    if (error.response?.data?.code === 13331) {
      return store.logout()
    }
    if (error.response) {
      if (error?.response?.data?.message) {
        store.showSnackbar(error?.response?.data?.message, 'error')
      } else if (error?.response?.data) {
        store.showSnackbar(error.response.data, 'error')
      }
    }
    return Promise.reject(error)
  }
)

export default axios
