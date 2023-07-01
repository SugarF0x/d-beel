import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) throw createError({ statusCode: 401, message: "Unauthorized" })

  console.log(session)
  return { response: { data: 'pog' } }
})
