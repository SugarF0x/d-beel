import { z } from "zod"
import getCharacterInfo from "~/server/utils/wow/getCharacterInfo"
import formatCharacterInfo from "~/server/utils/wow/formatCharacterInfo"

export default defineEventHandler(async (event) => {
  const { characterName, realmSlug } = getQueryPayload(event, z.object({
    characterName: z.string().min(3),
    realmSlug: z.string().min(3)
  }))

  const characterInfo = await getCharacterInfo(characterName, realmSlug)
  return formatCharacterInfo(characterInfo)
})
