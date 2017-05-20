const slackItems = require('./slackItems')

const getJoinedUsers = (footer, user) => !!footer ? `<@${user.id}>, ${footer}` : `<@${user.id}> joined`

const interactiveController = (req, res) => {
  const { original_message: originalMessage, user, actions, callback_id, action_ts } = JSON.parse(req.body.payload)
  
  //save to mongo and shit

  const newAttachment = Object.assign({}, originalMessage.attachments[0], {
    footer: getJoinedUsers(originalMessage.attachments[0].footer, user)
  })

  
  res.json({ attachments: [newAttachment] })
}

module.exports = interactiveController
