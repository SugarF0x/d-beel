<script setup lang="ts">
import { format } from "date-fns"
import { computed } from '#imports'

const route = useRoute()
const username = computed(() => String(route.params.username))

const { pending, error, data } = useFetch(`/api/user/info`, { params: { username } })
const info = computed<{ totalPosts: number, joinedAt: string }>(() => {
  if (!data.value || (data.value && 'statusCode' in data.value)) return { totalPosts: 0, joinedAt: '' }
  return data.value
})

const title = computed(() => (error.value?.statusCode ? String(error.value.statusCode) + ': ' : '') + username.value)
useHead({ title })
</script>

<template>
  <v-container class="wrapper">
    <v-skeleton-loader
      :loading="pending"
      type="list-item-two-line"
      class="skeleton"
    >
      <div v-if="error && error.statusCode === 404" class="not-found">
        <h1>Пользователь не найден</h1>
      </div>
      <v-list-item v-else :title="username">
        <div>Количество постов: {{ info.totalPosts }}</div>
        <div>Присоединился: {{ format(new Date(info.joinedAt), 'dd.MM.yyyy') }}</div>
      </v-list-item>
    </v-skeleton-loader>
  </v-container>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.skeleton {
  min-width: 200px;
}

.not-found {
  padding: 8px;
  margin: 0 auto;
}
</style>
