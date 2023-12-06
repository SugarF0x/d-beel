<script setup lang="ts">
import { clone } from "lodash-es"

const emit = defineEmits<{
  (e: 'update:username', value: string): void
  (e: 'update:password', value: string): void
  (e: 'update:inviteCode', value: string): void
  (e: 'update:loading', value: boolean): void
  (e: 'success'): void
}>()

const props = defineProps<{
  username: string
  password: string
  inviteCode: string
  loading: boolean
}>()

const initialErrors: Pick<typeof props, 'inviteCode' | 'username' | 'password'> = { username: '', password: '', inviteCode: '' }
const errors = reactive(clone(initialErrors))
const setErrors = (value: Partial<typeof initialErrors>) => Object.assign(errors, value)
const resetErrors = () => setErrors(initialErrors)

async function register() {
  resetErrors()
  emit('update:loading', true)

  const response = await $fetch('/api/auth/register', {
    method: 'post',
    body: {
      username: props.username,
      password: props.password,
      inviteCode: props.inviteCode,
    }
  }).catch(error => {
    const statusCode = error.statusCode as number

    (() => {
      switch (statusCode) {
        case 400: return setErrors({ username: 'Неправильный формат данных' })
        case 403: return setErrors({ inviteCode: 'Неверный код приглашения' })
        case 409: return setErrors({ username: 'Данный пользователь уже существует' })
        default: return setErrors({ inviteCode: 'Неизвестная ошибка' })
      }
    })()
  })

  if (response) emit('success')
  else emit('update:loading', false)
}

// TODO: perhaps this combo form could be refactored into a generic component with some useAppForm composable

const forms = [
  { name: 'username', props: { label: "Логин", placeholder: "вася нагибатор 666" } },
  { name: 'password', props: { label: "Пароль", type: "password" } },
  { name: 'inviteCode', props: { label: "Код приглашения" } },
] as const
</script>

<template>
  <form>
    <v-text-field
      v-for="form of forms"
      :key="form.name"
      :model-value="props[form.name]"
      @update:model-value="e => $emit(`update:${form.name}`, e)"
      :error-messages="errors[form.name]"
      :disabled="loading"
      required
      @keydown.enter="register"
      v-bind="form.props"
    />

    <v-btn class="bg-secondary" :loading="loading" @click="register">Зарегистрироваться</v-btn>
  </form>
</template>
