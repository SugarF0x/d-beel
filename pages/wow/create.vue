<script setup lang="ts">
import { WowEncounter } from "~/server/ydb/types/wow/encounter"
import { WowRating } from "~/server/ydb/tables/wow_post"
import { $fetch } from "ofetch"

definePageMeta({ layout: 'wow', middleware: ['auth'] })
useHead({ title: 'Новый дебил' })

const name = ref<null | string>(null)
const realm = ref<null | string>(null)

const { data, execute, status } = useAsyncData('character', () => $fetch('/api/wow/character', { query: { characterName: name.value, realmSlug: realm.value }, retry: false }), { immediate: false })
const disabled = computed(() => status.value === 'pending' || !name.value || !realm.value)

const isConfirmed = ref(false)

const encounter = ref<WowEncounter | undefined>()
const encounterDetails = ref('')
const comment = ref('')
const rating = ref<WowRating | undefined>()

const canPublish = computed(() => !!encounter.value && !!comment.value && !!rating.value)
const isLoading = ref(false)
async function publish() {
  isLoading.value = true

  const response = await $fetch('/api/wow', {
    method: 'POST',
    body: {
      name: name.value,
      realm: realm.value,
      comment: comment.value,
      rating: rating.value,
      encounter: encounter.value,
      encounterDetails: encounterDetails.value
    }
  })

  if (response === true) navigateTo('/wow')
  isLoading.value = false
}
</script>

<template>
  <v-container style="max-width: 1080px;">
    <v-row v-if="!isConfirmed">
      <v-col>
        <v-text-field hide-details v-model="name" label="Имя" />
      </v-col>
      <v-col>
        <wow-realm-selector v-model="realm" />
      </v-col>
      <v-col cols="12" style="display: flex; justify-content: flex-end">
        <v-btn @click="execute" :disabled="disabled" color="secondary">Найти</v-btn>
      </v-col>
    </v-row>

    <div class="mt-4">
      <wow-profile v-if="data" :media="data.media" :profile="data.profile" :rating="rating" >
        <div v-if="!isConfirmed" class="card-content card-confirmation">
          <div class="prompt">Это тот персонаж?</div>
          <v-btn width="128" height="64" color="success" @click="isConfirmed = true">Да</v-btn>
        </div>
        <div v-else class="card-content">
          <wow-encounter-selector v-model="encounter" :disabled="isLoading" />
          <v-text-field v-model="encounterDetails" label="Подробности" placeholder="Нелтарий +15" hide-details :disabled="isLoading" />
          <v-textarea v-model="comment" label="Отзыв" :disabled="isLoading" />
          <wow-rating-selector v-model="rating" :disabled="isLoading" />

          <div class="action">
            <v-btn :disabled="!canPublish" @click="publish" :loading="isLoading" >Опубликовать</v-btn>
          </div>
        </div>
      </wow-profile>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-confirmation {
  justify-content: center;
  align-items: center;
  gap: 8px;

  .prompt {
    font-size: 2em;
  }
}

.action {
  margin: 16px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
</style>
