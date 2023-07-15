import { Driver, getCredentialsFromEnv, Session } from "ydb-sdk"

export default async function useYDBSession(callback: (session: Session) => Promise<void>) {
  const driver = new Driver({
    endpoint: process.env.YDB_ENDPOINT,
    database: process.env.YDB_DATABASE,
    authService: getCredentialsFromEnv()
  })

  if (!await driver.ready(10000)) throw new Error('Establishing YDB connection timed out')

  await driver.tableClient.withSession(callback)

  await driver.destroy()
}
