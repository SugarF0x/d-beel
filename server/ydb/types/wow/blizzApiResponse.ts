export interface RealmQueryResponse {
  results: Array<{
    data: {
      realms: Array<{
        name: Record<string, string>
        slug: string
      }>
    }
  }>
}

export interface WowCharacterProfileResponse {
  active_spec: { name: string }
  active_title: { display_string: string }
  average_item_level: number
  character_class: { name: string }
  faction: { name: string }
  gender: { name: string }
  guild: { name: string }
  level: { name: number }
  race: { name: string }
  name: string
}

export interface WowCharacterMediaResponse {
  assets: Record<'key' | 'value', string>[]
}
