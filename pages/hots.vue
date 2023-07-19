<script setup lang="ts">
useHead({
  title: 'Дебилы Шторма'
})
</script>

<template>
  <div class="wrapper">
    <v-img class="hero" src="/img/hots/hero.png" max-width="800" />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  background: url('/img/hots/background.jpg') center;
}

.hero {
  margin: 0 auto;
}
</style>
