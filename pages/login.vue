<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})

const { signIn } = useAuth()
const route = useRoute()

const callbackUrl = computed(() => {
  const callbackUrlParam = route.query.callbackUrl
  return typeof callbackUrlParam === "string" && callbackUrlParam.length > 0 ? callbackUrlParam : "/"
})

const username = ref('')
const password = ref('')
const errors = reactive({
  username: '',
  password: '',
})

const isLoading = ref(false)
async function login() {
  isLoading.value = true

  const signInResult = await signIn('credentials', { username: username.value, password: password.value, callbackUrl: callbackUrl.value, redirect: false })
  if (!signInResult) throw new Error('Uhoh, something went wrong')
  const { error, url } = signInResult

  if (error) alert('You have made a terrible mistake while entering your credentials')
  else return navigateTo(url, { external: true })

  isLoading.value = false
}

async function register() {
  isLoading.value = true

  const response = await $fetch('/api/auth/register', {
    method: 'post',
    body: {
      username: username.value,
      password: password.value
    }
  }).catch(error => {
    console.log('Code: ', error.statusCode)
  })

  if (response) await login()

  isLoading.value = false
}
</script>

<template>
  <div class="wrapper">
    <v-sheet width="300" class="card">
      <div class="header">
        <h1 class="title text-h2">Вход</h1>
      </div>

      <form>
        <v-text-field
          v-model="username"
          label="Логин"
          placeholder="вася нагибатор 666"
          :error-messages="errors.username"
          required
        />

        <v-text-field
          v-model="password"
          type="password"
          label="Пароль"
          :error-messages="errors.password"
          required
        />

        <v-btn class="bg-primary" :loading="isLoading" @click="login">
          Войти
        </v-btn>

        <v-btn class="bg-secondary" :loading="isLoading" @click="register">
          Зарегистрироваться
        </v-btn>
      </form>
    </v-sheet>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.header {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.title {
  margin-bottom: 12px;
  text-align: center;
}

.card {
  padding: 16px;
  border-radius: 16px;
}
</style>
