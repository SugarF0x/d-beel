// Scrapper from: https://heroesofthestorm.fandom.com/wiki/Emoji

Array.from(document.querySelectorAll('.mw-collapsible-toggle-collapsed')).forEach(e => e.click())

let data = (() => {
  const tables = Array.from(document.querySelectorAll('.mw-parser-output table'))
  tables.pop()
  tables.pop()
  return tables
})().flatMap(table => {
  const rows = Array.from(table.querySelectorAll('tr'))

  const namesRow = rows.shift()
  const names = Array.from(namesRow.querySelectorAll('th')).map(e => e.innerText.replace('Expand', '').replace('Collapse', '').replace('\n', '').toLowerCase().trim().replaceAll(' ', '-'))

  rows.shift()
  return names.map((packName, packIndex) => {
    const dataSets = rows.map(row => Array.from(row.querySelectorAll('td')).slice(packIndex * 3, (packIndex + 1) * 3))
    const entries = dataSets.map(cells => {
      if (cells.length < 3) return null
      const [imageCell, nameCell, shortcutsCell] = cells

      const image = imageCell.querySelector('img').src
      const name = nameCell.innerText.replaceAll('\n', '')
      const shortcuts = shortcutsCell.innerText.split('\n')
      const fileName = sanitizeName(name) + (image.includes('png') ? '.png' : '.gif')

      return {
        image,
        name,
        fileName,
        shortcuts,
      }
    }).filter(Boolean)

    return {
      packName: sanitizeName(packName),
      entries
    }
  })
})

function sanitizeName(value) {
  return value
    .toLowerCase()
    .replaceAll(/['".!?]/g, '')
    .replaceAll(/ú/g, 'u')
    .replaceAll(' ', '-')
    .replaceAll(',-', '-')
    .replaceAll(',', '-')
}

let downloaderElement = document.createElement('a')
downloaderElement.href = 'data:attachment/text,' + encodeURI(JSON.stringify(data, null, 2));
downloaderElement.target = '_blank';
downloaderElement.download = 'hots-emoji-dataset.json';
downloaderElement.click();
