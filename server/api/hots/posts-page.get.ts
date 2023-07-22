import { z } from "zod"
import { getQueryPayload } from "~/server/utils/getPayload"
import useYDBSession from "~/server/ydb/utils/useSession"
import { HotsPostRow } from "~/server/ydb/tables/hots_post"
import { TypedData } from 'ydb-sdk';
import stringToNumber from "~/utils/zod/stringToNumber"
import { HOTS_POSTS_PER_PAGE } from "~/server/api/hots/total-posts.get"

export default defineEventHandler(async (event) => {
  const { page } = await getQueryPayload(event, z.object({ page: z.string().transform(stringToNumber) }))
  const offset = (page - 1) * HOTS_POSTS_PER_PAGE

  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`SELECT * FROM hots_post ORDER BY created_at DESC LIMIT ${offset}, ${HOTS_POSTS_PER_PAGE};`)
    return TypedData.createNativeObjects(resultSets[0]) as unknown as HotsPostRow[]
  })
})
