export interface RealmQueryResponse {
  realms: Array<{
    id: number
    name: string
    slug: string
  }>
}

export interface WowCharacterProfileResponse {
  active_spec: { name: string }
  active_title?: { display_string: string }
  average_item_level: number
  character_class: { name: string }
  faction: { name: string }
  gender: { name: string }
  guild?: { name: string }
  race: { name: string }
  level: number
  name: string
}

export interface WowCharacterMediaResponse {
  assets: Record<'key' | 'value', string>[]
}
