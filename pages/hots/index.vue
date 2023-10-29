<script setup lang="ts">
import saveRouteParams from "~/utils/router/saveRouteParams"
import type { HotsPost } from "~/server/api/hots/index.get"
import { without } from "lodash-es"

definePageMeta({ layout: 'hots' })
useHead({ title: 'Дебилы Шторма' })

const { data: authData } = useAuth()

const POSTS_PER_PAGE = 12

const searchValue = ref('')
const page = ref(1)
const debouncedPageIndex = ref(page.value - 1)

const { data, pending, execute, status } = useAsyncData('hots-posts', async () => {
  saveRouteParams()
  const index = page.value - 1

  const results = await $fetch('/api/hots', {
    params: {
      page: page.value,
      postsPerPage: POSTS_PER_PAGE,
      username: searchValue.value || undefined
    },
    retry: false
  })

  debouncedPageIndex.value = index
  return results
}, {
  lazy: true,
  immediate: false,
  watch: [page]
})

function search() {
  page.value = 1
  execute()
}

onSuspenseRerender(() => { status.value === "idle" && execute() })

const totalPages = computed(() => Math.max(1, (data.value && Math.ceil(data.value.totalPosts / POSTS_PER_PAGE)) ?? 0))

const breakpoints = useBreakpoints({
  1: 0,
  2: 600,
  3: 960,
  4: 1920,
}).current()

const posts = computed<HotsPost[]>(() => {
  if (!data.value) return []

  const columns = breakpoints.value.length
  return data.value.posts.reduce(
    (acc, val, index) => {
      acc[index % columns].push(val)
      return acc
    },
    Array.from({ length: columns }, () => []) as HotsPost[][]
  ).flat()
})

function updateReaction(props: { emoji: string, add: boolean, username: string, created_at: string }) {
  if (!data.value) return
  if (!authData.value) return

  const post = data.value.posts.find(post => post.username === props.username && post.created_at === props.created_at)
  if (!post) return

  post.reactions ??= {}
  post.reactions[props.emoji] ??= []

  if (props.add) return void post.reactions[props.emoji].push(authData.value.user.username)

  post.reactions[props.emoji] = without(post.reactions[props.emoji], authData.value.user.username)
  if (!post.reactions[props.emoji].length) delete post.reactions[props.emoji]
}
</script>

<template>
  <app-pagination
    v-model:page="page"
    v-model:input="searchValue"
    :loading="pending"
    :total-pages="totalPages"
    create-url="/hots/create"
    @search="search"
  >
    <v-container class="grid-container" :class="{ loading: pending }">
      <hots-post v-for="post in posts" :key="`${post.username}-${post.created_at}`" v-bind="post" @reaction-update="updateReaction" />
    </v-container>
  </app-pagination>
</template>

<style scoped lang="scss">
.loading {
  opacity: .5
}

.grid-container {
  columns: 1;

  @media only screen and (min-width: 600px) {
    columns: 2;
  }

  @media only screen and (min-width: 960px) {
    columns: 3;
  }

  @media only screen and (min-width: 1920px) {
    columns: 4;
  }

  column-gap: 20px;

  & > div {
    &:not(:first-child) {
      margin-top: 20px;
    }

    break-inside: avoid;
  }
}
</style>
