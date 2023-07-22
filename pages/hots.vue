<script setup lang="ts">
import { HotsPostRow } from "~/server/ydb/tables/hots_post"

useHead({
  title: 'Дебилы Шторма'
})

const { data } = await useFetch('/api/hots/get-posts-page', { params: { page: 1 } })
</script>

<template>
  <div class="wrapper">
    <v-img class="hero" src="/img/hots/hero.png" />

    <v-container class="grid-container">
      <hots-post v-for="(post, index) in data as HotsPostRow[]" :key="`${post.username}-${index}`" v-bind="post" />
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
