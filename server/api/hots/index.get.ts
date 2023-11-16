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
    const hotsPostsResponse = await ydbGet<HotsPostRow & { total_posts: number }>(session, `
      DECLARE $offset AS Uint16;
      DECLARE $limit AS Uint16;
      DECLARE $username AS Utf8?;

      SELECT hots_post.*, Count("hots_post.*") OVER() AS total_posts
      FROM hots_post
      WHERE IF($username is not NULL, Unicode::ToLower(hots_post.username) = Unicode::ToLower($username), true)
      ORDER BY created_at DESC
      LIMIT $offset, $limit;
    `, {
      "$offset": uint16(offset),
      "$limit": uint16(postsPerPage),
      "$username": username && optional(utf8(username))
    })

    const totalPosts = hotsPostsResponse[0]?.total_posts ?? 0
    const posts = hotsPostsResponse.map<HotsPostRow>(result => omit(result, 'total_posts'))

    const hotsReactionsResponse = await ydbGet<HotsPostReactionRow>(session, `
      DECLARE $keys AS List<Tuple<Utf8, Datetime>>;

      SELECT * FROM hots_post_reaction
      WHERE AsTuple(post_username, post_created_at) IN $keys;
    `, {
      "$keys": list(
        Types.tuple(Types.UTF8, Types.DATETIME),
        posts.map(post => [post.username, new Date(post.created_at)])
      )
    })

    const keyToPostMap: Record<string, HotsPost> = Object.fromEntries(posts.map(post => [`${post.username}-${new Date(post.created_at).valueOf()}`, post]))

    for (const reaction of hotsReactionsResponse) {
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
