import { z } from "zod"
import { TypedData, TypedValues } from "ydb-sdk"

const { utf8 } = TypedValues

// TODO: add side effects to db interactions that would bump personal stats
//  instead of having to recount everything every time this route is queried

// TODO: create typed query execution util to streamline createNativeObjects & type cast

function getTableCountQuery(table: string): string {
  return `SELECT COUNT(*) AS total_posts FROM ${table} WHERE created_by = $author`
}

const tablesToCount = [
  'hots_post',
  'wow_post'
]

export default defineEventHandler(async (event) => {
  const { username } = getQueryPayload(event, z.object({
    username: z.string().min(3).max(32)
  }))

  const totalPosts = await useYDBSession(async session => {
    const { resultSets: postsResultSets } = await session.executeQuery(`
      DECLARE $author AS Utf8;

      SELECT SUM(total_posts)
      AS total_posts 
      FROM (
        ${tablesToCount.map(getTableCountQuery).join(' UNION ALL ')}
      );
    `, filterOptionalQueryParams({
      "$author": utf8(username)
    }))

    const results = TypedData.createNativeObjects(postsResultSets[0]) as unknown as Array<{ total_posts: number }>
    return results[0].total_posts
  })

  return {
    totalPosts
  }
})
