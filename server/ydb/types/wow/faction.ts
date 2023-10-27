export enum WowFaction {
  ALLIANCE = 'Альянс',
  HORDE = 'Орда',
}

export const WowFactionToSlugMap: Record<WowFaction, string> = {
  [WowFaction.ALLIANCE]: 'alliance',
  [WowFaction.HORDE]: 'horde'
}
