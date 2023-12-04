import { TypedValues } from "ydb-sdk"
import { randomUUID } from "crypto"

const { utf8, datetime } = TypedValues

export default defineEventHandler(async (event) => {
  const { user: { username: created_by } } = await useServerAuth(event)

  return await useYDBSession(async session => {
    const key = randomUUID()

    await ydbPost(session, `
      DECLARE $key AS Utf8;
      DECLARE $created_by AS Utf8;
      DECLARE $created_at AS Utf8;
      
      INSERT INTO user_invite (key, created_by, created_at)
      VALUES ($key, $created_by, $created_at);
    `, {
      $key: utf8(key),
      $created_by: utf8(created_by),
      $created_at: datetime(new Date())
    })

    return key
  })
})
