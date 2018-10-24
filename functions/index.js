const functions = require('firebase-functions')
const GoogleAPI = require('./GoogleAPI')
const cors = require('cors')({ origin: true })

exports.getData = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'GET') {
      return res.status(404).json({
        message: 'Not allowed'
      })
    }

    GoogleAPI.getAllData().then(data => {
      return res.status(200).json(data)
    }).catch(error => {
      return res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      })
    })
    return new Error('Something went wrong.')
  })
})