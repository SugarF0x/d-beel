import { HotsHero } from "~/server/ydb/types/hots/heroes"

export const createHotsPostTableQuery = `
CREATE TABLE hots_post
(
    username Utf8 NOT NULL,
    created_at Datetime NOT NULL,
    comment Utf8,
    created_by Utf8,
    hero Utf8,
    rating Uint8,
    PRIMARY KEY (username, created_at)
);
`

export interface HotsPostRow {
  comment: string
  created_at: string
  created_by: string | null
  hero: HotsHero | null
  rating: number
  username: string
}
