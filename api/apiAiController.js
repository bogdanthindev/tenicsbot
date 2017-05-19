const Promise = require('bluebird')
const googleBooks = require('./googleBooks')
const apiAiParser = require('./apiAiParser')
const slackItems = require('./slackItems')

const sendMessage = (response, data) => {
    response.json({
        data: {
            slack: data
        }
    })
}

const augumentResponse = (originalData, bookData) => {
    console.log('original', originalData)
    console.log('book', bookData)
    originalData.bookData = bookData
    return originalData
}

const Controller = (req, res) => {
    let data = apiAiParser.parseBody(req.body)
    if (data.action === 'search_book') {
        googleBooks.searchByTitleAndAuthor(data.parameters.book, data.parameters.author)
            .then(augumentResponse.bind(null, data))
            .then((data) => slackItems.createAttachmentItem(data.bookData))
            .then(sendMessage.bind(null, res))
            .catch(sendMessage.bind(null, {}))
    } else {
        sendMessage(res, data)
    }
}

module.exports = Controller