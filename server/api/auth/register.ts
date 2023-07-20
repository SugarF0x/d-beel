import useYDBSession from "~/server/ydb/utils/useSession"
import { TypedData } from "ydb-sdk"
import { H3Event } from "h3"
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { username, password } = await getPayload(event)

  if (await doesUserAlreadyExist(username)) throw createError({ statusCode: 409 })

  throw createError({ statusCode: 500 })
})

async function getPayload(event: H3Event) {
  const PayloadSchema = z.object({
    username: z.string(),
    password: z.string()
  })

  const body = await readBody(event)
  if (!PayloadSchema.safeParse(body).success) throw createError({ statusCode: 400 })
  return body as z.infer<typeof PayloadSchema>
}

async function doesUserAlreadyExist(username: string): Promise<boolean> {
  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`SELECT COUNT(username) as count FROM user WHERE username = "${username}";`)
    return Boolean(TypedData.createNativeObjects(resultSets[0])[0].count)
  })
}
