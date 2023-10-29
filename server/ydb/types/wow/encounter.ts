export enum WowEncounter {
  KEY = 'KEY',
  RAID = 'RAID',
  BATTLEGROUND = 'BATTLEGROUND',
  ARENA = 'ARENA',
  WORLD = 'WORLD',
  OTHER = 'OTHER',
}

export const encounterToLocaleMap: Record<WowEncounter, string> = {
  [WowEncounter.KEY]: 'Ключ',
  [WowEncounter.RAID]: 'Рейд',
  [WowEncounter.BATTLEGROUND]: 'Поле боя',
  [WowEncounter.ARENA]: 'Арена',
  [WowEncounter.WORLD]: 'Мир',
  [WowEncounter.OTHER]: 'Другое',
}
