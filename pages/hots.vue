<script setup lang="ts">
import { HotsPostRow } from "~/server/ydb/tables/hots_post"
import { useLocalStorage } from "@vueuse/core"
import { UnwrapRef } from "vue"

useHead({
  title: 'Дебилы Шторма'
})

const { data: isAuthed } = useAuth()

const page = ref(1)
const debouncedPageIndex = ref(page.value - 1)

watch([page], () => {
  scrollTo({ top: 0, behavior: "smooth" })
})

const postsMeta = useLocalStorage('hots-posts-meta', {
  totalPosts: 0,
  totalPages: 0
})

const posts = useLocalStorage<HotsPostRow[][]>('hots-posts', [])

const { pending: isFetching, execute: fetchPosts } = useAsyncData('hots-posts', async () => {
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

const searchValue = ref('')
watch(searchValue, (value) => {
  if (!value) searchResults.value = null
})

const { data: searchResults, status: searchStatus, execute: search } = useAsyncData('hots-username-search', async () => await $fetch('/api/hots/search', { params: { username: searchValue.value } }), { immediate: false })

const isLoading = computed(() => searchStatus.value === 'pending' || isFetching.value)
</script>

<template>
  <div class="wrapper">
    <v-img class="hero" src="/img/hots/hero.png" />

    <v-container class="controls-container">
      <v-pagination v-model="page" :length="postsMeta.totalPages" :total-visible="Math.min(postsMeta.totalPages, 5)" :disabled="isLoading || !!searchResults" />
      <v-text-field v-model="searchValue" hide-details label="Имя дебила" @keyup.enter="() => searchValue.length && search()" />

      <div class="action">
        <v-btn color="primary" :disabled="!searchValue.length" @click="search">Поиск</v-btn>
        <v-btn color="secondary" :disabled="!isAuthed">Создать</v-btn>
      </div>
    </v-container>

    <v-container class="grid-container" :class="{ loading: isLoading }">
      <hots-post v-for="(post, index) in searchResults ?? posts[debouncedPageIndex]" :key="`${post.username}-${index}`" v-bind="post" />
    </v-container>

    <v-pagination v-model="page" :length="postsMeta.totalPages" :total-visible="Math.min(postsMeta.totalPages, 5)" :disabled="isLoading || !!searchResults" />
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
  align-items: center;

  .action {
    display: flex;
    margin-left: 8px;
    gap: 8px;
  }
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

  & > div {
    &:not(:first-child) {
      margin-top: 20px;
    }

    break-inside: avoid;
  }
}

.hero {
  margin: 0 auto;
  aspect-ratio: 800 / 350;
  max-width: 800px;
}
</style>
