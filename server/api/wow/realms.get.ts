import { blizz } from "~/server/utils/BlizzAPI"
import { RealmQueryResponse } from "~/server/ydb/types/wow/blizzApiResponse"

export default defineEventHandler(async (event) => {
  const realm = await blizz.query<RealmQueryResponse>(`/data/wow/search/connected-realm`, {
    params: {
      locale: 'en_EN',
      namespace: 'dynamic-eu',
    }
  })

  if ('error' in realm) throw new Error(realm.error)

  return Object.fromEntries(realm.results.flatMap(result => result.data.realms.map(realm => [realm.name.ru_RU, realm.slug])))
})
