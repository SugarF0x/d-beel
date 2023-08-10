import { z } from "zod"
import { TypedValues } from "ydb-sdk"
import { HotsHero } from "~/server/ydb/types/hots/heroes"

export default defineEventHandler(async (event) => {
  const { user: { username: created_by } } = await useServerAuth(event)

  const { hero, username, comment, rating } = await getBodyPayload(event, z.object({
    hero: z.nativeEnum(HotsHero).optional(),
    username: z.string().min(1).max(64),
    comment: z.string().min(1).max(2048),
    rating: z.number().min(0).max(5),
  }))

  await useYDBSession(async (session) => {
    await session.executeQuery(`
      DECLARE $username AS Utf8;
      DECLARE $created_at AS Datetime;
      DECLARE $comment AS Utf8;
      DECLARE $created_by AS Utf8;
      DECLARE $hero AS Utf8?;
      DECLARE $rating AS Uint8;
      
      INSERT INTO hots_post (username, created_at, comment, created_by, hero, rating)
      VALUES ($username, $created_at, $comment, $created_by, $hero, $rating);
    `, filterOptionalQueryParams({
      "$username": TypedValues.utf8(username),
      "$created_at": TypedValues.datetime(new Date()),
      "$comment": TypedValues.utf8(comment),
      "$created_by": TypedValues.utf8(created_by),
      "$hero": hero && TypedValues.optional(TypedValues.utf8(hero)),
      "$rating": TypedValues.uint8(rating),
    }))
  })

  return true
})
