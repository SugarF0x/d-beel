
export const createHotsPostReactionTableQuery = `
CREATE TABLE hots_post_reaction
(
    post_created_by Utf8 NOT NULL,
    post_created_at Datetime NOT NULL,
    created_by Utf8 NOT NULL,
    shortcut Utf8 NOT NULL,
    PRIMARY KEY (post_created_by, post_created_at, created_by, shortcut)
);
`

export interface HotsPostReactionRow {
  post_created_by: string
  post_created_at: string
  created_by: string
  shortcut: string
}
