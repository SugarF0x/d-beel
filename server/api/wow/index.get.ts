import { z } from "zod"
import { HotsPostRow } from "~/server/ydb/tables/hots_post"
import { TypedData, TypedValues, Types } from "ydb-sdk"
import stringToNumber from "~/utils/zod/stringToNumber"
import { omit } from "lodash-es"
import { HotsPostReactionRow } from "~/server/ydb/tables/hots_post_reaction"
import { BlizzAPI } from "blizzapi"
import { blizz } from "~/server/utils/BlizzAPI"

const options = {
  params: {
    namespace: 'profile-eu',
    locale: 'ru_RU'
  }
}

interface WowCharacterProfileResponse {
  active_spec: { name: string }
  active_title: { display_string: string }
  average_item_level: number
  character_class: { name: string }
  faction: { name: string }
  gender: { name: string }
  guild: { name: string }
  level: { name: string }
  race: { name: string }
  name: string
}

interface WowCharacterMediaResponse {
  assets: Record<'key' | 'value', string>[]
}

export default defineEventHandler(async (event) => {
  const { characterName, realmSlug } = getQueryPayload(event, z.object({
    characterName: z.string().min(3).toLowerCase(),
    realmSlug: z.string().min(3)
  }))

  const [profile, media] = await Promise.all([
    blizz.query<WowCharacterProfileResponse>(`/profile/wow/character/${realmSlug}/${characterName}`, options),
    blizz.query<WowCharacterMediaResponse>(`/profile/wow/character/${realmSlug}/${characterName}/character-media`, options),
  ])

  if ('error' in profile || 'error' in media) throw new Error()

  return {
    media,
    profile
  }
})
