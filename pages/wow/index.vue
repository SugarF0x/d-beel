<script setup lang="ts">
const names = [
  'Эльсвейрит',
  'Зефирковость',
  'Лапковость',
]

const images = ref<Record<string, string>>({})

const realm = ref<undefined | string>()

async function load(characterName: string) {
  const results = await $fetch('/api/wow/characters', { query: { characterName, realmSlug: realm.value } })

  console.log(results)

  images.value = results.media
}
</script>

<template>
  <div class="flex">
    <v-btn v-for="name in names" :key="name" @click="load(name)" :disabled="!realm">
      {{ name }}
    </v-btn>
  </div>

  <div>
    <wow-realm-selector v-model="realm" />
  </div>

  <div>
    <v-img v-for="url in images" :key="url" :src="url" inline />
  </div>
</template>

<style scoped lang="scss">

</style>
