import useAuth from "~/server/utils/useAuth"
import useYDBSession from "~/server/ydb/utils/useSession"
import { TypedData } from 'ydb-sdk'

export default defineEventHandler(async (event) => {
  await useAuth(event)

  return await useYDBSession(async (session) => {
    const { resultSets } = await session.executeQuery(`SELECT * FROM hots_post LIMIT 10;`)
    return TypedData.createNativeObjects(resultSets[0]);
  })
})
