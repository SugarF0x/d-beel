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

export interface HotsPost {
  comment: string
  created_at: Date
  created_by: string | null
  hero: string | null
  rating: number
  username: string
}
