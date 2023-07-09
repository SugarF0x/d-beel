// TODO: after some digging figured out isBase64Encoded will be resolved on package level in next nitro release
//  this will not be neede dthen (if it even works in the firs place (spoiler: it does not))

export default defineNitroPlugin(nitro => {
  nitro.h3App.stack.unshift({
    route: "/api/",
    handler: eventHandler(async (event) => {
      if (event.node.req.method !== 'POST') return

      const isEncoded = (event.node.req as any).isBase64Encoded
      if (!isEncoded) return

      const rawBody = await readRawBody(event, 'utf8')
      if (!rawBody) return

      (event.node.req as any).body = atob(rawBody)
    })
  })
})
