const express = require('express')
const bodyParser = require('body-parser')
const apiAiController = require('./api/apiAiController')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
/* Handling all messenges */
app.post('/webhook', apiAiController)
app.post('/interactive', (req, res) => {
    let payload = JSON.parse(req.body.payload)
    let message = payload.original_message.attachments[0]
    // delete message.callback_id
    // delete message.actions
    console.log(JSON.stringify(payload, null, 4))

    res.json({attachments: [message]})
})

const server = app.listen(5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
})
