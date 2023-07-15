import { defineNuxtModule } from "@nuxt/kit"
import { readFileSync, rmSync, writeFileSync, existsSync } from "fs"

export default defineNuxtModule({
  hooks: {
    'close': (nuxt) => {
      if (process.env.NODE_ENV !== 'production') return
      if (!existsSync('./.output/server')) return

      // TODO: figure out a way to post process all the imports to point directly to node_modules

      rmSync('./.output/server/node_modules', { recursive: true, force: true })

      const serverPackage = JSON.parse(readFileSync('./.output/server/package.json', 'utf-8'))

      serverPackage.type = "module"
      serverPackage.dependencies = serverPackage.bundledDependencies
      delete serverPackage.bundledDependencies

      writeFileSync('./.output/server/package.json', JSON.stringify(serverPackage, null, 2))

      // TODO: figure out a way of better managing this template

      writeFileSync('./.output/server/index.js', wrapperJs)
    }
  }
})

const wrapperJs: string =
`import { handler } from "./index.mjs"
        
async function wrapper(event, context) {
  if (event.body && event.isBase64Encoded) event.body = atob(event.body)
  
  const response = await handler(event, context)
  
  if (response.headers['set-cookie']) {
    response.multiValueHeaders ??= {}
    response.multiValueHeaders['set-cookie'] = response.headers['set-cookie'].split(/(.*?),(.*?)($|,(?! ))/).filter(Boolean)
    delete response.headers['set-cookie']
  }
  
  return response
}

export { wrapper as handler }
`
