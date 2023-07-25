import { z } from "zod"
import { HotsPostRow } from "~/server/ydb/tables/hots_post"
import { TypedData, TypedValues } from "ydb-sdk"
import stringToNumber from "~/utils/zod/stringToNumber"
import { omit } from "lodash-es"

export const HOTS_POSTS_PER_PAGE = 12

export default defineEventHandler(async (event) => {
  const { page, username } = getQueryPayload(event, z.object({
    page: z.string().transform(stringToNumber),
    username: z.string().min(1).optional()
  }))

  const offset = (page - 1) * HOTS_POSTS_PER_PAGE

  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`
      DECLARE $offset AS Uint16;
      DECLARE $limit AS Uint16;
      DECLARE $username AS Utf8?;

      SELECT hots_post.*, Count("hots_post.*") OVER() AS total_posts
      FROM hots_post
      WHERE IF($username is not NULL, hots_post.username = $username, true)
      ORDER BY created_at DESC
      LIMIT $offset, $limit;
    `, filterOptionalQueryParams({
      "$offset": TypedValues.uint16(offset),
      "$limit": TypedValues.uint16(HOTS_POSTS_PER_PAGE),
      "$username": username && TypedValues.optional(TypedValues.utf8(username))
    }))

    const results = TypedData.createNativeObjects(resultSets[0]) as unknown as Array<HotsPostRow & { total_posts: number }>

    const totalPosts = results[0]?.total_posts ?? 0
    const posts = results.map<HotsPostRow>(result => omit(result, 'total_posts'))

    return {
      totalPosts,
      posts,
    }
  })
})
