import { z } from "zod"
import { blizz } from "~/server/utils/BlizzAPI"
import { WowCharacterMediaResponse, WowCharacterProfileResponse } from "~/server/ydb/types/wow/blizzApiResponse"

const options = {
  params: {
    namespace: 'profile-eu',
    locale: 'ru_RU'
  }
}

export interface WowCharacterProfile {
  spec: string
  name: string
  fullName: string
  itemLevel: number
  class: string
  faction: string
  gender: string
  guild: string
  level: number
  race: string
}

export interface WowCharacterMedia {
  profile: string
  header: string
  fullSize: string
}

export default defineEventHandler(async (event): Promise<{ profile: WowCharacterProfile, media: WowCharacterMedia }> => {
  const { characterName, realmSlug } = getQueryPayload(event, z.object({
    characterName: z.string().min(3).toLowerCase(),
    realmSlug: z.string().min(3)
  }))

  const [profile, media] = await Promise.all([
    blizz.query<WowCharacterProfileResponse>(`/profile/wow/character/${realmSlug}/${characterName}`, options),
    blizz.query<WowCharacterMediaResponse>(`/profile/wow/character/${realmSlug}/${characterName}/character-media`, options),
  ])

  if ('error' in profile || 'error' in media) throw new Error()

  const { name, faction, active_spec, active_title, gender, race, guild, level, character_class, average_item_level } = profile
  const assets = Object.fromEntries(media.assets.map(({ key, value }) => [key, value]))

  return {
    profile: {
      name,
      class: character_class.name,
      faction: faction.name,
      fullName: active_title.display_string.replace('{name}', name),
      gender: gender.name,
      guild: guild.name,
      itemLevel: average_item_level,
      level: level.name,
      race: race.name,
      spec: active_spec.name
    },
    media: {
      profile: assets.avatar,
      fullSize: assets['main-raw'],
      header: assets.inset
    },
  }
})
