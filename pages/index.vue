<script setup lang="ts">
const { data, signOut } = useAuth()
</script>

<template>
  <h1>i am a protected index page</h1>

  <pre class="data">{{ data }}</pre>

  <v-btn @click="signOut">logout</v-btn>
</template>

<style scoped lang="scss">
.data {
  margin: 24px 0;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}
</style>
