import useYDBSession from "~/server/ydb/utils/useSession"
import { TypedData } from "ydb-sdk"

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string, password: string }>(event)

  if (await doesUserAlreadyExist(body.username)) throw createError({ statusCode: 409 })

  throw createError({ statusCode: 500 })
})

async function doesUserAlreadyExist(username: string): Promise<boolean> {
  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`SELECT COUNT(username) as count FROM user WHERE username = "${username}";`)
    return Boolean(TypedData.createNativeObjects(resultSets[0])[0].count)
  })
}
