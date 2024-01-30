<template>
  <v-form @submit.prevent="authHandle">
    <v-container>
      <v-row>
        <v-col cols="12" md="6" offset-md="3">
          <!-- <v-card> -->
          <v-card-title class="text-center">
            Welcome to Halal Explore
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-if="getMode === 'Login'">
              <v-text-field
                v-model="email"
                label="Email"
                :rules="emailRules"
                required
                prepend-inner-icon="mdi-gmail"
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="passwordRules"
                prepend-inner-icon="mdi-lock"
                required
              />
            </v-form>
            <v-form
              ref="form"
              v-else-if="getMode === 'password_save' && showPasswordSaveForm"
            >
              <p class="text-center my-4">Save Your User Name And Password</p>
              <v-text-field
                v-model="name"
                label="Your Name"
                :rules="[(v) => !!v || 'Name is required']"
                required
                prepend-inner-icon="mdi-account"
              />
              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                prepend-inner-icon="mdi-lock"
                append-inner-icon="mdi-eye"
                @click:append-inner="showPassword = !showPassword"
                required
              />

              <v-text-field
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                label="Confirm Password"
                type="password"
                prepend-inner-icon="mdi-lock"
                :rules="[
                  ...passwordRules,
                  (v) => v === password || 'Passwords do not match'
                ]"
                append-inner-icon="mdi-eye"
                @click:append-inner="showPassword = !showPassword"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col cols="12" v-if="showActionButton">
                <v-btn
                  block
                  @click="authHandle"
                  color="primary"
                  variant="elevated"
                  prepend-icon="mdi-account"
                >
                  {{ getMode?.replaceAll('_', ' ') }}
                </v-btn>
              </v-col>
              <v-col cols="12" v-if="getMode === 'Login'">
                <p>
                  Forgot password?
                  <router-link :to="`/authentication?mode=password_reset`">
                    Reset here
                  </router-link>
                </p>
              </v-col>
            </v-row>
          </v-card-actions>
          <!-- </v-card> -->
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { useAppStore } from '@/store/app'
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'

const { query } = useRoute()
const router = useRouter()
const store = useAppStore()
const signupQuery = 'Sign Up'
const mode = ref(signupQuery)

const email = ref('admin@gmail.com')
const password = ref('password')
const name = ref('')
const confirmPassword = ref('')

const form = ref()
const showPassword = ref(false)
const showActionButton = ref(true)
const showPasswordSaveForm = ref(false)

const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v) => v.length >= 8 || 'Password must be at least 8 characters'
  // (v) => /[a-zA-Z]/.test(v) || 'Password must contain at least one letter',
  // (v) => /\d/.test(v) || 'Password must contain at least one number'
]

const getMode = computed(() => {
  return mode.value
})

const handleLogin = async () => {
  await axios
    .post('/admin/auth/login', {
      email: email.value,
      password: password.value
    })
    .then(async (res) => {
      await store.setUser(res.data)
      router.push('/dashboard')
    })
}

const handlePasswordSave = async () => {
  const payload = {
    name: name.value,
    password: password.value,
    confirmPassword: confirmPassword.value
  }
  await axios
    .patch(`admin/users/${query?.user}/set-password`, payload)
    .then((res) => {
      if (res?.status === 200 && res?.data?.isVerified) {
        store.showSnackbar('Password Saved')
      }
    })
}

const authHandle = async (mode) => {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  if (getMode.value === 'Login') {
    await handleLogin()
    return
  } else if (getMode.value === 'password_save') {
    await handlePasswordSave()
    return
  }
}

watch(
  () => query.mode,
  (newMode) => {
    mode.value = newMode || 'Login'
    if (query.mode === 'password_save') {
      if (query?.otp && query.str && query?.user) {
        axios
          .get(
            `admin/users/verify-password-link?str=${query.str}&otp=${query?.otp}&user=${query?.user}`
          )
          .then((res) => {
            if (res?.status === 200 && res?.data?.user?._id) {
              store.showSnackbar('Link Verified')
              showPasswordSaveForm.value = true
            } else {
              showActionButton.value = false
            }
          })
      }
    }
  },
  { immediate: true }
)
// verify password link
// watch(
//   () => query.emailVerifyToken,
//   (token) => {
//     if (token) {
//       verifyToken(token)
//     }
//   },
//   { immediate: true }
// )
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
