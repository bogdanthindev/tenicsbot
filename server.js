const express = require('express')
const bodyParser = require('body-parser')
const apiAiController = require('./api/apiAiController')

const interactiveController = require('./api/interactiveController')

function connectToMongoDB(cb) {
    const MongoClient = require('mongodb').MongoClient;

    const url = 'mongodb://localhost:27017/tenicsbot';

    MongoClient.connect(url, function mongoConnect(err, conn) {
        if (err) {
            return cb(err);
        }

        global.mongo = conn;

        return cb();
    });
}

function startServer() {
    const app = express()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    /* Handling all messenges */
    app.post('/webhook', apiAiController)
    app.post('/interactive', interactiveController)

    const server = app.listen(5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
    })
}

connectToMongoDB(startServer);

