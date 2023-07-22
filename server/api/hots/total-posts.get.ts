import useYDBSession from "~/server/ydb/utils/useSession"
import { TypedData } from "ydb-sdk/build/esm/src"

export const HOTS_POSTS_PER_PAGE = 12

export default defineEventHandler(async () => {
  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`SELECT COUNT(*) as count FROM hots_post;`)
    return TypedData.createNativeObjects(resultSets[0])[0].count as number
  })
})
