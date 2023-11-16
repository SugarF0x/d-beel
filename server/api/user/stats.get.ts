import { z } from "zod"
import { TypedValues } from "ydb-sdk"

const { utf8 } = TypedValues

// TODO: add side effects to db interactions that would bump personal stats
//  instead of having to recount everything every time this route is queried

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
    const response = await ydbGet<{ total_posts: number }>(session, `
      DECLARE $author AS Utf8;

      SELECT SUM(total_posts)
      AS total_posts 
      FROM (
        ${tablesToCount.map(getTableCountQuery).join(' UNION ALL ')}
      );
    `, {
      "$author": utf8(username)
    })

    const results = response[0]?.total_posts
    if (results === undefined) throw new Error('Malformed query response: total posts missing')

    return results
  })

  return {
    totalPosts
  }
})
