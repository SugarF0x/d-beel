import { z } from "zod"
import { TypedData, TypedValues } from "ydb-sdk"
import { HotsPostRow } from "~/server/ydb/tables/hots_post"

export default defineEventHandler(async (event) => {
  const { username } = await getQueryPayload(event, z.object({ username: z.string().min(1) }))

  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`
      DECLARE $username AS Utf8;

      SELECT * FROM hots_post
      WHERE Unicode::ToLower(username) = Unicode::ToLower($username)
      ORDER BY created_at DESC;
    `, {
      "$username": TypedValues.utf8(username)
    })

    return TypedData.createNativeObjects(resultSets[0]) as unknown as HotsPostRow[]
  })
})