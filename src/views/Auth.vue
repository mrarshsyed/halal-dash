<template>
  <v-form @submit.prevent="authHandle">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
          offset-md="3"
        >
          <!-- <v-card> -->
          <div class="d-flex w-100 justify-center align-center">
            <v-img
              src="@/assets/logo.svg"
              height="80px"
              width="220px"
            />
          </div>

          <v-card-text>
            <v-form
              ref="form"
              v-if="getMode === 'Login'"
            >
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
              <p class="text-center my-4">
                Save Your User Name And Password
              </p>
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
            <v-form
              ref="form"
              v-if="getMode === 'generate_password_reset_link'"
            >
              <p class="text-center my-4">
                Reset Your Password
              </p>
              <v-text-field
                v-model="email"
                label="Email"
                :rules="emailRules"
                required
                prepend-inner-icon="mdi-gmail"
              />
            </v-form>
            <v-form
              ref="form"
              v-if="getMode === 'password_reset'"
            >
              <p class="text-center my-4">
                Set Your New Password
              </p>
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
              <v-col
                cols="12"
                v-if="showActionButton"
              >
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
              <v-col
                cols="12"
                v-if="getMode === 'Login'"
              >
                <p>
                  Forgot password?
                  <router-link
                    :to="`/authentication?mode=generate_password_reset_link`"
                  >
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

const email = ref('')
const password = ref('')
const name = ref('')
const confirmPassword = ref('')

const form = ref()
const showPassword = ref(false)
const showActionButton = ref(true)
const showPasswordSaveForm = ref(false)
const showPasswordResetForm = ref(false)
const temp_user_id = ref(null)

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
      if (res) {
        await store.setUser(res.data)
        router.push('/dashboard')
      }
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
        router.push('/authentication?mode=Login')
      }
    })
}

const handlePasswordReset = async () => {
  const payload = {
    password: password.value,
    confirmPassword: confirmPassword.value,
    otp: query?.otp,
    str: query?.str
  }
  await axios
    .patch(`admin/users/${temp_user_id.value}/reset-password`, payload)
    .then((res) => {
      if (res?.data?._id) {
        store.showSnackbar('Successfully Saved')
        router.push('/authentication?mode=Login')
      }
    })
}

const handlePasswordResetLinkGenerate = async () => {
  await axios
    .get(`admin/users/generate-reset-password-link`, {
      params: {
        email: email.value
      }
    })
    .then((res) => {
      console.log(res)
      email.value = null
      store.showSnackbar(res?.data?.message)
    })
}

const authHandle = async () => {
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
  } else if (getMode.value === 'generate_password_reset_link') {
    await handlePasswordResetLinkGenerate()
  } else if (getMode.value === 'password_reset') {
    await handlePasswordReset()
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
            if (!res?.data?.user) {
              router.push('/authentication?mode=Login')
            }
            if (res?.status === 200 && res?.data?.user?._id) {
              store.showSnackbar('Link Verified')
              showPasswordSaveForm.value = true
            }
          })
          .catch(() => {
            showActionButton.value = false
          })
      }
    } else if (query.mode === 'password_reset') {
      axios
        .get('admin/users/verify-reset-password-link', {
          params: {
            str: query.str,
            otp: query.otp,
            user: query.user
          }
        })
        .then((res) => {
          if (res?.data?.user?._id) {
            temp_user_id.value = res?.data?.user?._id
            showPasswordResetForm.value = true
          } else {
            router.push('/authentication?mode=Login')
          }
        })
        .catch(() => {
          showActionButton.value = false
        })
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
