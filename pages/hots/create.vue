<script setup lang="ts">
import { HotsHero, HotsHeroRole } from "~/server/ydb/types/hots/heroes"
import { hotsRatingColors } from "~/const/hots/colors"

definePageMeta({ layout: 'hots', middleware: ['auth'] })
useHead({ title: 'Новый дебил' })

const { data: authData } = useAuth()

const tabIndex = ref(0)
const tabItems = computed(() => [
  { text: 'Герой', disabled: isLoading.value },
  { text: 'Ревью', disabled: isLoading.value },
  { text: 'Публикация', disabled: isLoading.value || !Boolean(username.value && comment.value) },
])

const hero = ref<HotsHero | undefined>(undefined)

function select(value: HotsHero) {
  if (hero.value === value) hero.value = undefined
  else hero.value = value
}

const roleToTitleMap: Record<HotsHeroRole, string> = {
  [HotsHeroRole.Tank]: 'Танк',
  [HotsHeroRole.Bruiser]: 'Брузер',
  [HotsHeroRole.RangedAssasin]: 'Ренжевик',
  [HotsHeroRole.MeleeAssasin]: 'Милишник',
  [HotsHeroRole.Healer]: 'Хил',
  [HotsHeroRole.Support]: 'Саппорт',
}

const username = ref('')
const comment = ref('')
const rating = ref(0)

const { status, execute: publish } = useAsyncData('hots-posts', async () => {
  const result = await $fetch('/api/hots', {
    method: 'POST',
    body: {
      hero: hero.value,
      username: username.value,
      comment: comment.value,
      rating: rating.value,
    },
    retry: false
  })

  if (result) navigateTo('/hots', { external: true })
}, {
  lazy: true,
  immediate: false
})

const isLoading = computed(() => status.value === 'pending')
</script>

<template>
  <v-tabs v-model="tabIndex" color="cyan" align-tabs="center" class="hots-post-creation-tabs">
    <v-tab v-for="item in tabItems" :key="item.text" v-bind="item" />
  </v-tabs>

  <v-window v-model="tabIndex">
    <v-window-item :value="0">
      <v-container class="hots-post-creation-container">
        <div v-for="role in HotsHeroRole" :key="role" class="hero-selection-section">
          <h2>{{ roleToTitleMap[role] }}</h2>
          <hots-hero-selector :role="role" :selected="hero" @select="select" />
        </div>
      </v-container>
    </v-window-item>

    <v-window-item :value="1">
      <v-container class="hots-post-creation-container">
        <v-text-field v-model="username" label="Имя дебила" />
        <v-textarea v-model="comment" label="Отзыв" />
        <v-rating v-model="rating" :color="hotsRatingColors[rating]" class="mx-auto" />
      </v-container>
    </v-window-item>

    <v-window-item :value="2">
      <v-container class="hots-post-creation-container align-center">
        <hots-post
          :hero="hero ?? null"
          :comment="comment"
          :rating="rating"
          :username="username"
          :created_at="new Date().toISOString()"
          :created_by="authData?.user.username"
        />

        <v-btn color="primary" @click="publish" :disabled="isLoading">Опубликовать</v-btn>
      </v-container>
    </v-window-item>
  </v-window>
</template>

<style scoped lang="scss">
.hots-post-creation-tabs {
  margin-bottom: 16px;
}

.hots-post-creation-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-selection-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
