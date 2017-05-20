const slackItems = require('./slackItems')
const repository = require('./repository')
const getJoinedUsers = (footer, user) => !!footer ? `<@${user.id}>, ${footer}` : `<@${user.id}> joined`

const joinBook = (originalMessage, user, res) => {
  repository.saveData(originalMessage, user, (err, book) => {
    if (err) {
        res.send(404)
    }

    const newAttachment = Object.assign({}, originalMessage.attachments[0], {
        footer: book.users.map(u => `<@${u.id}>`).join(', ') + ' joined'
    })

    res.json({ attachments: [newAttachment] })
  })
}

const startBook = (originalMessage, user, res) => {
  repository.saveData(originalMessage, user, true, (err, book) => {
    if (err) {
        res.send(404)
    }

    const newAttachment = Object.assign({}, originalMessage.attachments[0], {
        actions: [originalMessage.attachments[0].actions[0]]
    })

    res.json({ attachments: [newAttachment] })
  })
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
    default:
      return
  }
}

module.exports = interactiveController
