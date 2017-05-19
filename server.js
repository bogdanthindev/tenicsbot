const express = require('express')
const bodyParser = require('body-parser')
const apiAiController = require('./api/apiAiController')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
/* Handling all messenges */
app.post('/webhook', apiAiController)

const server = app.listen(5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
})
