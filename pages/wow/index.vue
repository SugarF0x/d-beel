<script setup lang="ts">
import saveRouteParams from "~/utils/router/saveRouteParams"

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
    <pre>{{ JSON.stringify(data?.posts, null, 2) }}</pre>
  </app-pagination>
</template>
