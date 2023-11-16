export const createUserInviteTableQuery = `
CREATE TABLE user_invite
(
    key Utf8 NOT NULL,
    created_by Utf8,
    created_at Datetime,
    claimed_by Utf8,
    PRIMARY KEY (key)
);
`

export interface UserInviteTableRow {
  key: string
  created_by: string
  created_at: Date
  claimed_by?: string
}
