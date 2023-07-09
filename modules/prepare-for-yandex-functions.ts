import { defineNuxtModule } from "@nuxt/kit"
import { readFileSync, rmSync, writeFileSync, renameSync } from "fs"

export default defineNuxtModule({
  hooks: {
    'close': (nuxt) => {
      if (process.env.NODE_ENV !== 'production') return

      // TODO: figure out a way to post process all the imports to point directly to node_modules

      rmSync('./.output/server/node_modules', { recursive: true, force: true })

      const serverPackage = JSON.parse(readFileSync('./.output/server/package.json', 'utf-8'))

      serverPackage.type = "module"
      serverPackage.dependencies = serverPackage.bundledDependencies
      delete serverPackage.bundledDependencies

      writeFileSync('./.output/server/package.json', JSON.stringify(serverPackage, null, 2))

      // TODO: figure out a way of better managing this template

      writeFileSync('./.output/server/index.js', `
        import { handler } from "./index.mjs"
        
        async function wrapper(event, context) {
          if (event.body && event.isBase64Encoded) event.body = atob(event.body)
          
          const response = await handler(event, context)
          
          if (response.headers['set-cookie']) {
            const sanitizedCookies = response.headers['set-cookie'].replace(/Expires=(.*?);/g, value => \`Max-Age=\${Math.floor((new Date(value).valueOf() - Date.now()) / 1000)};\`)
            response.multiValueHeaders ??= {}
            response.multiValueHeaders['set-cookie'] = sanitizedCookies.split(/,+(?=(?:(?:[^"]*"){2})*[^"]*$)/g).map(e => e.replaceAll('"', ""))
            delete response.headers['set-cookie']
          }
          
          return response
        }
        
        export { wrapper as handler }
      `)
    }
  }
})
