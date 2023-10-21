import { blizz } from "~/server/utils/BlizzAPI"

interface RealmQueryResponse {
  results: Array<{
    data: {
      realms: Array<{
        name: Record<string, string>
        slug: string
      }>
    }
  }>
}

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
