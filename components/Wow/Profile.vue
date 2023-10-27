<script setup lang="ts">
import type { WowCharacterMedia, WowCharacterProfile } from "~/server/api/wow/characters.get"
import { WowClassToColorMap } from "~/server/ydb/types/wow/class"

const props = defineProps<{ profile: WowCharacterProfile, media: WowCharacterMedia }>()

const factionToSlugMap: Record<string, string> = { Альянс: 'alliance', Орда: 'horde' }
</script>

<template>
  <v-card class="wow-profile-card">
    <v-img :src="props.media.fullSize" class="image" />

    <v-divider vertical />

    <div class="content">
      <v-img :src="`/img/wow/factions/${factionToSlugMap[props.profile.faction]}/logo.png`" class="faction-logo" />

      <h3>{{ profile.fullName }}</h3>
      <h5 :style="{ color: WowClassToColorMap[profile.class] }">{{ profile.level }} ({{ profile.itemLevel }}) {{ profile.race }} {{ profile.class }} ({{ profile.spec }})</h5>
      <h6 v-if="profile.guild">&lt;{{ profile.guild }}&gt;</h6>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.wow-profile-card {
  // TODO: remove this, its temporary (probably)
  max-width: 690px;
  display: flex;
}

.image {
  transform: scale(4);
  aspect-ratio: .5;
  flex: .5;
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
</style>
