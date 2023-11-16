<script setup lang="ts">
import saveRouteParams from "~/utils/router/saveRouteParams"
import { format } from "date-fns"
import { encounterToLocaleMap, WowEncounter } from "~/server/ydb/types/wow/encounter"
import { WowPost } from "~/server/api/wow/index.get"

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

const posts = computed<WowPost[]>(() => {
  if (!data.value) return []
  return data.value.posts
})

onSuspenseRerender(() => { status.value === "idle" && execute() })

const totalPages = computed(() => Math.max(1, (data.value && Math.ceil(data.value.totalPosts / POSTS_PER_PAGE)) ?? 0))

function gotoAuthor(author: string) {
  navigateTo(`/profile/${author}`)
}
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
    <v-container v-if="posts.length" >
      <v-row v-masonry transition-duration="0" item-selector=".item">
        <v-col v-masonry-tile v-for="post in posts" :key="post.created_at" class="item" cols="12" lg="6" xl="4" >
          <wow-profile v-bind="post" >
            <template #header v-if="post.encounter_details || post.encounter !== WowEncounter.OTHER" >
              <div class="post-details no-pad-x">
                <span v-if="post.encounter !== WowEncounter.OTHER" class="encounter">
                  [{{ encounterToLocaleMap[post.encounter] }}]
                </span>
                <span v-if="post.encounter_details" class="encounter-details">
                  {{ post.encounter_details }}
                </span>
              </div>
            </template>

            {{ post.comment }}

            <span class="author" @click="gotoAuthor(post.created_by)">
              &copy; {{ post.created_by }}
              <br>
              {{ format(new Date(post.created_at), 'dd.MM.yyyy') }}
            </span>
          </wow-profile>
        </v-col>
      </v-row>
    </v-container>
  </app-pagination>
</template>

<style scoped lang="scss">
.divider {
  margin: 12px 0;
}

.author {
  text-align: right;
  opacity: .5;
  font-style: italic;
  line-height: 1;
  padding: 8px;
  float: right;
  user-select: none;
  cursor: pointer;
}

.post-details {
  backdrop-filter: brightness(50%) blur(16px);
  padding: 4px;
  text-align: center;
}

.encounter {
  opacity: .5;
}
</style>
