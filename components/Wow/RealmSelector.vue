<script setup lang="ts">
const modelValue = defineModel<string | null>()

const { data, pending, execute } = useFetch('/api/wow/realms', { immediate: false })
onSuspenseRerender(execute)

type Item = {
  title: string
  value: string
}

const items = computed<Item[]>(() => {
  const value = data.value
  if (!value) return []

  const keys = Object.keys(value).sort()
  return keys.reduce<Item[]>((acc, key) => {
    acc.push({ title: value[key], value: key })
    return acc
  }, [])
})
</script>

<template>
  <v-autocomplete
    v-model="modelValue"
    label="Сервер"
    :loading="pending"
    :disabled="pending"
    :items="items"
    hide-details
  />
</template>
