<script setup lang="ts">
import type { WowCharacterMedia, WowCharacterProfile } from "~/server/utils/wow/formatCharacterInfo"
import { WowClassToColorMap } from "~/server/ydb/types/wow/class"
import { WowRating } from "~/server/ydb/tables/wow_post"

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
  <v-card class="vars wow-profile-card">
    <div class="preview" :style="{ backgroundImage }">
      <v-img :src="`/img/wow/factions/${props.profile.faction.toLowerCase()}/logo.png`" class="faction-logo" />
      <v-img :src="props.media.fullSize" class="image" />
    </div>

    <v-divider vertical />

    <div class="content">
      <h3>{{ profile.fullName }}</h3>
      <h5 :style="{ color: WowClassToColorMap[profile.class] }">{{ profile.level }} ({{ profile.itemLevel }}) {{ profile.race }} {{ profile.class }} ({{ profile.spec }})</h5>
      <h6 v-if="profile.guild" class="guild">&lt;{{ profile.guild }}&gt;</h6>
      <div class="slot">
        <slot />
      </div>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.vars {
  --content-padding: 8px;
  --faction-logo-size: 64px;
}

.wow-profile-card {
  display: flex;
}

.preview {
  flex: .5;
  position: relative;
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
  display: flex;
  flex-direction: column;
  padding: var(--content-padding);
}

.faction-logo {
  position: absolute;
  width: var(--faction-logo-size);
  height: var(--faction-logo-size);
  top: var(--content-padding);
  right: var(--content-padding);
}

.guild {
  opacity: .5;
}

.slot {
  flex: 1;
  margin-top: var(--content-padding);
}
</style>
