const admin = require('firebase-admin')
const functions = require('firebase-functions')
admin.initializeApp()
const database = admin.database()
const { google } = require('googleapis')
const sheetsApi = google.sheets('v4')
const _ = require('lodash')

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly'

getAllData = () => {
  return new Promise(resolve => {
    getCongfig()
    .then(config => resolve(getData(config)))
    .catch(err => {
      throw new Error(`Error: ${err}`)
    })
  })
}

getCongfig = () => {
  return new Promise(resolve => {
    database.ref('/config').on('value', (snapshot) => {
      const data = snapshot.val()
      const googleKey = functions.config().calendarservice.googlekey
      const config = Object.keys(data).reduce((acc, key) => (Object.assign(acc, {[key]: data[key]})), {})
      const jwtClient = new google.auth.JWT({email: config.googleClientEmail, key: googleKey.replace(/\\n/g, '\n'), scopes: SCOPES})
      config.auth = jwtClient
      resolve(config)
    })
  })
}

getData = (config) => {
  // first get ranges
  return new Promise(resolve => {
    sheetsApi.spreadsheets.get({
      auth: config.auth,
      spreadsheetId: config.spreadsheetId,
    }, (err, response) => {
      if (err) {
        console.error('The API returned an error: ' + err)
        return
      }
      const sheets = response.data.sheets
      if (sheets.length === 0) {
        throw new Error('No data found from sheet')
      } else {
        const selection = '!A3:I30'
        const ranges = sheets.map(sheet => sheet.properties.title+selection)
        resolve(getSheetData(ranges, config))
      }
    })
  })
}

getSheetData = (ranges, config) => {
  return new Promise(resolve => {
    sheetsApi.spreadsheets.values.batchGet({
      auth: config.auth,
      spreadsheetId: config.spreadsheetId,
      ranges: ranges,
    }, (err, response) => {
      if (err) {
        console.error('The API returned an error: ' + err)
        return
      }
      const sheetData = response.data.valueRanges
      if (sheetData.length === 0) {
        console.log('No data found.')
      } else {
        formatSheetValuesToMap(sheetData).then(data => {
          return resolve(data)
        }).catch(err => {
          throw new Error(`Error: ${err}`)
        })
      }
    })
  })
}

_getSheetName = range => range.split('!')[0].replace(/'/g,' ').trim()

formatSheetValuesToMap = (sheetData) => {
  return new Promise(resolve => {
    const allSpreadSheetData = sheetData
      .filter(sheet => sheet.values && _getSheetName(sheet.range) !== 'Adventtikalenterit')
      .map(sheet => {
        let formattedSheetData = {}
        const sheetName = _getSheetName(sheet.range)
        const titles = getTitlesRow(sheet.values[1])
        if (titles[-1]) {
          throw new Error('Invalid sheet format:', sheetName)
        }
        const totalRow = formatTotalRow(titles, sheet.values[0], getSellerCount(sheet.values), sheetName)
        formattedSheetData['total'] = totalRow
        formattedSheetData['tontut'] = sheet.values
          .filter(row => row[0] !== '' && row[0] !== 'Nimi' && row[0].toLowerCase().indexOf('yht') === -1)
          .map(row => formatTonttuRow(titles, row))
        return formattedSheetData
      })
    const allSpreadSheetDataWithBadgesAndStamps = addBadgesAndStamps(allSpreadSheetData)
    resolve(allSpreadSheetDataWithBadgesAndStamps)
  })
}

getSellerCount = (values) => {
  return values.filter(v => v[0] !== '' && v[0].toLowerCase().indexOf('yht') < 0 && v[0].indexOf('Nimi') < 0 ).length
}

getTitlesRow = (titles) => {
  let titleOrder = {}
  titleOrder[includes(titles, "Nimi")] = 'name'
  titleOrder[includes(titles, "Annettu")] = 'given'
  titleOrder[includes(titles, "Palautettu")] = 'returned'
  titleOrder[includes(titles, "Tilitettävää")] = 'totaleur'
  titleOrder[includes(titles, "Tilitetty")] = 'paid'
  titleOrder[includes(titles, "Puuttuu")] = 'owes'
  titleOrder[includes(titles, "lisäkalenterit")] = 'extra'
  return titleOrder
}

includes = (titles, title) => {
  return titles.findIndex(v => v.toLowerCase().includes(title.toLowerCase()))
}

formatTotalRow = (titles, row, totalSellers, sheetName) => {
  let data = {}
  row.forEach((col, i) => {
    let value = col
    data[titles[i]] = value
  })
  const soldPerSeller = data['given'] / totalSellers
  data['totalSellers'] = totalSellers
  data['soldPerSeller'] = soldPerSeller ? soldPerSeller : 0
  data['sheetName'] = sheetName
  return data
}

formatTonttuRow = (titles, row) => {
  let data = {}
  row.forEach((col, i) => {
    let value = col
    if (titles[i] === 'name' && col.toLowerCase().indexOf('yht') < 0) value = 'tonttu'
    data[titles[i]] = value
  })
  return data
}

addBadgesAndStamps = (allData) => {
  return allData.map(data => {
    let sheetData = data
    let badges = addBadges(allData, data)
    let stamps = addStamps(data)
    sheetData.total.badges = badges
    sheetData.total.stamps = stamps
    return sheetData
  })
}

addBadges = (allData, data) => {
  let badges = []
  const mostCalendars = Math.max.apply(Math, allData.map(data => data.total.given - data.total.returned))
  const mostSellers = Math.max.apply(Math, allData.map(data => data.total.totalSellers))
  const mostSoldPerSeller = Math.max.apply(Math, allData.map(data => data.total.soldPerSeller))
  if (data.total.given - data.total.returned >= mostCalendars) badges.push('mostCalendars')
  if (data.total.totalSellers >= mostSellers) badges.push('mostSellers')
  if (data.total.soldPerSeller >= mostSoldPerSeller) badges.push('mostSoldPerSeller')
  return badges
}

addStamps = (data) => {
  let stamps = []
  const soldPerSeller = data.total.soldPerSeller
  if (soldPerSeller === 0) stamps.push('grinch')
  if (soldPerSeller > 0 && soldPerSeller <= 5) stamps.push('snowman')
  if (soldPerSeller > 5 && soldPerSeller <= 11) stamps.push('husky')
  if (soldPerSeller > 11 && soldPerSeller <= 20) stamps.push('tonttu')
  if (soldPerSeller > 20 && soldPerSeller <= 50) stamps.push('threewisemen')
  if (soldPerSeller > 50) stamps.push('christmasstar')
  return stamps
}

module.exports = {
  getAllData
}

