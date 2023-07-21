<script setup lang="ts">
import { HotsPost } from "~/server/ydb/tables/hots_post"
import { HotsHero } from "~/server/ydb/types/hots/heroes"

useHead({
  title: 'Дебилы Шторма'
})

const dummyData: HotsPost = {
  comment: "Ёбаный овощ, на ласт пике видит, что нам нужен танк, а брузер уже имеется, но нет, блядь, я буду играть в молчанку, дрочить себе в anal sex и в итоге всё равно пикать boy next door, после чего флеймит",
  created_at: new Date("2021-02-26T22:15:20Z"),
  created_by: null,
  hero: HotsHero.Sonya,
  rating: 0,
  username: "Aknesta"
}
</script>

<template>
  <div class="wrapper">
    <v-img class="hero" src="/img/hots/hero.png" max-width="800" />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  background: url('/img/hots/background.jpg') center;
}

.hero {
  margin: 0 auto;
}
</style>
