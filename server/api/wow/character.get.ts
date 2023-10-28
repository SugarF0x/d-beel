import { z } from "zod"
import getCharacterInfo from "~/server/utils/wow/getCharacterInfo"

export default defineEventHandler(async (event) => {
  const { characterName, realmSlug } = getQueryPayload(event, z.object({
    characterName: z.string().min(3).toLowerCase(),
    realmSlug: z.string().min(3)
  }))

  return getCharacterInfo(characterName, realmSlug)
})
