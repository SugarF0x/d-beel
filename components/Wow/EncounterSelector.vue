<script setup lang="ts">
import { encounterToLocaleMap, WowEncounter } from "~/server/ydb/types/wow/encounter"

const modelValue = defineModel<WowEncounter | null>()

const items = Object.values(WowEncounter).map(value => ({ value, title: encounterToLocaleMap[value] }))
</script>

<template>
  <v-autocomplete
    v-model="modelValue"
    label="Место встречи"
    :items="items"
    :placeholder="encounterToLocaleMap[WowEncounter.KEY]"
    hide-details
  />
</template>
