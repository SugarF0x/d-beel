import { WowCharacterMediaResponse, WowCharacterProfileResponse } from "~/server/ydb/types/wow/blizzApiResponse"
import { WowEncounter } from "~/server/ydb/types/wow/encounter"

export enum WowRating {
  GOOD = 'GOOD',
  BAD = 'BAD',
  NEUTRAL = 'NEUTRAL',
}

export const createWowPostTableQuery = `
CREATE TABLE wow_post
(
    name Utf8 NOT NULL,
    realm Utf8 NOT NULL,
    created_at Datetime NOT NULL,
    
    id Uint32,
    profile Json,
    media Json,
    
    created_by Utf8,
    rating Utf8,
    comment Utf8,
    
    encounter Utf8,
    encounter_details Utf8,
    
    PRIMARY KEY (username, realm, created_at)
);
`

export interface WowPostRow {
  name: string
  realm: string
  created_at: string
  id: number
  profile: string // as WowCharacterProfileResponse
  media: string // as WowCharacterMediaResponse
  created_by: string
  rating: WowRating
  comment: string
  encounter: WowEncounter
  encounter_details?: string
}
