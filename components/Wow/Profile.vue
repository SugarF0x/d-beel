<script setup lang="ts">
import type { WowCharacterMedia, WowCharacterProfile } from "~/server/api/wow/characters.get"
import { WowClassToColorMap } from "~/server/ydb/types/wow/class"
import { WowRating } from "~/server/ydb/tables/wow_post"
import { WowFactionToSlugMap } from "~/server/ydb/types/wow/faction"

const props = withDefaults(defineProps<{
  profile: WowCharacterProfile,
  media: WowCharacterMedia,
  rating?: WowRating
}>(), {
  rating: WowRating.NEUTRAL
})

const backgroundImage = computed(() => `linear-gradient(transparent, #0008), url('/img/wow/profile/background/${props.rating.toLowerCase()}.jpg')`)
</script>

<template>
  <v-card class="wow-profile-card">
    <div class="preview" :style="{ backgroundImage }">
      <v-img :src="props.media.fullSize" class="image" />
    </div>

    <v-divider vertical />

    <div class="content">
      <v-img :src="`/img/wow/factions/${WowFactionToSlugMap[props.profile.faction]}/logo.png`" class="faction-logo" />

      <h3>{{ profile.fullName }}</h3>
      <h5 :style="{ color: WowClassToColorMap[profile.class] }">{{ profile.level }} ({{ profile.itemLevel }}) {{ profile.race }} {{ profile.class }} ({{ profile.spec }})</h5>
      <h6 v-if="profile.guild" class="guild">&lt;{{ profile.guild }}&gt;</h6>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.wow-profile-card {
  // TODO: remove this, its temporary (probably)
  max-width: 690px;
  display: flex;
}

.preview {
  flex: .5;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.image {
  transform: scale(4);
  aspect-ratio: .5;
}

.content {
  flex: 1;
  padding: 8px;
}

.faction-logo {
  width: 64px;
  height: 64px;
  position: absolute;
  top: 8px;
  right: 8px;
}

.guild {
  opacity: .5;
}
</style>
