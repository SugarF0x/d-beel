<script setup lang="ts">
import saveRouteParams from "~/utils/router/saveRouteParams"
import { format } from "date-fns"
import { encounterToLocaleMap } from "~/server/ydb/types/wow/encounter"
import { WowPost } from "~/server/api/wow/index.get"
import { HotsPost } from "~/server/api/hots/index.get"

definePageMeta({ layout: 'wow' })
useHead({ title: 'Дебилы варика' })

const POSTS_PER_PAGE = 12

const page = ref(1)
const debouncedPageIndex = ref(page.value - 1)
const input = ref('')

const { data, pending, execute, status } = useAsyncData('wow-posts', async () => {
  saveRouteParams()
  const index = page.value - 1

  const results = await $fetch('/api/wow', {
    params: {
      page: page.value,
      postsPerPage: POSTS_PER_PAGE,
      name: input.value || undefined
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

const breakpoints = useBreakpoints({
  1: 0,
  2: 960,
  3: 1920,
}).current()

const posts = computed<WowPost[]>(() => {
  if (!data.value) return []

  const columns = breakpoints.value.length
  return data.value.posts.reduce(
    (acc, val, index) => {
      acc[index % columns].push(val)
      return acc
    },
    Array.from({ length: columns }, () => []) as WowPost[][]
  ).flat()
})

onSuspenseRerender(() => { status.value === "idle" && execute() })

const totalPages = computed(() => Math.max(1, (data.value && Math.ceil(data.value.totalPosts / POSTS_PER_PAGE)) ?? 0))
</script>

<template>
  <app-pagination
    v-model:page="page"
    v-model:input="input"
    :loading="pending"
    :total-pages="totalPages"
    create-url="/wow/create"
    @search="search"
  >
    <v-container v-if="posts.length" class="grid-container" >
      <wow-profile v-for="post in posts" :key="post.created_at" v-bind="post" >
        <table>
          <tr>
            <td>Автор</td>
            <td>{{ post.created_by }}</td>
          </tr>
          <tr>
            <td>Дата публикации</td>
            <td>{{ format(new Date(post.created_at), 'dd.MM.yyyy') }}</td>
          </tr>
          <tr>
            <td>Место встречи</td>
            <td>{{ encounterToLocaleMap[post.encounter] }}</td>
          </tr>
          <tr v-if="post.encounter_details">
            <td>Подробности</td>
            <td>{{ post.encounter_details }}</td>
          </tr>
        </table>

        <v-divider class="divider" />

        <div>
          {{ post.comment }}
        </div>
      </wow-profile>
    </v-container>
  </app-pagination>
</template>

<style scoped lang="scss">
.divider {
  margin: 12px 0;
}

.grid-container {
  columns: 1;

  @media only screen and (min-width: 960px) {
    columns: 2;
  }

  @media only screen and (min-width: 1920px) {
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
</style>
