<script setup lang="ts">
import { HotsHero } from "~/server/ydb/types/hots/heroes"

definePageMeta({ layout: 'hots', middleware: ['auth'] })
useHead({ title: 'Новый дебил' })

const selected = reactive(new Set())

function select(hero: HotsHero) {
  if (selected.has(hero)) selected.delete(hero)
  else selected.add(hero)
}
</script>

<template>
  <div style="flex: 1; display: flex; justify-content: center; align-items: center; gap: 24px;">
    <hots-portrait :hero="HotsHero.Yrel" @click="select" :active="selected.has(HotsHero.Yrel)" />
    <hots-portrait :hero="HotsHero.Auriel" @click="select" :active="selected.has(HotsHero.Auriel)" />
    <hots-portrait :hero="HotsHero.Brightwing" @click="select" :active="selected.has(HotsHero.Brightwing)" />
    <hots-portrait :hero="HotsHero.Whitemane" @click="select" :active="selected.has(HotsHero.Whitemane)" />
    <hots-portrait :hero="HotsHero.Tyrande" @click="select" :active="selected.has(HotsHero.Tyrande)" />
  </div>
</template>

<style scoped lang="scss">

</style>
