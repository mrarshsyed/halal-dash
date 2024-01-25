<template>
  <v-form @submit.prevent="authHandle">
    <v-container>
      <v-row>
        <v-col cols="12" md="6" offset-md="3">
          <v-card>
            <v-card-title class="text-center">
              Welcome to Halal Explore
            </v-card-title>
            <v-card-text>
              <v-form ref="form">
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
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col cols="12">
                  <v-btn
                    block
                    @click="authHandle"
                    color="primary"
                    variant="elevated"
                    prepend-icon="mdi-account"
                  >
                    Login
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <p>
                    Forgot password?
                    <router-link :to="`/authentication?mode=password-reset`">
                      Reset here
                    </router-link>
                  </p>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
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
const form = ref()

const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v) => v.length >= 8 || 'Password must be at least 8 characters'
  // (v) => /[a-zA-Z]/.test(v) || 'Password must contain at least one letter',
  // (v) => /\d/.test(v) || 'Password must contain at least one number'
]

const getMode = computed(() => (mode.value === 'Login' ? 'Login' : signupQuery))

const handleLogin = async () => {
  await axios
    .post('/auth/login', {
      email: email.value,
      password: password.value
    })
    .then(async (res) => {
      await store.setUser(res.data)
      router.push('/dashboard')
    })
}

const authHandle = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  getMode.value === 'Login' && (await handleLogin())
}

watch(
  () => query.mode,
  (newMode) => {
    mode.value = newMode || 'Login'
  },
  { immediate: true }
)
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
