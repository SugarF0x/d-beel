import useYDBSession from "~/server/ydb/utils/useSession"
import { TypedData } from "ydb-sdk"

export const HOTS_POSTS_PER_PAGE = 12

export default defineEventHandler(async () => {
  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`SELECT COUNT(*) as count FROM hots_post;`)
    const totalPosts = TypedData.createNativeObjects(resultSets[0])[0].count as number
    const totalPages = Math.ceil(totalPosts / HOTS_POSTS_PER_PAGE)

    // TODO: return just total posts, reuse exported const on client side too
    return {
      totalPosts,
      totalPages,
    }
  })
})
