<script setup lang="ts">
const names = [
  'Эльсвейрит',
  'Зефирковость',
  'Лапковость',
]

const name = ref('')
const realm = ref<undefined | string>()

const { data, execute, status } = useAsyncData('character', () => $fetch('/api/wow/characters', { query: { characterName: name.value, realmSlug: realm.value } }), { immediate: false })
const disabled = computed(() => status.value === 'pending' || !name.value || !realm.value)
</script>

<template>
  <div>
    <div class="flex">
      <v-btn v-for="username in names" :key="name" @click="name = username">
        {{ username }}
      </v-btn>
    </div>

    <v-text-field v-model="name" />
    <wow-realm-selector v-model="realm" />
    <v-btn @click="execute" :disabled="disabled">Найти</v-btn>

    <wow-profile v-if="data" :media="data.media" :profile="data.profile" />
  </div>
</template>
