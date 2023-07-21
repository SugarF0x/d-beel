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
  username: string
  created_at: Date
  comment: string
  created_by: string
  hero: string
  rating: number
}
