const path = require('path')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const GoogleAPI = require('./GoogleAPI')
const pug = require('pug')

app.use(favicon(path.join(__dirname, 'src/assets', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'dist')))

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'pug')

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html')
})

app.get('/data', function(req, res, next) {
  GoogleAPI.getAllData().then(
    function (data) {
      res.send(data)
    }
  )
})

app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

app.listen(PORT, error => (
  error
    ? console.error(error)
    : console.info(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
))
