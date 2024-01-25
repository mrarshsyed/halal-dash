// axios.js

import axios from 'axios'
import { useAppStore } from '@/store/app'

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL

axios.interceptors.request.use(
  (config) => {
    const store = useAppStore()
    store.startLoading()
    const token = store.getUser?.access_token
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
    return response
  },
  (error) => {
    const store = useAppStore()
    store.stopLoading()
    if (error.response) {
      store.showSnackbar(error.response.data.message, 'error')
    } else if (error.request) {
      console.error('Request error:', error.request)
    } else {
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default axios
