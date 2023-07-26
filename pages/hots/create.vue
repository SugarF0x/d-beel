<script setup lang="ts">
import { HotsHero, HotsHeroRole } from "~/server/ydb/types/hots/heroes"

definePageMeta({ layout: 'hots', middleware: ['auth'] })
useHead({ title: 'Новый дебил' })

const tabTitles = ['Герой', 'Ревью', 'Публикация']
const tabIndex = ref(0)

const hero = ref<HotsHero | undefined>(undefined)

function select(value: HotsHero) {
  if (hero.value === value) hero.value = undefined
  else hero.value = value
}

const roleToTitleMap: Record<HotsHeroRole, string> = {
  [HotsHeroRole.Tank]: 'Танк',
  [HotsHeroRole.Bruiser]: 'Брузер',
  [HotsHeroRole.RangedAssasin]: 'Ренжевик',
  [HotsHeroRole.MeleeAssasin]: 'Милишник',
  [HotsHeroRole.Healer]: 'Хил',
  [HotsHeroRole.Support]: 'Саппорт',
}
</script>

<template>
  <v-tabs v-model="tabIndex" color="cyan" align-tabs="center">
    <v-tab v-for="(title, index) of tabTitles" :value="index">{{ title }}</v-tab>
  </v-tabs>
  <v-window v-model="tabIndex">
    <v-window-item :value="0">
      <v-container>
        <v-container class="hots-post-create-page">
          <div v-for="role in HotsHeroRole" :key="role" class="hero-selection-section">
            <h2>{{ roleToTitleMap[role] }}</h2>
            <hots-hero-selector :role="role" :selected="hero" @select="select" />
          </div>
        </v-container>
      </v-container>
    </v-window-item>

    <v-window-item :value="1">
      <v-container>

      </v-container>
    </v-window-item>

    <v-window-item :value="2">
      <v-container>

      </v-container>
    </v-window-item>
  </v-window>
</template>

<style scoped lang="scss">
.hots-post-create-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-selection-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
