<script setup lang="ts">
import { HotsPostRow } from "~/server/ydb/tables/hots_post"
import { useLocalStorage } from "@vueuse/core"
import { UnwrapRef } from "vue"

useHead({
  title: 'Дебилы Шторма'
})

const page = ref(1)
const debouncedPageIndex = ref(page.value - 1)

const postsMeta = useLocalStorage('hots-posts-meta', {
  totalPosts: 0,
  totalPages: 0
})

const posts = useLocalStorage<HotsPostRow[][]>('hots-posts', [])

const { pending, execute: fetchPosts } = useAsyncData('hots-posts', async () => {
  const index = page.value - 1

  await (async () => {
    if (posts.value[index]) return posts.value[index]

    posts.value[index] = await $fetch('/api/hots/posts-page', { params: { page: page.value } })
  })()

  debouncedPageIndex.value = index
}, {
  lazy: true,
  watch: [page]
})

await useAsyncData('hots-posts-meta', async () => {
  const meta: UnwrapRef<typeof postsMeta> = await $fetch('/api/hots/total-posts')

  if (postsMeta.value.totalPosts !== meta.totalPosts) {
    // TODO: add data shifting based on total posts delta
    posts.value = []
    await fetchPosts()
  }

  postsMeta.value = meta
})
</script>

<template>
  <div class="wrapper">
    <v-img class="hero" src="/img/hots/hero.png" />

    <v-container class="controls-container">
      <v-pagination v-model="page" :length="postsMeta.totalPages" :total-visible="Math.min(postsMeta.totalPages, 5)" :disabled="pending" />
      <v-text-field />
      <v-btn>Поиск</v-btn>
      <v-btn>Создать</v-btn>
    </v-container>

    <v-container class="grid-container" :class="{ loading: pending }">
      <hots-post v-for="(post, index) in posts[debouncedPageIndex]" :key="`${post.username}-${index}`" v-bind="post" />
    </v-container>

    <v-pagination v-model="page" :length="postsMeta.totalPages" :total-visible="Math.min(postsMeta.totalPages, 5)" :disabled="pending" />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  background: url('/img/hots/background.jpg') center fixed;
  padding-bottom: 24px;
}

.controls-container {
  display: flex;
  gap: 8px;
}

.loading {
  opacity: .5
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
