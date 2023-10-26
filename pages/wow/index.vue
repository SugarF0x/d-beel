<script setup lang="ts">
definePageMeta({ layout: 'wow' })

const names = [
  'Эльсвейрит',
  'Зефирковость',
  'Лапковость',
]

const name = ref<null | string>(null)
const realm = ref<null | string>(null)

const { data, execute, status } = useAsyncData('character', () => $fetch('/api/wow/characters', { query: { characterName: name.value, realmSlug: realm.value } }), { immediate: false })
const disabled = computed(() => status.value === 'pending' || !name.value || !realm.value)
</script>

<template>
  <div>
    <div class="flex">
      <v-btn v-for="username in names" :key="username" @click="name = username">
        {{ username }}
      </v-btn>
    </div>

    <div class="flex gap-4 mt-4">
      <v-text-field v-model="name" label="Имя" />
      <wow-realm-selector v-model="realm" />
    </div>

    <v-btn @click="execute" :disabled="disabled">Найти</v-btn>

    <div class="mt-4">
      <wow-profile v-if="data" :media="data.media" :profile="data.profile" />
    </div>
  </div>
</template>
