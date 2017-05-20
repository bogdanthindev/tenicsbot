const slackItems = require('./slackItems')

const getJoinedUsers = (footer, user) => !!footer ? `<@${user.id}>, ${footer}` : `<@${user.id}> joined`

const joinBook = (originalMessage, user, res) => {
  const newAttachment = Object.assign({}, originalMessage.attachments[0], {
    footer: getJoinedUsers(originalMessage.attachments[0].footer, user)
  })
    
  res.json({ attachments: [newAttachment] })
}

const startBook = (originalMessage, res) => {
  const newAttachment = Object.assign({}, originalMessage.attachments[0], {
    actions: [originalMessage.attachments[0].actions[0]]
  })

  res.json({ attachments: [newAttachment] })
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
