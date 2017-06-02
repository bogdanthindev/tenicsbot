const repository = require('./repository')
const slackItems = require('./slackItems')
const request = require('request')
const Promise = require('bluebird')

module.exports.sendReminders = (job, done) => {
    loadBooksInProgress()
        .map(sendReminder)
        .then(() => {
            done()
        })
        .catch((e) => {
            done(e)
        })
}

function loadBooksInProgress() {
    return repository.getBooksByStatus()
}

function sendReminder(book) {
    return new Promise((resolve, reject) => {
        let text = `Hello, ${getUsersString(book.users)}! How's your progress on ${book.title}?`
        let body = JSON.stringify(slackItems.createRatingItem(text, book.id))
        request({
            method: "POST",
            url: "https://hooks.slack.com/services/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",
            headers: {
                'content-type': 'application/json'
            },
            body: body
        }, (err, response, body) => {
            if (err) {
                return reject(err)
            } else {
                return resolve(response)
            }
        })
    })
}

function getUsersString(users) {
    return users.map(u => `<@${u.id}>`).join(', ')
}