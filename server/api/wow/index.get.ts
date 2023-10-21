import { z } from "zod"
import { blizz } from "~/server/utils/BlizzAPI"
import { WowCharacterMediaResponse, WowCharacterProfileResponse } from "~/server/ydb/types/wow/blizzApiResponse"

const options = {
  params: {
    namespace: 'profile-eu',
    locale: 'ru_RU'
  }
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
