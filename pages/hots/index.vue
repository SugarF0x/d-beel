<script setup lang="ts">
import onSuspenseRerender from "~/hooks/onSuspenseRerender"

definePageMeta({ layout: 'hots' })
useHead({ title: 'Дебилы Шторма' })

const searchValue = ref('')

const page = ref(1)
const debouncedPageIndex = ref(page.value - 1)

watch([page], () => {
  scrollTo({ top: 0, behavior: "smooth" })
})

const { data, pending, execute } = useAsyncData('hots-posts', async () => {
  const index = page.value - 1

  const results = await $fetch('/api/hots/posts-page', {
    params: {
      page: page.value,
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

onSuspenseRerender(execute)

const totalPages = computed(() => Math.max(1, (data.value && Math.ceil(data.value.totalPosts / data.value.posts.length)) ?? 0))
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="12" lg="4">
          <v-pagination v-model="page" :length="totalPages" :disabled="pending" :total-visible="Math.min(totalPages, 5)" density="comfortable" />
        </v-col>
        <v-col cols="12" sm="7" md="8" lg="5">
          <v-text-field v-model="searchValue" hide-details label="Имя дебила" @keyup.enter="execute" :loading="pending" :diabled="pending" />
        </v-col>
        <v-col cols="12" sm="5" md="4" lg="3" class="action">
          <v-btn color="primary" @click="execute">Поиск</v-btn>
          <v-btn color="secondary" @click="navigateTo('/hots/create')">Создать</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="grid-container" :class="{ loading: pending }">
      <hots-post v-for="(post, index) in data?.posts ?? []" :key="`${post.username}-${index}`" v-bind="post" />
    </v-container>

    <v-pagination v-model="page" :length="totalPages" :disabled="pending" density="comfortable" />
  </div>
</template>

<style scoped lang="scss">
.action {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

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

  column-gap: 20px;

  & > div {
    &:not(:first-child) {
      margin-top: 20px;
    }

    break-inside: avoid;
  }
}
</style>
