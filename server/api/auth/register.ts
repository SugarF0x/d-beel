import { TypedData, TypedValues } from "ydb-sdk"
import { z } from 'zod'

const { utf8, datetime, uint16 } = TypedValues

export default defineEventHandler(async (event) => {
  const { username, password, inviteCode } = await getBodyPayload(event, z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    inviteCode: z.string().min(1)
  }))

  if (await validateInvite(inviteCode)) throw createError({ statusCode: 401 })
  if (await doesUserAlreadyExist(username)) throw createError({ statusCode: 409 })

  await createUser(username, password, inviteCode)

  return true
})

async function validateInvite(key: string): Promise<boolean> | never {
  return useYDBSession(async session => {
    const [{ valid }] = await ydbGet<{ valid: boolean }>(session, `
      DECLARE $key AS Utf8;
      
      SELECT CAST(COUNT(*) AS Bool)
      AS valid
      FROM user_invite 
      WHERE key = $key AND claimed_by IS NULL;
    `, {
      $key: utf8(key)
    })

    return valid
  })
}

async function doesUserAlreadyExist(username: string): Promise<boolean> {
  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`
      DECLARE $username AS Utf8;
      
      SELECT COUNT(username) as count FROM user WHERE username = $username LIMIT 1;
    `, {
      "$username": utf8(username)
    })

    return Boolean(TypedData.createNativeObjects(resultSets[0])[0].count)
  })
}

async function createUser(username: string, password: string, key: string) {
  const { hash, salt, iterations } = await generateHashPassword(password)

  await useYDBSession(async (session) => {
    return Promise.all([
      ydbPost(session, `
        DECLARE $key AS Utf8;
        DECLARE $username AS Utf8;
        
        UPDATE user_invite
        SET claimed_by = $username
        WHERE key = $key;
      `, {
        $key: utf8(key),
        $username: utf8(username)
      }),
      ydbPost(session, `
        DECLARE $username AS Utf8;
        DECLARE $created_at AS Datetime;
        DECLARE $hash AS Utf8;
        DECLARE $salt AS Utf8;
        DECLARE $iterations AS Uint16;
  
        INSERT INTO user (username, created_at, hash, salt, iterations) 
        VALUES ($username, $created_at, $hash, $salt, $iterations);
      `, {
        "$username": utf8(username),
        "$created_at": datetime(new Date()),
        "$hash": utf8(hash),
        "$salt": utf8(salt),
        "$iterations": uint16(iterations),
      })
    ])
  })
}
