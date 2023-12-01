<script setup lang="ts">
const { data, signIn } = useAuth()
const route = useRoute()

if (data.value) await navigateTo('/')

const callbackUrl = computed(() => {
  const callbackUrlParam = route.query.callbackUrl
  return typeof callbackUrlParam === "string" && callbackUrlParam.length > 0 ? callbackUrlParam : "/"
})

const tab = ref(0)
const TABS = ['Вход', 'Регистрация']

const username = ref('')
const password = ref('')
const inviteCode = ref('')

const errorMessage = ref('')

async function authCallWrapper(callback: () => Promise<void>) {
  errorMessage.value = ''
  isLoading.value = true
  await callback()
  isLoading.value = false
}

const isLoading = ref(false)
async function login() {
  await authCallWrapper(async () => {
    const signInResult = await signIn('credentials', { username: username.value, password: password.value, callbackUrl: callbackUrl.value, redirect: false })
    if (!signInResult) throw new Error('Uhoh, something went wrong')
    const { error, url } = signInResult

    if (error) errorMessage.value = 'Неправильный логин или пароль'
    else navigateTo(url, { external: true })
  })
}

async function register() {
  await authCallWrapper(async () => {
    const response = await $fetch('/api/auth/register', {
      method: 'post',
      body: {
        username: username.value,
        password: password.value,
        inviteCode: inviteCode.value,
      }
    }).catch(error => {
      const statusCode = error.statusCode as number

      errorMessage.value = (() => {
        switch (statusCode) {
          case 400: return 'Неправильный формат данных'
          case 403: return 'Неверный код приглашения'
          case 409: return 'Данный пользователь уже существует'
          default: return 'Неизвестная ошибка'
        }
      })()
    })

    if (response) await login()
  })
}
</script>

<template>
  <div class="wrapper">
    <v-sheet class="card">
      <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center" grow>
        <v-tab v-for="tab in TABS" :value="tab">{{ tab }}</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="TABS[0]">
          <form>
            <v-text-field v-model="username" label="Логин" placeholder="вася нагибатор 666" :error-messages="errorMessage" required />
            <v-text-field v-model="password" type="password" label="Пароль" required />

            <v-btn class="bg-primary" :loading="isLoading" @click="login">Войти</v-btn>
          </form>
        </v-window-item>
        <v-window-item :value="TABS[1]">
          <form>
            <v-text-field v-model="username" label="Логин" placeholder="вася нагибатор 666" :error-messages="errorMessage" required />
            <v-text-field v-model="password" type="password" label="Пароль" required />
            <v-text-field v-model="inviteCode" label="Код приглашения" required />

            <v-btn class="bg-secondary" :loading="isLoading" @click="register">Зарегистрироваться</v-btn>
          </form>
        </v-window-item>
      </v-window>
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
    padding: 16px;
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
  border-radius: 16px;
  overflow: hidden;
}
</style>
