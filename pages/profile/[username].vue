<script setup lang="ts">
import { Ref } from '#imports'
import { format } from "date-fns"
import { FetchError } from "ofetch"
import { UseClipboard } from "@vueuse/components"

const { data: authData } = useAuth()
const route = useRoute()

const username = computed(() => String(route.params.username))
const isOwnPage = computed(() => authData.value?.user.username === username.value)

const infoQuery = useAsyncData(`user-${username}-info`, async () => {
  const [info, keys] = await Promise.all([
    $fetch('/api/user/info', { params: { username: username.value } }),
    isOwnPage.value ? $fetch('/api/user/invite-code') : undefined,
  ])

  if (keys) inviteKeys.value = keys

  return {
    totalPosts: info.totalPosts,
    joinedAt: new Date(info.joinedAt)
  }
})

const { data, pending } = infoQuery
const error = infoQuery.error as Ref<null | FetchError>

const inviteKeys = ref<{ key: string, claimed_by?: string }[]>([])

const title = computed(() => (error.value?.statusCode ? String(error.value.statusCode) + ': ' : '') + username.value)
useHead({ title })

function getInviteLink(key: string): string {
  return `${location.origin}/login?inviteCode=${key}`
}

const loadingNewKey = ref(false)
const newKeyError = ref('')
async function requestNewKey() {
  newKeyError.value = ''
  loadingNewKey.value = true

  try {
    const key = await $fetch('/api/user/invite-code', { method: 'POST' })
    inviteKeys.value.unshift({ key })
  } catch(e) {
    newKeyError.value = (e as FetchError).data?.message ?? ''
  } finally {
    loadingNewKey.value = false
  }
}
</script>

<template>
  <v-container class="wrapper">
    <v-skeleton-loader
      v-if="pending"
      type="list-item-two-line"
      class="skeleton"
    />
    <template v-else>
      <div v-if="error && error.statusCode === 404" class="not-found">
        <h1>Пользователь не найден</h1>
      </div>
      <div v-else style="display: flex; flex-direction: column; gap: 12px;">
        <v-card>
          <v-card-title>{{ username }}</v-card-title>
          <v-card-text>
            <div>Количество постов: {{ data?.totalPosts }}</div>
            <div>Присоединился: {{ format(data?.joinedAt ?? 0, 'dd.MM.yyyy') }}</div>
          </v-card-text>
        </v-card>
        <v-card v-if="isOwnPage">
          <v-card-title class="keys-title">
            <div>Ключи</div>
            <v-btn icon="mdi-plus" color="info" density="comfortable" @click="requestNewKey" :loading="loadingNewKey" />
          </v-card-title>
          <v-card-text>
            <div v-if="newKeyError" class="key-fetch-error">{{ newKeyError }}</div>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">Ключ</th>
                  <th class="text-left">Получатель</th>
                  <th class="text-left">Поделиться</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in inviteKeys" :key="item.key" >
                  <td>{{ item.key }}</td>
                  <td class="text-right">{{ item.claimed_by ?? '-' }}</td>
                  <td class="share-cell">
                    <use-clipboard v-slot="{ copy, copied }" :source="item.key">
                      <v-btn icon="mdi-content-copy" density="comfortable" :color="copied ? 'success' : 'primary'" @click="copy()" :disabled="!!item.claimed_by" />
                    </use-clipboard>
                    <use-clipboard v-slot="{ copy, copied }" :source="getInviteLink(item.key)">
                      <v-btn icon="mdi-link" density="comfortable" :color="copied ? 'success' : 'secondary'" @click="copy()" :disabled="!!item.claimed_by" />
                    </use-clipboard>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </div>
    </template>
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

.share-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}

.keys-title {
  display: flex;
  justify-content: space-between;
}

.key-fetch-error {
  color: red;
}
</style>
