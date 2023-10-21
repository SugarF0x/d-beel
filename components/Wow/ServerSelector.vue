<script setup lang="ts">
const modelValue = defineModel<string | undefined>()

const { data, pending } = useFetch('/api/wow/realms')

const items = computed(() => Object.keys(data.value ?? {}).sort())
</script>

<template>
  <v-autocomplete
    v-model="modelValue"
    label="Сервер"
    :loading="pending"
    :disabled="pending"
    :items="items"
  />
</template>
