<script setup lang="ts">
const route = useRoute()
const { signIn } = useAuth()

const emit = defineEmits<{
  (e: 'update:username', value: string): void
  (e: 'update:password', value: string): void
  (e: 'update:loading', value: boolean): void
}>()

defineExpose({ login })

const props = defineProps<{
  username: string
  password: string
  loading: boolean
}>()

const callbackUrl = computed(() => {
  const callbackUrlParam = route.query.callbackUrl
  return typeof callbackUrlParam === "string" && callbackUrlParam.length > 0 ? callbackUrlParam : "/"
})

const errorMessage = ref('')

async function login() {
  errorMessage.value = ''
  emit('update:loading', true)

  const signInResult = await signIn('credentials', { username: props.username, password: props.password, callbackUrl: callbackUrl.value, redirect: false })
  if (!signInResult) throw new Error('Uhoh, something went wrong')
  const { error, url } = signInResult

  if (error) errorMessage.value = 'Неправильный логин или пароль'
  else navigateTo(url, { external: true })

  emit('update:loading', false)
}
</script>

<template>
  <form>
    <v-text-field :model-value="username" @update:model-value="e => $emit('update:username', e)" label="Логин" placeholder="вася нагибатор 666" :disabled="loading" required hide-details />
    <v-text-field :model-value="password" @update:model-value="e => $emit('update:password', e)" type="password" label="Пароль" :error-messages="errorMessage" :disabled="loading" required />

    <v-btn class="bg-primary" :loading="loading" @click="login">Войти</v-btn>
  </form>
</template>
