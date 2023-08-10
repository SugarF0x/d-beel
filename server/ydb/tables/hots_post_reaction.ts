
export const createHotsPostReactionTableQuery = `
CREATE TABLE hots_post_reaction
(
    post_username Utf8 NOT NULL,
    post_created_at Datetime NOT NULL,
    created_by Utf8 NOT NULL,
    shortcut Utf8 NOT NULL,
    PRIMARY KEY (post_username, post_created_at, created_by, shortcut)
);
`

export interface HotsPostReactionRow {
  post_username: string
  post_created_at: string
  created_by: string
  shortcut: string
}
