<script setup lang="ts">
import { HotsHero } from "~/server/ydb/types/hots/heroes"

const emit = defineEmits<{
  (e: 'click', hero: HotsHero): void
}>()

const props = defineProps<{ hero: HotsHero, size?: number, active?: boolean, grey?: boolean }>()

const size = computed(() => props.size ?? 128)
</script>

<template>
  <button class="hero-portrait" :class="{ active }" :style="`filter: greyscale(${Number(grey)})`" @click="emit('click', hero)">
    <v-img :src="`/img/hots/heroes/portrait/${hero}.png`" class="portrait" />
    <span class="vingette" />
  </button>
</template>

<style scoped lang="scss">
.hero-portrait {
  position: relative;
  width: calc(v-bind(size) * 1px);
  aspect-ratio: 1;
  border-radius: 50%;
  margin: 4px;
  overflow: hidden;
  box-shadow: 0 0 6px 1px rgba(0,0,0,.6);
  border: 2px solid transparent;
  box-sizing: border-box;
  transition: .2s ease-in-out;

  &:not(.active):hover {
    .portrait {
      transform: scale(1.05);
    }

    .vingette {
      opacity: 1;
    }
  }

  &.active {
    .vingette {
      opacity: .5;
    }
    border: 2px solid rgba(51,153,255,1);
  }

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    border: 2px solid rgba(51,153,255,.4);
    box-shadow: inset 0 0 10px 2px rgba(0,0,0,.8);
    transition: .2s ease-in-out;
  }
}

.portrait {
  transition: .2s ease-in-out;
}

.vingette {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: radial-gradient(transparent, rgba(51,153,255,.1), rgba(51,153,255,1));
  opacity: 0;
  transition: .2s ease-in-out;
}
</style>
