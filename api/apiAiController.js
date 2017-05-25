const Promise = require('bluebird')
const apiAiParser = require('./apiAiParser')
const slackItems = require('./slackItems')
const SearchBook = require('./SearchBook')
const { getInProgressBooks, checkBookInDb, saveBook } = require('./repository')
const _ = require('lodash')

const sendMessage = (response, data) => {
    if (!data || !data.attachments.length) {
        response.json({})
        return
    }

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
    let data = apiAiParser.parseBody(req.body)
    if (data.action === 'search_book') {
        SearchBook(data)
            .then((foundBook) => {
              return checkBookInDb(foundBook[0])
              .then((bookInDb) => {
                return [bookInDb, foundBook[0]]
              })
            })
            .spread((bookInDb, foundBook) => {
                if (bookInDb) {
                  return [bookInDb]
                } else if (foundBook){
                    return saveBook(foundBook).then((bk) => [bk])
                } else {
                    return null
                }
            })
            .then(createResponse)
            .then(sendMessage.bind(null, res))
            .catch((e) => {
                sendMessage({})
            })
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
