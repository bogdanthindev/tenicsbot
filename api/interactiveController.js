const slackItems = require('./slackItems')
const repository = require('./repository')
const { getFooter } = require('./helpers')

const joinBook = (originalMessage, user, res) => {
  repository.saveData(originalMessage, user, false, (err, book) => {
    if (err) {
        res.send(404)
    }

    const newAttachment = Object.assign({}, originalMessage.attachments[0], {
        footer: getFooter(book)
    })

    res.json({ attachments: [
        newAttachment,
        book.status === 'progress' && {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "#A2CD78",
          "text": "The reading of this book has started.",
        }
      ]
    })
  })
}

const startBook = (originalMessage, user, res) => {
  repository.saveData(originalMessage, user, true, (err, book) => {
    if (err) {
        res.send(404)
    }

    const newAttachment = Object.assign({}, originalMessage.attachments[0], {
        actions: [originalMessage.attachments[0].actions[0]],
        footer: getFooter(book)
    })

  res.json({ attachments: [
    newAttachment,
    {
      "fallback": "Required plain-text summary of the attachment.",
      "color": "#A2CD78",
      "text": "The reading of this book has started.",
    }
  ]})
})}

const finishBook = (bookId, res) => {
  repository
    .markBookAsFinished(bookId)
    .then(res.json)
}

const interactiveController = (req, res) => {
  const { original_message: originalMessage, user, actions, callback_id, action_ts } = JSON.parse(req.body.payload)

  switch (actions[0].name) {
    case 'join':
      joinBook(originalMessage, user, res)
      break
    case 'start':
      startBook(originalMessage, user, res)
      break
    case 'finish':
      finishBook(callback_id, res)
      break
    default:
      return
  }
}

module.exports = interactiveController
