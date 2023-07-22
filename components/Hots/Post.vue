<script setup lang="ts">
import { HotsPostRow } from "~/server/ydb/tables/hots_post"

const { created_at, created_by, hero, rating, username, comment } = defineProps<HotsPostRow>()
</script>

<template>
  <div class="hots-post">
    <v-img class="banner" :src="`/img/hots/heroes/banner/${String(hero)}.jpg`" />

    <p class="comment">
      {{ comment }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.hots-post {
  box-shadow: 0 0 15px 6px rgba(0,0,0,.4);
  border: 1px solid rgba(153,204,255,.2);
  background-color: #0a1133;
}

.comment {
  margin: 20px;
}

.banner {
  aspect-ratio: 600 / 400;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: -webkit-gradient(
        linear, left bottom, left top,
        color-stop(25%,rgba(30,92,153,.6)),
        color-stop(35%,rgba(30, 92, 153, .4)),
        color-stop(50%,rgba(30,92,153,.2)),
        to(rgba(41,102,163,0))
    )
  }
}
</style>
