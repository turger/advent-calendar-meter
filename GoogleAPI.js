const GoogleAuth = require('google-auth-library')
const google = require('googleapis')
const sheetsApi = google.sheets('v4')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const SPREADSHEET_ID = '1XrJP2FexvH5KnEawzYnEO0hPc7UWTCY5WWa-_dqeegI'

authorize = () => {
    return new Promise(resolve => {
        const authFactory = new GoogleAuth()
        const jwtClient = new authFactory.JWT(
            process.env.GOOGLE_CLIENT_EMAIL,
            null,
            process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            SCOPES
        )
        jwtClient.authorize(() => resolve(jwtClient))
    })
}

getAllData = () => {
  return new Promise(resolve => {
    authorize().then(auth => {
      getRanges(auth).then(ranges => {
        getSheetData(ranges, auth).then(data => {
          resolve(data)
        })
      })
    }).catch(function (err) {
     console.log('Error:', err)
   })
  })
}

getRanges = (auth) => {
  return new Promise(resolve => {
    sheetsApi.spreadsheets.get({
      auth: auth,
      spreadsheetId: SPREADSHEET_ID,
    }, function(err, response) {
      if (err) {
        console.error('The API returned an error: ' + err)
        return
      }
      const sheets = response.sheets
      const ranges = []
      const selection = '!A3:I30'
      if (sheets.length == 0) {
        console.error('No data found.')
        return
      } else {
        sheets.map( sheet => (
          ranges.push(sheet.properties.title+selection)
        ))
        resolve(ranges)
      }
    })
  })
}

getSheetData = (ranges, auth) => {
  return new Promise(resolve => {
    sheetsApi.spreadsheets.values.batchGet({
      auth: auth,
      spreadsheetId: SPREADSHEET_ID,
      ranges: ranges,
    }, function(err, response) {
      if (err) {
        console.error('The API returned an error: ' + err)
        return
      }
      const sheetData = response.valueRanges
      if (sheetData.length == 0) {
        console.log('No data found.')
      } else {
        formatSheetValuesToMap(sheetData).then(data => {
          resolve(data)
        })
      }
    })
  })
}

formatSheetValuesToMap = (sheetData) => {
  return new Promise(resolve => {
    let allSpreadSheetData = []
    sheetData.map( sheet => {
      let formattedSheetData = {}
      const sheetName = sheet.range.split('!')[0].replace(/\'/g,' ').trim()
      if (sheetName === 'Adventtikalenterit') return
      if (!sheet.values) {
        console.log('Empty sheet:', sheetName)
        return
      }
      const titles = getTitlesRow(sheet.values[1])
      if (titles[-1]) {
        console.log('Invalid sheet format:', sheetName)
        return
      }
      console.log(sheetName)
      const totalRow = formatTotalRow(titles, sheet.values[0], getSellerCount(sheet.values), sheetName)
      formattedSheetData['total'] = totalRow
      let tonttuData = []
      const allData = sheet.values.map(row => {
        if (row[0] === '' || row[0] === 'Nimi') return
        if (row[0].toLowerCase().indexOf('yht') === 0) { return }
        tonttuData.push(formatTonttuRow(titles, row))
      })
      formattedSheetData['tontut'] = tonttuData
      allSpreadSheetData.push(formattedSheetData)
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
  row.map((col, i) => {
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
  row.map((col, i) => {
    let value = col
    if (titles[i] === 'name' && col.toLowerCase().indexOf('yht') < 0) value = 'tonttu'
    data[titles[i]] = value
  })
  return data
}

addBadgesAndStamps = (allData) => {
  let allDataWithBadgesAndStamps = []
  allData.map(data => {
    let sheetData = data
    let badges = addBadges(allData, data)
    let stamps = addStamps(data)
    sheetData.total.badges = badges
    sheetData.total.stamps = stamps
    allDataWithBadgesAndStamps.push(sheetData)
  })
  return allDataWithBadgesAndStamps
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
