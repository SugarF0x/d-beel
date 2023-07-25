<script setup lang="ts">
useHead({
  title: 'Дебилы Шторма'
})

const { data: isAuthed } = useAuth()

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
  watch: [page]
})

const totalPages = computed(() => data.value ? Math.min(data.value.totalPosts / data.value.posts.length, 5) : 1)
</script>

<template>
  <div class="wrapper">
    <v-img class="hero" src="/img/hots/hero.png" />

    <v-container class="controls-container">
      <v-pagination v-model="page" :length="totalPages" :total-visible="Math.min(totalPages, 5)" :disabled="pending" />
      <v-text-field v-model="searchValue" hide-details label="Имя дебила" @keyup.enter="execute" />

      <div class="action">
        <v-btn color="primary" @click="execute">Поиск</v-btn>
        <v-btn color="secondary" :disabled="!isAuthed">Создать</v-btn>
      </div>
    </v-container>

    <v-container class="grid-container" :class="{ loading: pending }">
      <hots-post v-for="(post, index) in data?.posts ?? []" :key="`${post.username}-${index}`" v-bind="post" />
    </v-container>

    <v-pagination v-model="page" :length="totalPages" :total-visible="Math.min(totalPages, 5)" :disabled="pending" />
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
