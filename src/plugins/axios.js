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
    console.log(response, response.headers['X-NEW-ACCESS-TOKEN'])
    const store = useAppStore()
    store.stopLoading()
    return response
  },
  (error) => {
    const store = useAppStore()
    store.stopLoading()
    if (error.response) {
      if (error?.response?.data?.message) {
        store.showSnackbar(error?.response?.data?.message, 'error')
      } else if (error?.response?.data) {
        store.showSnackbar(error.response.data, 'error')
      }

      if (error?.response.data?.code === 13331) {
        store.logout()
      }
    }
    return Promise.reject(error)
  }
)

export default axios
