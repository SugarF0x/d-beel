<script setup lang="ts">
import { HotsPostRow } from "~/server/ydb/tables/hots_post"
import { HotsHero } from "~/server/ydb/types/hots/heroes"

useHead({
  title: 'Дебилы Шторма'
})

const dummyData: HotsPostRow[] = [
  {
    comment: "Ёбаный овощ, на ласт пике видит, что нам нужен танк, а брузер уже имеется, но нет, блядь, я буду играть в молчанку, дрочить себе в anal sex и в итоге всё равно пикать boy next door, после чего флеймит",
    created_at: new Date("2021-02-26T22:15:20Z"),
    created_by: null,
    hero: HotsHero.Sonya,
    rating: 0,
    username: "Aknesta"
  },
  {
    comment: "Сраный дебил говна, пикнул трейсер, когда та нам нахуй не усралась, в итоге сосала хуй всю игру",
    created_at: new Date("2021-01-23T13:38:58Z"),
    created_by: null,
    hero: HotsHero.Tracer,
    rating: 1,
    username: "Alastor"
  },
  {
    comment: "Ебашит как бог на ктз с оверахуевшим винрейтом",
    created_at: new Date("2021-01-23T13:38:58Z"),
    created_by: null,
    hero: HotsHero.Kelthuzad,
    rating: 5,
    username: "Albastrel92"
  },
]
</script>

<template>
  <div class="wrapper">
    <v-img class="hero" src="/img/hots/hero.png" />

    <v-container class="grid-container">
      <hots-post v-for="(post, index) in cachedData" :key="`${post.username}-${index}`" v-bind="post" />
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  background: url('/img/hots/background.jpg') center;
}

.grid-container {
  columns: 1;

  @media only screen and (min-width: 640px) {
    columns: 2;
  }

  @media only screen and (min-width: 960px) {
    columns: 3;
  }

  column-gap: 20px;

  & > div+div {
    margin-top: 20px;
    break-inside: avoid;
  }
}

.hero {
  margin: 0 auto;
  aspect-ratio: 800 / 350;
  max-width: 800px;
}
</style>
