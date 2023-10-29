import { blizz } from "~/server/utils/BlizzAPI"
import { WowCharacterMediaResponse, WowCharacterProfileResponse } from "~/server/ydb/types/wow/blizzApiResponse"

const options = {
  params: {
    namespace: 'profile-eu',
    locale: 'ru_RU'
  }
}

export default async function getCharacterInfo(characterName: string, realmSlug: string) {
  const [profile, media] = await Promise.all([
    blizz.query<WowCharacterProfileResponse>(`/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}`, options),
    blizz.query<WowCharacterMediaResponse>(`/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/character-media`, options),
  ])

  if ('error' in profile) throw new Error(profile.error)
  if ('error' in media) throw new Error(media.error)

  return { profile, media }
}
