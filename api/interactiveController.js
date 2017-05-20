const slackItems = require('./slackItems')
const repository = require('./repository')

const getJoinedUsers = (book) => book.users.map(u => `<@${u.id}>`).join(', ') + ' joined'

const getFooter = (book) =>
  book.users.length === 0
    ? 'No users joined.'
    : `${book.users.length}: ${getJoinedUsers(book)}`

const joinBook = (originalMessage, user, res) => {
  repository.saveData(originalMessage, user, (err, book) => {
    if (err) {
        res.send(404)
    }

    const newAttachment = Object.assign({}, originalMessage.attachments[0], {
        footer: getFooter(book)
    })

    res.json({ attachments: [newAttachment] })
  })
}

const startBook = (originalMessage, res) => {
  const newAttachment = Object.assign({}, originalMessage.attachments[0], {
    actions: [originalMessage.attachments[0].actions[0]]
  })

  res.json({ attachments: [
    newAttachment,
    {
      "fallback": "Required plain-text summary of the attachment.",
      "color": "#36a64f",
      "pretext": "The reading of this book has started.",
    }
  ]})
}

const interactiveController = (req, res) => {
  const { original_message: originalMessage, user, actions, callback_id, action_ts } = JSON.parse(req.body.payload)

  switch (actions[0].name) {
    case 'join':
      joinBook(originalMessage, user, res)
      break
    case 'start':
      startBook(originalMessage, res)
      break
    default:
      return
  }
}

module.exports = interactiveController
