const slackItems = require('./slackItems')
const repository = require('./repository')

const getJoinedUsers = (book) => book.users.map(u => `<@${u.id}>`).join(', ') + ' joined'

const getFooter = (book) =>
  book.users.length === 0
    ? 'No users joined.'
    : `${book.users.length}: ${getJoinedUsers(book)}`

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

const interactiveController = (req, res) => {
  const { original_message: originalMessage, user, actions, callback_id, action_ts } = JSON.parse(req.body.payload)

  switch (actions[0].name) {
    case 'join':
      joinBook(originalMessage, user, res)
      break
    case 'start':
      startBook(originalMessage, user, res)
      break
    default:
      return
  }
}

module.exports = interactiveController
