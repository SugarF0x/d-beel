<script setup lang="ts">
defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:input', value: string): void
  (e: 'search'): void
}>()

const props = defineProps<{
  page: number
  input: string
  totalPages: number
  loading: boolean
  createUrl: string
}>()
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="12" lg="4">
          <v-pagination
            :value="page"
            @update:model-value="e => $emit('update:page', e)"
            :length="totalPages"
            :disabled="loading"
            :total-visible="Math.min(totalPages, 5)"
            density="comfortable"
          />
        </v-col>
        <v-col cols="12" sm="7" md="8" lg="5">
          <v-text-field
            :value="input"
            @update:model-value="e => $emit('update:input', e)"
            hide-details
            label="Имя дебила"
            @keyup.enter="$emit('search')"
            :loading="loading"
            :diabled="loading"
          />
        </v-col>
        <v-col cols="12" sm="5" md="4" lg="3" class="action">
          <v-btn color="primary" @click="$emit('search')">Поиск</v-btn>
          <v-btn color="secondary" @click="navigateTo(createUrl)">Создать</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <slot name="default" />

    <v-pagination
      :value="page"
      @update:model-value="e => $emit('update:page', e)"
      :length="totalPages"
      :disabled="loading"
      density="comfortable"
    />
  </div>
</template>

<style scoped lang="scss">
.action {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
</style>
