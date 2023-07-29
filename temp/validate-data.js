import fs from 'fs'

// TODO: remove all dots from emoji names & files to match their banner and portrait counterparts

const data = JSON.parse(fs.readFileSync('./hots-emoji-dataset.json'))

const packNames = new Set()
const imageSources = new Set()
const emojiNames = new Set()
const shortcutSet = new Set()

for (const { packName, entries } of data) {
  if (packNames.has(packName)) continue
  packNames.add(packName)

  for (const { image, name, shortcuts } of entries) {
    if (imageSources.has(image)) throw new Error(`Duplicate image source: ${image}`)
    imageSources.add(image)
    emojiNames.add(name)

    for (const shortcut of shortcuts) shortcutSet.add(shortcut)
  }
}

fs.writeFileSync('./hots-emoji-all-pack-names.json', JSON.stringify(Array.from(packNames), null, 2))
fs.writeFileSync('./hots-emoji-all-image-sources.json', JSON.stringify(Array.from(imageSources), null, 2))
fs.writeFileSync('./hots-emoji-all-emoji-names.json', JSON.stringify(Array.from(emojiNames), null, 2))
fs.writeFileSync('./hots-emoji-all-shortcuts.json', JSON.stringify(Array.from(shortcutSet), null, 2))
