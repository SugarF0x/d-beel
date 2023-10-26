<script setup lang="ts">
import type { WowCharacterMedia, WowCharacterProfile } from "~/server/api/wow/characters.get"

const props = defineProps<{ profile: WowCharacterProfile, media: WowCharacterMedia }>()
</script>

<template>
  <v-card class="wow-profile-card">
    <v-img :src="props.media.header" width="230" />

    <pre>{{ profile }}</pre>
  </v-card>
</template>

<style scoped lang="scss">
.wow-profile-card {
  // TODO: remove this, its temporary (probably)
  max-width: 690px;
}
</style>
