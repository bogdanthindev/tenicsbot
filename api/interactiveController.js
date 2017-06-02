const slackItems = require('./slackItems')
const repository = require('./repository')
const { getFooter } = require('./helpers')
const SlackClient = require('./slackClient')

const ratings = {
  'positive': 5,
  'neutral': 0,
  'negative': -5
}

const joinBook = (originalMessage, user, res) => {
  const { author_name: author, title } = originalMessage.attachments[0]
  const { id: userId } = user

  repository.joinBook({ author, title, userId })
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
  const { author_name: author, title } = originalMessage.attachments[0]
  const { id: userId } = user

  repository.startBook({ author, title, userId })
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
    .then(r => { res.json(slackItems.setLocation(r.value)) })
    .catch(() => { res.send(404) })
} 

const setLocation = (bookId, location, res) => {
  repository
    .setMeetupLocation(bookId, location)
    .then(r => { res.json(slackItems.setDay(r.value)) })
    .catch(() => { res.send(404) })
}

const setDay = (bookId, day, res) => {
  repository
    .setMeetupDay(bookId, day)
    .then(r => { res.json(slackItems.setHour(r.value)) })
    .catch(() => { res.send(404) })
}

const setHour = (bookId, hour, res) => {
  repository
    .setMeetupHour(bookId, Number(hour))
    .then(r => {
      const summary = slackItems.meetupSummary(r.value)
      res.json(summary)

      return { summary, users: r.value.users }
    })
    .then(({ summary: { text, attachments }, users }) => {
      users.forEach(userId => {
        SlackClient.sendPrivateMessage(
          userId,
          { text, opts: { attachments } }
        )
      })
    })
    .catch((e) => { res.send(404) })
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
    case 'location':
      setLocation(callback_id, actions[0].selected_options[0].value, res)
      break
    case 'day':
      setDay(callback_id, actions[0].value, res)
      break
    case 'hour':
      setHour(callback_id, actions[0].selected_options[0].value, res)
      break
  }
}

module.exports = interactiveController
