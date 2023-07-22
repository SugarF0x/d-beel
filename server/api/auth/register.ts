import useYDBSession from "~/server/ydb/utils/useSession"
import { TypedData } from "ydb-sdk"
import { z } from 'zod'
import { generateHashPassword } from "~/server/utils/passwordManagement"
import getPayload from "~/server/utils/getPayload"

export default defineEventHandler(async (event) => {
  const { username, password } = await getPayload(event, z.object({ username: z.string(), password: z.string() }))

  if (await doesUserAlreadyExist(username)) throw createError({ statusCode: 409 })

  await createUser(username, password)

  return true
})

async function doesUserAlreadyExist(username: string): Promise<boolean> {
  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`SELECT COUNT(username) as count FROM user WHERE username = "${username}" LIMIT 1;`)
    return Boolean(TypedData.createNativeObjects(resultSets[0])[0].count)
  })
}

async function createUser(username: string, password: string) {
  const { hash, salt, iterations } = await generateHashPassword(password)

  await useYDBSession(async (session) => {
    const createdAt = new Date().toISOString().split('.')[0] + 'Z'
    await session.executeQuery(`
      INSERT INTO user (username, created_at, hash, salt, iterations) 
      VALUES ("${username}", Datetime("${createdAt}"), "${hash}", "${salt}", ${iterations});
    `)
  })
}
