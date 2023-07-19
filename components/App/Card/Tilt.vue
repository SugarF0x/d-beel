<script setup lang="ts">
import { UseMouseInElement, UseElementSize } from "@vueuse/components"

function getStyle(width: number, height: number, x: number, y: number, isOutside: boolean) {
  if (isOutside) return

  const rotation = {
    x: -((y - width / 2) / (width / 2)).toFixed(2),
    y: ((x - height / 2) / (height / 2)).toFixed(2)
  }

  const scale = 1.1

  return `transform: rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`
}
</script>

<template>
  <use-element-size v-slot="{ width, height }">
    <use-mouse-in-element v-slot="{ elementX, elementY, isOutside }">
      <div class="wrapper">
        <div class="card" :style="getStyle(width, height, elementX, elementY, isOutside)">
          <slot />
        </div>
      </div>
    </use-mouse-in-element>
  </use-element-size>
</template>

<style scoped lang="scss">
.wrapper {
  perspective: 24px;
}

.card {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  user-select: none;

  transition: all 0.2s ease-out;
}
</style>
