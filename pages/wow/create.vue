<script setup lang="ts">
definePageMeta({ layout: 'wow', middleware: ['auth'] })
useHead({ title: 'Новый дебил' })

const name = ref<null | string>(null)
const realm = ref<null | string>(null)

const { data, execute, status } = useAsyncData('character', () => $fetch('/api/wow/character', { query: { characterName: name.value, realmSlug: realm.value }, retry: false }), { immediate: false })
const disabled = computed(() => status.value === 'pending' || !name.value || !realm.value)
</script>

<template>
  <v-container style="max-width: 1080px;">
    <v-row>
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
      <wow-profile v-if="data" :media="data.media" :profile="data.profile">
        <div class="card-confirmation">
          <div class="prompt">Это тот персонаж?</div>
          <div class="actions">
            <v-btn width="128" height="64" color="error">Нет</v-btn>
            <v-btn width="128" height="64" color="success">Да</v-btn>
          </div>
        </div>
      </wow-profile>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.card-confirmation {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .prompt {
    font-size: 2em;
  }

  .actions {
    display: flex;
    margin-top: 8px;
    gap: 16px;
  }
}
</style>
