<script setup lang="ts">
import { WowRating } from "~/server/ydb/tables/wow_post"

const modelValue = defineModel<WowRating | undefined>()
</script>

<template>
  <div class="rating">
    <v-icon
      size="128"
      @click="modelValue = WowRating.BAD"
      class="icon bad"
      :class="{ selected: modelValue === WowRating.BAD }"
    >
      mdi-thumb-down-outline
    </v-icon>
    <v-icon
      size="128"
      @click="modelValue = WowRating.GOOD"
      class="icon good"
      :class="{ selected: modelValue === WowRating.GOOD }"
    >
      mdi-thumb-up-outline
    </v-icon>
  </div>
</template>

<style scoped lang="scss">
.good {
  --color: rgba(0, 128, 0, .5);
  --background-color: rgba(0, 128, 0, 1);
}

.bad {
  --color: rgba(255, 0, 0, .5);
  --background-color: rgba(255, 0, 0, .5);
}

.rating {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.icon {
  padding: 86px;
  background-color: transparent;
  transition: background-color .3s ease-in-out, color .1s ease-in-out;
  border-radius: 50%;

  &.selected {
    color: var(--background-color);
  }

  &:hover {
    background-color: var(--color);
  }
}
</style>
