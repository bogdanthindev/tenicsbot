const Promise = require('bluebird')
const apiAiParser = require('./apiAiParser')
const slackItems = require('./slackItems')
const SearchBook = require('./SearchBook')
const { getInProgressBooks } = require('./repository')
const _ = require('lodash')

const sendMessage = (response, data) => {
    response.json({
        data: {
            slack: data
        }
    })
}

const createResponse = (data) =>
    !data
        ? slackItems.createNoBookFoundItem()
        : ({ attachments: _.map(data, slackItems.createAttachmentItem) })

const Controller = (req, res) => {
    console.log(req.body.result.parameters)
    let data = apiAiParser.parseBody(req.body)
    if (data.action === 'search_book') {
        SearchBook(data)
            .then(createResponse)
            .then(sendMessage.bind(null, res))
            .catch(sendMessage.bind(null, {}))
    } else if (data.action === 'ongoing_book') {
        getInProgressBooks()
            .then(slackItems.createBookCards)
            .then(sendMessage.bind(null, res))
            .catch(sendMessage.bind(null, {}))
    } else {
        sendMessage(res, data)
    }
}

module.exports = Controller
