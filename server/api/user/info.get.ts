import { z } from "zod"
import { TypedValues } from "ydb-sdk"
import { UserTableRow } from "~/server/ydb/tables/user"

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

  return await useYDBSession(async session => {
    const [user] = await ydbGet<{ joinedAt: Date }>(session, `
      DECLARE $username AS Utf8;
      
      SELECT created_at AS joinedAt
      FROM user
      WHERE username = $username; 
    `, {
      $username: utf8(username)
    })

    if (!user) return createError({ status: 404 })

    const [{ totalPosts }] = await ydbGet<{ totalPosts: number }>(session, `
      DECLARE $author AS Utf8;

      SELECT SUM(total_posts)
      AS totalPosts 
      FROM (
        ${tablesToCount.map(getTableCountQuery).join(' UNION ALL ')}
      );
    `, {
      $author: utf8(username)
    })

    return {
      totalPosts,
      joinedAt: user.joinedAt
    }
  })
})
