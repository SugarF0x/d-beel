import { config } from 'dotenv'
import { getCredentialsFromEnv, Driver, TypedData } from 'ydb-sdk';

config({ path: '../.env.ydb' })

async function run() {
  const driver = new Driver({
    endpoint: process.env.YDB_ENDPOINT,
    database: process.env.YDB_DATABASE,
    authService: getCredentialsFromEnv()
  });

  const timeout = 10000;
  if (!await driver.ready(timeout)) {
    console.log('Timeout, exiting')
    process.exit(1);
  }

  await driver.tableClient.withSession(async (session) => {
    const { resultSets } = await session.executeQuery(`SELECT * FROM hots_post LIMIT 1;`)
    const result = TypedData.createNativeObjects(resultSets[0]);
    console.log(result)
  })

  await driver.destroy();
}

void run()
