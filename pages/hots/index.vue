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

const posts = computed<HotsPost[]>(() => {
  if (!data.value) return []
  return data.value.posts
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
    <v-container :class="{ loading: pending }">
      <v-row v-masonry transition-duration="0" item-selector=".item">
        <v-col v-masonry-tile v-for="post in posts" :key="`${post.username}-${post.created_at}`" class="item" cols="12" sm="6" lg="4" xl="3" >
          <hots-publication v-bind="post" @reaction-update="updateReaction" />
        </v-col>
      </v-row>
    </v-container>
  </app-pagination>
</template>

<style scoped lang="scss">
.loading {
  opacity: .5
}
</style>
