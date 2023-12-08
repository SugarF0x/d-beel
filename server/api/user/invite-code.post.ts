import { Session, TypedValues } from "ydb-sdk"
import { customAlphabet } from "nanoid"
import { chunk } from "lodash-es"

const { utf8, datetime } = TypedValues

const uuid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12)
const generateKey = () => chunk(uuid(), 4).map(e => e.join('')).join('-')

export default defineEventHandler(async (event) => {
  const { user: { username } } = await useServerAuth(event)

  return await useYDBSession(async session => {
    const isValid = await getCanAccountCreateNewKeys(session, username)
    if (!isValid) throw createError({ statusCode: 403, message: "Создавать ключи могут только пользователи старше одного месяца" })

    const key = generateKey()

    await ydbPost(session, `
      DECLARE $key AS Utf8;
      DECLARE $created_by AS Utf8;
      DECLARE $created_at AS Datetime;
      
      INSERT INTO user_invite (key, created_by, created_at)
      VALUES ($key, $created_by, $created_at);
    `, {
      $key: utf8(key),
      $created_by: utf8(username),
      $created_at: datetime(new Date())
    })

    return key
  })
})

async function getCanAccountCreateNewKeys(session: Session, username: string) {
  const MINIMUM_MONTHS_AGE = 1

  const [{ valid }] = await ydbGet<{ valid: boolean }>(session, `
    DECLARE $username AS Utf8;
    
    SELECT CAST(COUNT(*) AS Bool)
    FROM user
    AS valid
    WHERE username = $username AND DateTime::MakeDate(DateTime::ShiftMonths(DateTime::Split(created_at), ${MINIMUM_MONTHS_AGE})) < CurrentUtcDatetime();
  `, {
    $username: utf8(username)
  })

  return valid
}
