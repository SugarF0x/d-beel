<script setup lang="ts">
import { heroRoleToHeroesMap, HotsHero, HotsHeroRole } from "~/server/ydb/types/hots/heroes"

const emit = defineEmits<{
  (e: 'select', hero: HotsHero): void
}>()

const props = defineProps<{ role: HotsHeroRole, selected?: HotsHero }>()
const heroes = computed(() => heroRoleToHeroesMap[props.role])
</script>

<template>
  <div class="role-heroes-list">
    <hots-portrait
      v-for="hero in heroes"
      :key="hero"
      :hero="hero"
      :grey="selected && selected !== hero"
      :size="64"
      @click="emit('select', hero)"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
