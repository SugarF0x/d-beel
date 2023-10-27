<template>
  <div class="wrapper">
    <v-img class="hero" src="/img/wow/hero.png" />

    <slot />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  background-image: linear-gradient(transparent, black), url('/img/wow/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  padding-bottom: 24px;
}

.hero {
  margin: 0 auto;
  aspect-ratio: 800 / 350;
  max-width: 800px;
}
</style>
