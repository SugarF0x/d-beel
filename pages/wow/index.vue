<script setup lang="ts">
import { BlizzAPI } from "blizzapi"

const api = new BlizzAPI({
  region: "eu",
  clientId: process.env.WOW_CLIENT_ID,
  clientSecret: process.env.WOW_CLIENT_SECRET,
})

const names = [
  'Эльсвейрит',
  'Зефирковость',
  'Лапковость',
]

const images = reactive<Record<string, string>>({})

async function load(characterName: string) {
  const realmSlug = 'gordunni'

  const results = await api.query(`/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/character-media`, {
    params: {
      namespace: 'profile-eu',
      locale: 'ru_RU'
    }
  })


  if (!results || typeof results !== 'object' || !('assets' in results)) return
  const { assets } = { ...results }

  if (!Array.isArray(assets)) return

  for (const asset of assets) {
    images[asset.key] = asset.value
  }
}
</script>

<template>
  <div class="flex">
    <v-btn v-for="name in names" :key="name" @click="load(name)">
      {{ name }}
    </v-btn>
  </div>

  <div>
    <v-img v-for="url in images" :key="url" :src="url" inline />
  </div>
</template>

<style scoped lang="scss">

</style>
