<template>
  <div class="wrapper">
    <v-img class="hero" src="/img/hots/hero.png" />

    <slot />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  background-image: url('/img/wow/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  padding-bottom: 24px;
}

.hero {
  margin: 0 auto;
  aspect-ratio: 800 / 350;
  max-width: 800px;
}
</style>
