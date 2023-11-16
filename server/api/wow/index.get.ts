import { z } from "zod"
import { TypedData, TypedValues } from "ydb-sdk"
import stringToNumber from "~/utils/zod/stringToNumber"
import { omit } from "lodash-es"
import { WowPostRow } from "~/server/ydb/tables/wow_post"
import { WowCharacterMedia, WowCharacterProfile } from "~/server/utils/wow/formatCharacterInfo"

const { uint16, optional, utf8 } = TypedValues

export type WowPost = Omit<WowPostRow, 'profile' | 'media'> & {
  profile: WowCharacterProfile
  media: WowCharacterMedia
}

export interface WowPostGetResponse {
  totalPosts: number
  posts: WowPost[]
}

export default defineEventHandler(async (event) => {
  const { page, postsPerPage, name } = getQueryPayload(event, z.object({
    page: z.string().transform(stringToNumber),
    postsPerPage: z.string().transform(stringToNumber),
    name: z.string().min(3).max(64).toLowerCase().optional()
  }))

  const offset = (page - 1) * postsPerPage

  return await useYDBSession(async (session): Promise<WowPostGetResponse> => {
    const response = await ydbGet<WowPostRow & { total_posts: number }>(session, `
      DECLARE $offset AS Uint16;
      DECLARE $limit AS Uint16;
      DECLARE $name AS Utf8?;

      SELECT wow_post.*, Count("wow_post.*") OVER() AS total_posts
      FROM wow_post
      WHERE IF($name is not NULL, Unicode::ToLower(wow_post.name) = Unicode::ToLower($name), true)
      ORDER BY created_at DESC
      LIMIT $offset, $limit;
    `, {
      "$offset": uint16(offset),
      "$limit": uint16(postsPerPage),
      "$name": name && optional(utf8(name))
    })

    const totalPosts = response[0]?.total_posts ?? 0
    const posts = response.map<WowPost>(post => ({
      ...omit(post, 'total_posts', 'profile', 'media'),
      ...formatCharacterInfo({ profile: JSON.parse(post.profile), media: JSON.parse(post.media) }),
    }))

    return {
      totalPosts,
      posts,
    }
  })
})
