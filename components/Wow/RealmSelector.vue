<script setup lang="ts">
const modelValue = defineModel<string | undefined>()

const { data, pending } = useFetch('/api/wow/realms')

const items = computed(() => Object.keys(data.value ?? {}).sort())
const value = ref<undefined | string>(undefined)

watch(value, newValue => { modelValue.value = !newValue ? newValue : data.value?.[newValue] })
</script>

<template>
  <v-autocomplete
    v-model="value"
    label="Сервер"
    :loading="pending"
    :disabled="pending"
    :items="items"
  />
</template>
