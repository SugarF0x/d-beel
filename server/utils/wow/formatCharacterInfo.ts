import { WowCharacterMediaResponse, WowCharacterProfileResponse, WowProfileFaction, WowProfileGender } from "~/server/ydb/types/wow/blizzApiResponse"
import { WowClass } from "~/server/ydb/types/wow/class"

export interface WowCharacterProfile {
  spec: string
  name: string
  fullName: string
  itemLevel: number
  class: WowClass
  faction: WowProfileFaction
  gender: WowProfileGender
  guild?: string
  level: number
  id: number
  race: string
}

export interface WowCharacterMedia {
  profile: string
  header: string
  fullSize: string
}

export default function formatCharacterInfo(info: { profile: WowCharacterProfileResponse, media: WowCharacterMediaResponse }): { profile: WowCharacterProfile, media: WowCharacterMedia } {
  const { profile, media } = info

  const { id, name, faction, active_spec, active_title, gender, race, guild, level, character_class, average_item_level } = profile
  const assets = Object.fromEntries(media.assets.map(({ key, value }) => [key, value]))

  return {
    profile: {
      name,
      level,
      id,
      fullName: active_title?.display_string.replace('{name}', name) ?? name,
      class: character_class.name,
      faction: faction.type,
      gender: gender.type,
      guild: guild?.name,
      itemLevel: average_item_level,
      race: race.name,
      spec: active_spec.name
    },
    media: {
      profile: assets.avatar,
      fullSize: assets['main-raw'],
      header: assets.inset
    },
  }
}
