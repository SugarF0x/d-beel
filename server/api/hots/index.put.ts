import { z } from "zod"
import { H3Event } from "h3"
import { TypedValues } from "ydb-sdk"

export enum HotsPutType {
  Reaction = 'reaction'
}

const hotsPutTypeToHandlerMap: Record<HotsPutType, (event: H3Event, created_by: string) => Promise<unknown>> = {
  [HotsPutType.Reaction]: handleReaction
}

export default defineEventHandler(async (event) => {
  const { user: { username: created_by } } = await useServerAuth(event)

  const { type } = await getBodyPayload(event, z.object({
    type: z.nativeEnum(HotsPutType)
  }))

  return hotsPutTypeToHandlerMap[type](event, created_by)
})

async function handleReaction(event: H3Event, created_by: string) {
  const { username, created_at, reaction, shouldAdd } = await getBodyPayload(event, z.object({
    username: z.string(),
    created_at: z.string(),
    reaction: z.string(),
    shouldAdd: z.boolean()
  }))

  await useYDBSession(async (session) => {
    const query = shouldAdd ? `
      INSERT INTO hots_post_reaction (post_username, post_created_at, created_by, shortcut)
      VALUES ($username, $created_at, $created_by, $reaction);
    ` : `
      DELETE FROM hots_post_reaction
      WHERE post_username = $username
        AND post_created_at = $created_at
        AND created_by = $created_by
        AND shortcut = $reaction;
    `

    await session.executeQuery(`
      DECLARE $username AS Utf8;
      DECLARE $created_at AS Datetime;
      DECLARE $reaction AS Utf8;
      DECLARE $created_by AS Utf8;
      
      ${query}
    `, filterOptionalQueryParams({
      "$username": TypedValues.utf8(username),
      "$created_at": TypedValues.datetime(new Date(created_at)),
      "$reaction": TypedValues.utf8(reaction),
      "$created_by": TypedValues.utf8(created_by)
    }))
  })

  return true
}
