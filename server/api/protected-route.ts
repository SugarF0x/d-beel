import useAuth from "~/server/utils/useAuth"

export default defineEventHandler(async (event) => {
  const session = await useAuth(event)

  console.log(session)
  return { response: { data: 'pog' } }
})
