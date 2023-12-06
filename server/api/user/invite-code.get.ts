import { TypedValues } from "ydb-sdk"

const { utf8 } = TypedValues

export default defineEventHandler(async (event) => {
  const { user: { username: created_by } } = await useServerAuth(event)

  return await useYDBSession(async session => (
    await ydbGet<{ key: string, claimed_by?: string }>(session, `
      DECLARE $created_by AS Utf8;

      SELECT key, claimed_by
      FROM user_invite
      WHERE created_by = $created_by;
    `, {
      $created_by: utf8(created_by)
    })
  ))
})
