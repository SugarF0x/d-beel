import { TypedValues } from "ydb-sdk"
import { customAlphabet } from "nanoid"
import { chunk } from "lodash-es"

const { utf8, datetime } = TypedValues

const uuid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12)
const generateKey = () => chunk(uuid(), 4).map(e => e.join('')).join('-')

export default defineEventHandler(async (event) => {
  const { user: { username: created_by } } = await useServerAuth(event)

  return await useYDBSession(async session => {
    const key = generateKey()

    await ydbPost(session, `
      DECLARE $key AS Utf8;
      DECLARE $created_by AS Utf8;
      DECLARE $created_at AS Datetime;
      
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
