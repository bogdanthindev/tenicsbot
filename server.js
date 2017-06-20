const express = require('express')
const bodyParser = require('body-parser')
const apiAiController = require('./api/apiAiController')
const interactiveController = require('./api/interactiveController')
const Agenda = require('agenda')
const mongoString = 'mongodb://tenicsbot:development@ds129352.mlab.com:29352/tenicsbot'

const reminderController = require('./api/reminderController')

const SlackClient = require('./api/slackClient')

const connectToMongoDB = cb => {
  const MongoClient = require('mongodb').MongoClient

  MongoClient.connect(mongoString, function mongoConnect(err, conn) {
    if (err) {
      return cb(err)
    }

    global.mongo = conn
    return cb()
  })
}

const startServer = () => {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  /* Handling all messenges */
  app.post('/webhook', apiAiController)
  app.post('/interactive', interactiveController)

  // SlackClient.getAllChannels()

  const agenda = new Agenda({ db: { address: mongoString } })
  agenda.define('send reminders', reminderController.sendReminders)
  agenda.on('ready', () => {
    agenda.every('30 seconds', 'send reminders')
    agenda.start()
  })

  const server = app.listen(process.env.PORT || 5000, () => {
    console.log(
      'Express server listening on port %d in %s mode',
      server.address().port,
      app.settings.env
    )
  })
}

connectToMongoDB(startServer)
