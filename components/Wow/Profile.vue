<script setup lang="ts">
import type { WowCharacterMedia, WowCharacterProfile } from "~/server/utils/wow/formatCharacterInfo"
import { WowClassToColorMap } from "~/server/ydb/types/wow/class"
import { WowRace } from "~/server/ydb/types/wow/race"
import { WowRating } from "~/server/ydb/tables/wow_post"

const props = withDefaults(defineProps<{
  profile: WowCharacterProfile,
  media: WowCharacterMedia,
  rating?: WowRating
}>(), {
  rating: WowRating.NEUTRAL
})

const backgroundPositionY = computed(() => {
  switch (props.profile.race) {
    case WowRace.VULPERA: return '50%'
    default: return '25%'
  }
})

const backgroundImage = computed(() => `url('${props.media.fullSize}'), linear-gradient(#000, #0003), url('/img/wow/profile/background/${props.rating.toLowerCase()}.jpg')`)
const classColor = computed(() => WowClassToColorMap[props.profile.class])
</script>

<template>
  <v-card class="vars wow-profile-card" >
    <div class="header" :style="{ backgroundImage, backgroundPositionY }" >
      <div class="info">
        <h3 class="name">{{ profile.fullName }}</h3>
        <h4 class="spec">{{ profile.level }} ({{ profile.itemLevel }}) {{ profile.race }} {{ profile.class }} ({{ profile.spec }})</h4>
        <h5 v-if="profile.guild" class="guild">&lt;{{ profile.guild }}&gt;</h5>
      </div>

      <slot name="header" />
    </div>

    <v-divider />

    <div class="content">
      <slot name="default" />
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.vars {
  --content-padding: 8px;
  --faction-logo-size: 64px;
}

.header {
  aspect-ratio: 230/116;
  height: 100%;
  background-size: 200%;
  background-position-x: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info {
  padding: var(--content-padding);
  text-align: center;
}

.guild, .spec {
  opacity: .5;
}

.name, .spec {
  color: v-bind(classColor);
}

.content {
  padding: var(--content-padding);
}
</style>
