import { defineNuxtModule } from "@nuxt/kit"
import { readFileSync, rmSync, writeFileSync, renameSync } from "fs"

export default defineNuxtModule({
  hooks: {
    'close': (nuxt) => {
      if (process.env.NODE_ENV !== 'production') return

      rmSync('./.output/server/node_modules', { recursive: true, force: true })

      renameSync('./.output/server/index.mjs', './.output/server/index.js')

      const serverPackage = JSON.parse(readFileSync('./.output/server/package.json', 'utf-8'))

      serverPackage.type = "module"
      serverPackage.dependencies = serverPackage.bundledDependencies
      delete serverPackage.bundledDependencies

      writeFileSync('./.output/server/package.json', JSON.stringify(serverPackage, null, 2))
    }
  }
})
