import { blizz } from "~/server/utils/BlizzAPI"
import { RealmQueryResponse } from "~/server/ydb/types/wow/blizzApiResponse"

export default defineEventHandler(async (event) => {
  const response = await blizz.query<RealmQueryResponse>(`/data/wow/realm/index`, {
    params: {
      locale: 'ru_RU',
      namespace: 'dynamic-eu',
    }
  })

  if ('error' in response) throw new Error(response.error)

  return Object.fromEntries(
    response.realms.map(
      realm => [realm.slug, realm.name]
    )
  )
})
