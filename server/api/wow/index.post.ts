import { z } from "zod"
import { WowEncounter, WowRating } from "~/server/ydb/tables/wow_post"
import { TypedValues } from "ydb-sdk"
import getCharacterInfo from "~/server/utils/wow/getCharacterInfo"

const { utf8, datetime, uint32, json, optional } = TypedValues

export default defineEventHandler(async (event) => {
  const { user: { username: created_by } } = await useServerAuth(event)

  const { name, realm, comment, rating, encounter, encounterDetails } = await getBodyPayload(event, z.object({
    name: z.string().min(3).max(64),
    realm: z.string().min(3).max(32),
    comment: z.string().min(3).max(2048),
    rating: z.nativeEnum(WowRating),
    encounter: z.nativeEnum(WowEncounter),
    encounterDetails: z.string().optional()
  }))

  const { profile, media } = await getCharacterInfo(name, realm)

  await useYDBSession(async (session) => {
    await session.executeQuery(`
      DECLARE $name AS Utf8;
      DECLARE $realm AS Utf8;
      DECLARE $created_at AS Datetime;
      DECLARE $id AS Uint32;
      DECLARE $profile AS Json;
      DECLARE $media AS Json;
      DECLARE $created_by AS Utf8;
      DECLARE $rating AS Utf8;
      DECLARE $comment AS Utf8;
      DECLARE $encounter AS Utf8;
      DECLARE $encounter_details AS Utf8?;
      
      INSERT INTO wow_post (name, realm, created_at, id, profile, media, created_by, rating, comment, encounter, encounter_details)
      VALUES ($name, $realm, $created_at, $id, $profile, $media, $created_by, $rating, $comment, $encounter, $encounter_details);
    `, filterOptionalQueryParams({
      "$name": utf8(name),
      "$realm": utf8(realm),
      "$created_at": datetime(new Date()),
      "$id": uint32(profile.id),
      "$profile": json(JSON.stringify(profile)),
      "$media": json(JSON.stringify(media)),
      "$created_by": utf8(created_by),
      "$rating": utf8(rating),
      "$comment": utf8(comment),
      "$encounter": utf8(encounter),
      "$encounter_details": encounterDetails && optional(utf8(encounterDetails)),
    }))
  })

  return true
})
