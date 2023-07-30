import https from 'https'
import fs from 'fs'
import path from 'path'

const config = JSON.parse(fs.readFileSync('./download-config.json', 'utf-8'))

async function randomDelay() {
  return new Promise(resolve => {
    setTimeout(resolve, Math.floor(Math.random() * 250) + 100)
  })
}

async function main() {
  if (!fs.existsSync('./output')) fs.mkdirSync('./output')

  for (const [index, { packName, src, fileName }] of Object.entries(config)) {
    console.log(`Downloading (${((index/config.length) * 100).toFixed(2)}%): [${Number(index) + 1}/${config.length}] {${packName}} ${fileName}`)

    await new Promise(resolve => {
      const parentDir = path.join('./output', packName)
      if (!fs.existsSync(parentDir)) fs.mkdirSync(path.join('./output', packName))

      const file = fs.createWriteStream(path.join(parentDir, fileName))

      https.get(src, response => {
        response.pipe(file)

        file.on("finish", () => {
          file.close()
          resolve()
        })
      })
    })

    await randomDelay()
  }
}

main()
