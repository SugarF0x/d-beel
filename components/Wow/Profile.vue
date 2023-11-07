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

const backgroundImage = computed(() => `url('${props.media.fullSize}'), linear-gradient(#000, #0003), url('/img/wow/profile/background/${props.rating.toLowerCase()}.jpg')`)
</script>

<template>
  <v-card class="vars wow-profile-card" >
    <div class="header" :style="{ backgroundImage }" >
      <div class="info">
        <h3 :style="{ color: WowClassToColorMap[profile.class] }">{{ profile.fullName }}</h3>
        <h5 v-if="profile.guild" class="guild">&lt;{{ profile.guild }}&gt;</h5>
      </div>

      <div class="spec">
        <h5 :style="{ color: WowClassToColorMap[profile.class] }">{{ profile.level }} ({{ profile.itemLevel }}) {{ profile.race }} {{ profile.class }} ({{ profile.spec }})</h5>
        <slot name="header" />
      </div>
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
  background-position: center 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info {
  padding: var(--content-padding);
  text-align: center;
}

.spec {
  padding: var(--content-padding);
}

.guild {
  opacity: .5;
}
</style>
