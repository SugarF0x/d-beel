import { WowClass } from "~/server/ydb/types/wow/class"

export interface RealmQueryResponse {
  realms: Array<{
    id: number
    name: string
    slug: string
  }>
}

export enum WowProfileGender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
}

export enum WowProfileFaction {
  ALLIANCE = 'ALLIANCE',
  HORDE = 'HORDE',
}

export interface WowCharacterProfileResponse {
  active_spec: { name: string }
  active_title?: { display_string: string }
  average_item_level: number
  character_class: { name: WowClass }
  faction: { type: WowProfileFaction, name: string }
  gender: { type: WowProfileGender, name: string }
  guild?: { name: string }
  race: { name: string }
  level: number
  id: number
  name: string
}

export interface WowCharacterMediaResponse {
  assets: Record<'key' | 'value', string>[]
}
