import { z } from "zod"
import { HotsPostRow } from "~/server/ydb/tables/hots_post"
import { TypedData, TypedValues, Types } from "ydb-sdk"
import stringToNumber from "~/utils/zod/stringToNumber"
import { omit } from "lodash-es"
import { HotsPostReactionRow } from "~/server/ydb/tables/hots_post_reaction"

const { uint16, optional, utf8, list } = TypedValues

export interface HotsPost extends HotsPostRow {
  reactions?: Record<string, string[]>
}

export interface HotsPostGetResponse {
  totalPosts: number
  posts: HotsPost[]
}

export default defineEventHandler(async (event) => {
  const { page, postsPerPage, username } = getQueryPayload(event, z.object({
    page: z.string().transform(stringToNumber),
    postsPerPage: z.string().transform(stringToNumber),
    username: z.string().min(1).optional(),
  }))

  const offset = (page - 1) * postsPerPage

  return await useYDBSession(async (session): Promise<HotsPostGetResponse> => {
    const { resultSets: postsResultSets } = await session.executeQuery(`
      DECLARE $offset AS Uint16;
      DECLARE $limit AS Uint16;
      DECLARE $username AS Utf8?;

      SELECT hots_post.*, Count("hots_post.*") OVER() AS total_posts
      FROM hots_post
      WHERE IF($username is not NULL, Unicode::ToLower(hots_post.username) = Unicode::ToLower($username), true)
      ORDER BY created_at DESC
      LIMIT $offset, $limit;
    `, filterOptionalQueryParams({
      "$offset": uint16(offset),
      "$limit": uint16(postsPerPage),
      "$username": username && optional(utf8(username))
    }))

    const results = TypedData.createNativeObjects(postsResultSets[0]) as unknown as Array<HotsPostRow & { total_posts: number }>

    const totalPosts = results[0]?.total_posts ?? 0
    const posts = results.map<HotsPostRow>(result => omit(result, 'total_posts'))

    const { resultSets: reactionsResultSets } = await session.executeQuery(`
      DECLARE $keys AS List<Tuple<Utf8, Datetime>>;

      SELECT * FROM hots_post_reaction
      WHERE AsTuple(post_username, post_created_at) IN $keys;
    `, filterOptionalQueryParams({
      "$keys": list(
        Types.tuple(Types.UTF8, Types.DATETIME),
        posts.map(post => [post.username, new Date(post.created_at)])
      )
    }))

    const reactions = TypedData.createNativeObjects(reactionsResultSets[0]) as unknown as Array<HotsPostReactionRow>

    const keyToPostMap: Record<string, HotsPost> = Object.fromEntries(posts.map(post => [`${post.username}-${new Date(post.created_at).valueOf()}`, post]))

    for (const reaction of reactions) {
      const key = `${reaction.post_username}-${reaction.post_created_at.valueOf()}`
      const post = keyToPostMap[key]
      post.reactions ??= {}
      post.reactions[reaction.shortcut] ??= []
      post.reactions[reaction.shortcut].push(reaction.created_by)
    }

    return {
      totalPosts,
      posts,
    }
  })
})
