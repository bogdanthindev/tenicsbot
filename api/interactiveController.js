const slackItems = require('./slackItems')
const repository = require('./repository')
const { getFooter } = require('./helpers')

const ratings = {
  'positive': 5,
  'neutral': 0,
  'negative': -5
}

const joinBook = (originalMessage, user, res) => {
  repository.joinBook(originalMessage, user)
    .then(resp => {
      const book = resp.value
      const newAttachment = Object.assign({}, originalMessage.attachments[0], {
        footer: getFooter(book)
      })

      res.json({ attachments: [
        newAttachment,
        book.status === 'progress' && {
          text: 'The reading of this book is in progress. Talk and share ideas with the other group members.',
          "color": "#A2CD78"
        }
      ]})
    })
    .catch(() => { res.send(404) })
}

const startBook = (originalMessage, user, res) => {
  repository.startBook(originalMessage, user)
    .then(resp => {
      const newAttachment = Object.assign({}, originalMessage.attachments[0], {
        actions: [originalMessage.attachments[0].actions[0]],
        footer: getFooter(resp.value)
      })
      res.json({ attachments: [
        newAttachment,
        {
          "text": "The reading of this book has started.",
          "color": "#A2CD78"
        }
      ]})
    })
    .catch(() => { res.send(404) })
}

const finishBook = (bookId, res) => {
  repository
    .markBookAsFinished(bookId)
    .then(book => {
      res.json(slackItems.bookFinished(book))
    })
} 

const setMeetup = (res) => {
  res.json(slackItems.createRSVP())
}

const handleRating = (rating = 0, callback_id, userId, res) => {
  repository.changeBookRating(callback_id, userId, rating).then(r => console.log(r))
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
    case 'setMeetup':
      setMeetup(res)
      break
    default:
      handleRating(ratings[actions[0].name], callback_id, user.id, res)
  }
}

module.exports = interactiveController
