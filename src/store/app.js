// Utilities
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

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
    userList: []
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
    },
    getUserName: (state) => {
      return state.user?.data?.email ? state.user.data.email.split('@')[0] : ''
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
      this.dialog.formComponents = formComponents
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
      this.dialog = dialog
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setTokens(tokens) {
      this.tokens = tokens
      localStorage.setItem('tokens', JSON.stringify(tokens))
    },
    logout() {
      localStorage.clear()
      this.user = null
      this.tokens = null
      this.router.push('/')
    },
    setUserList(list) {
      this.userList = list
    }
  }
})
