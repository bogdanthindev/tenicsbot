const moment = require('moment')
const { getFooter } = require('./helpers')

const createTextItem = (text) => ({ text })

const standardActions = [
    {
        "name": "join",
        "text": "Join",
        "type": "button",
        "value": "join"
    },
    {
        "name": "start",
        "text": "Start reading",
        "type": "button",
        "value": "start"
    }
]

const createAttachmentItem = (item) => {
    let actions = [standardActions[0]]
    if (item.status === 'pending') {
        actions = standardActions
    }

    return {
      fallback: "Book information.",
      color: "#2D2522",
      author_name: item.author,
      author_link: item.link,
      title: item.title,
      title_link: item.link,
      text: item.description,
      image_url: item.thumbnail,
      callback_id: 'bookCard',
      actions: actions
    }
}

const createNoBookFound = (item) => ({
    text: 'I couldn\'t find this book. Sorry'
})

const createButtonItem = ({ label, callbackId, color }, actions = standardActions) => ({
  text: label,
  callback_id: callbackId,
  color: color,
  actions
})

const createBookCards = (books) => {
  return {
    attachments: books.map((book) => ({
      fallback: "Book information.",
      color: "#A2CD78",
      title: book.title,
      footer: getFooter(book),
      callback_id: book.bookId,
      actions: [{
        "name": "finish",
        "text": "Finish reading :+1:",
        "type": "button",
        "style": "danger",
        "value": "finish"
      }]
    }))
  }
}

const setLocation = (book) => {
  return {
    text: ":tada: Congratulations on finishing this book! Now set a meetup! :tada:",
    attachments: [{
      fallback: "Book information.",
      color: "#A2CD78",
      title: book.title,
      author_name: book.author,
      pretext: ":house: Choose a location :house:",
      callback_id: book.bookId,
      actions: [{
        "name": "location",
        "text": "Pick a location",
        "type": "select",
        "options": [
          { "text": "Library 1", "value": "lib1" },
          { "text": "Library 2", "value": "lib2" },
          { "text": "Library 3", "value": "lib3" }
        ]
      }]
    }]
  }
}

const setDay = (book) => {
  return {
    text: ":tada: Congratulations on finishing this book! Now set a meetup! :tada:",
    attachments: [{
      "mrkdwn_in": ["text"],
      text: `:house: Location: *${book.meetup.location}*`,
      "color": "#A2CD78"
    }, {
      fallback: "Book information.",
      color: "#A2CD78",
      title: book.title,
      author_name: book.author,
      pretext: ":date: Choose a day :date:",
      callback_id: book.bookId,
      actions: [{
          "name": "day",
          "text": "Tomorrow",
          "type": "button",
          "value": "tomorrow"
        }, {
          "name": "day",
          "text": "Next Saturday",
          "type": "button",
          "value": "nextSaturday"
        }, {
          "name": "day",
          "text": "Next Sunday",
          "type": "button",
          "value": "nextSunday"
        }]
    }]
  }
}

const setHour = (book) => {
  return {
    text: ":tada: Congratulations on finishing this book! Now set a meetup! :tada:",
    attachments: [{
      "mrkdwn_in": ["text"],
      text: `:house: Location: *${book.meetup.location}*`,
      "color": "#A2CD78"
    }, {
      "mrkdwn_in": ["text"],
      text: `:date: Day: *${moment(book.meetup.day).format('dddd DD MMMM')}*`,
      "color": "#A2CD78"
    },{
      fallback: "Book information.",
      color: "#A2CD78",
      title: book.title,
      author_name: book.author,
      pretext: ":clock11: Choose an hour :clock11:",
      callback_id: book.bookId,
      actions: [{
          "name": "hour",
          "text": "Pick an hour",
          "type": "select",
          "options": [
            { "text": "09:00", "value": "9" },
            { "text": "11:00", "value": "11" },
            { "text": "13:00", "value": "13" },
            { "text": "15:00", "value": "15" },
            { "text": "17:00", "value": "17" }
          ]
        }]
    }]
  }
}

const meetupSummary = (book) => {
  return {
    text: `Everything is setup! Enjoy your meetup, share ideas and make new friends!`,
    attachments: [{
      "mrkdwn_in": ["text"],
      text: `:book: *${book.title}* by _${book.author}_`,
      "color": "#A2CD78"
    },{
      "mrkdwn_in": ["text"],
      text: `:house: Where?: *${book.meetup.location}*`,
      "color": "#A2CD78"
    }, {
      "mrkdwn_in": ["text"],
      text: `:date: When?: *${moment(book.meetup.day).format('dddd DD MMMM')}*`,
      "color": "#A2CD78"
    },{
      "mrkdwn_in": ["text"],
      text: `:clock11: Hour?: *${book.meetup.hour}*`,
      "color": "#A2CD78"
    }]
  }
}

const createRSVP = (time = '18:00', location = 'Library 2') => ({
    attachments: [{
        title: `Are you attending to the meetup at ${location} - ${time}?`,
        footer: `Please react with :+1: - Yes  |  :-1: - No`,
        color: "#A2CD78"
    }]
})

const createRatingItem = (text, bookId) => ({
    text,
    attachments: [{
        fallback: 'un fallback',
        color: 'red',
        attachment_type: 'default',
        callback_id: bookId,
        actions: [
            {
                "name": "positive",
                "text": ":+1:",
                "type": "button",
                "style": "primary",
                "value": "positive"
            },
            {
                "name": "neutral",
                "text": ":ok_hand:",
                "type": "button",
                "value": "neutral"
            },
            {
                "name": "negative",
                "text": ":-1:",
                "type": "button",
                "style": "danger",
                "value": "negative"
            }
        ]
    }]
})

module.exports = {
  createTextItem,
  createAttachmentItem,
  createButtonItem,
  createNoBookFound,
  createBookCards,
  setLocation,
  setDay,
  setHour,
  createRSVP,
  createRatingItem,
  meetupSummary
}