<script setup lang="ts">
definePageMeta({ layout: 'wow' })

const names = [
  'Эльсвейрит',
  'Зефирковость',
  'Лапковость',
  'Вейларис',
  'Пакипо'
]

const name = ref<null | string>(null)
const realm = ref<null | string>(null)

const { data, execute, status } = useAsyncData('character', () => $fetch('/api/wow/characters', { query: { characterName: name.value, realmSlug: realm.value }, retry: false }), { immediate: false })
const disabled = computed(() => status.value === 'pending' || !name.value || !realm.value)
</script>

<template>
  <v-container style="max-width: 1080px;">
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <v-btn v-for="username in names" :key="username" @click="name = username; realm = 'gordunni'" color="primary">
        {{ username }}
      </v-btn>
    </div>

    <div class="mt-4">
      <v-text-field v-model="name" label="Имя" />
      <wow-realm-selector v-model="realm" />
    </div>

    <v-btn @click="execute" :disabled="disabled" color="secondary">Найти</v-btn>

    <div class="mt-4">
      <wow-profile v-if="data" :media="data.media" :profile="data.profile" />
    </div>
  </v-container>
</template>
