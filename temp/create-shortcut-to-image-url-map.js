import fs from 'fs'

const dataset = JSON.parse(fs.readFileSync('./hots-emoji-dataset.json', 'utf-8'))

const map = new Map()

for (const { packName, entries } of dataset) {
  for (const { shortcuts, fileName } of entries) {
    for (const shortcut of shortcuts) {
      if ([":sad:", ":silly:", ":cool:"].includes(shortcut)) continue
      if (map.has(shortcut)) throw new Error(`Duplicate shortcut found: ${shortcut}`)
      map.set(shortcut, `/img/hots/emoji/${packName}/${fileName}`)
    }
  }
}

const output = []
for (const [key, value] of map) {
  output.push(`"${key}": "${value}",`)
}

fs.writeFileSync('./emojiShortcutToImageUrlMap.ts', `export const emojiShortcutToImageUrlMap: Record<string, string> = {
  ${output.join('\n  ')}
}`)
