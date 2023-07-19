<script setup lang="ts">
definePageMeta({ auth: true })

const data = ref<unknown>(null)

async function getEntries() {
  data.value = (await useFetch('/api/hots/last-ten-entries')).data
}
</script>

<template>
  i am some other page

  <v-btn @click="getEntries">
    get last 10 entries
  </v-btn>

  <pre>{{ data }}</pre>
</template>

<style scoped lang="scss">

</style>
