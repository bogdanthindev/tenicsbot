const apiAiParser = require('./apiAiParser')
const slackItems = require('./slackItems')
const { searchBook } = require('./googleBooks')
const { getBooksByStatus, checkBookInDb, saveBook, checkAndAddBook } = require('./repository')

const sendMessage = (response) => (data) => {
  if (!data || !data.attachments.length) {
    response.json({})
      return
  }
  response.json({
    data: { slack: data }
  })
}

const createResponse = (data) =>
  !data
    ? slackItems.createNoBookFoundItem()
    : ({ attachments: [slackItems.createAttachmentItem(data)] })

const Controller = (req, res) => {
  const data = apiAiParser.parseBody(req.body)
  const { parameters: { author, book } } = data

  switch (data.action) {
    case 'search_book':
      searchBook(book, author)
        .then(checkAndAddBook)
        .then(createResponse)
        .then(sendMessage(res))
        .catch(e => { sendMessage(res)({}) })
      break
    case 'ongoing_book':
      getBooksByStatus()
        .then(slackItems.createBookCards)
        .then(sendMessage(res))
        .catch(e => { sendMessage(res)({}) })
      break
    case 'show_meetups':
      getBooksByStatus('meetup')
        .then(slackItems.createMeetups)
        .then(sendMessage(res))
        .catch(e => { sendMessage(res)({}) })
      break
    default:
      sendMessage(res)(data)
  }
}

module.exports = Controller
