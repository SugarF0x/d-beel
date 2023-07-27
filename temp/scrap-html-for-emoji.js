// Scrapper from: https://heroesofthestorm.fandom.com/wiki/Emoji

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

      // TODO: sometimes images are base64 encoded
      // TODO: sometimes shortcuts are incorrectly split

      return {
        image: imageCell.querySelector('img').src,
        name: nameCell.innerText,
        shortcuts: shortcutsCell.innerText.split('\n'),
      }
    }).filter(Boolean)

    return {
      packName,
      entries
    }
  })
})

let downloaderElement = document.createElement('a')
downloaderElement.href = 'data:attachment/text,' + encodeURI(data);
downloaderElement.target = '_blank';
downloaderElement.download = 'hots-emoji-dataset.json';
downloaderElement.click();
