<script setup lang="ts">
import { HotsHero } from "~/server/ydb/types/hots/heroes"

const emit = defineEmits<{
  (e: 'click', hero: HotsHero): void
}>()

const props = defineProps<{ hero: HotsHero, size?: number, active?: boolean }>()
const { size, active, hero } = toRefs(props)

watch(active, value => {
  console.log(`${hero.value} changed to ${value}`)
})
</script>

<template>
  <button class="hero-portrait" :class="{ active }" @click="emit('click', hero)">
    <v-img :src="`/img/hots/heroes/portrait/${hero}.png`" class="portrait" />
  </button>
</template>

<style scoped lang="scss">
.hero-portrait {
  width: calc(v-bind(size) * 1px);
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;

  &.active, &:hover {
    .portrait {
      transform: scale(1.1);
    }
  }
}

.portrait {
  transition: .2s ease-in-out;
}
</style>
