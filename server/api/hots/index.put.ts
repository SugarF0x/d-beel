import { z } from "zod"
import { H3Event } from "h3"

export enum HotsPutType {
  Reaction = 'reaction'
}

const hotsPutTypeToHandlerMap: Record<HotsPutType, (event: H3Event, created_by: string) => Promise<unknown>> = {
  [HotsPutType.Reaction]: handleReaction
}

export default defineEventHandler(async (event) => {
  const { user: { username: created_by } } = await useServerAuth(event)

  const { type } = getQueryPayload(event, z.object({
    type: z.nativeEnum(HotsPutType)
  }))

  return hotsPutTypeToHandlerMap[type](event, created_by)
})

async function handleReaction(event: H3Event, created_by: string) {
  const { created_at, reaction } = await getQueryPayload(event, z.object({
    created_at: z.string(),
    reaction: z.string()
  }))

  return true
}
