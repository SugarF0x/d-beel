export enum WowClass {
  DEATH_KNIGHT = 'Рыцарь Смерти',
  DEMON_HUNTER = 'Охотник на демонов',
  DRUID = 'Друид',
  EVOKER = 'Пробудитель',
  HUNTER = 'Охотник',
  MAGE = 'Маг',
  MONK = 'Монах',
  PALADIN = 'Паладин',
  PRIEST = 'Жрец',
  ROUGE = 'Разбойник',
  SHAMAN = 'Шаман',
  WARLOCK = 'Чернокнижник',
  WARRIOR = 'Воин'
}

export const WowClassToColorMap: Record<WowClass, string> = {
  [WowClass.DEATH_KNIGHT]: '#C41E3A',
  [WowClass.DEMON_HUNTER]: '#A330C9',
  [WowClass.DRUID]: '#FF7C0A',
  [WowClass.EVOKER]: '#33937F',
  [WowClass.HUNTER]: '#AAD372',
  [WowClass.MAGE]: '#3FC7EB',
  [WowClass.MONK]: '#00FF98',
  [WowClass.PALADIN]: '#F48CBA',
  [WowClass.PRIEST]: '#FFFFFF',
  [WowClass.ROUGE]: '#FFF468',
  [WowClass.SHAMAN]: '#0070DD',
  [WowClass.WARLOCK]: '#8788EE',
  [WowClass.WARRIOR]: '#C69B6D',
}
