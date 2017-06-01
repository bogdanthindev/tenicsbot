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

const createButtonItem = ({ label, callbackId, color }, actions = standardActions) => (
    {
      text: label,
      callback_id: callbackId,
      color: color,
      actions
    }
)

const createBookCards = (books) => ({attachments: books.map((book) => ({
        fallback: "Book information.",
        color: "#A2CD78",
        title: book.title,
        footer: getFooter(book),
        callback_id: book.id,
        actions: [{
            "name": "finish",
            "text": "Finish reading :+1:",
            "type": "button",
            "style": "danger",
            "value": "finish"
        }]
    }))
})

const bookFinished = (book) => ({
    attachments: [{
        fallback: "Book information.",
        color: "#A2CD78",
        title: book.title,
        pretext: ":tada: Congratulations on finishing this book! Now set a meetup! :tada:",
        callback_id: book.id,
        actions: [
            {
                "name": "location",
                "text": "Pick a location",
                "type": "select",
                "options": [
                    { "text": "Library 1", "value": "lib1" },
                    { "text": "Library 2", "value": "lib2" },
                    { "text": "Library 3", "value": "lib3" }
                ],
                "selected_options": [
                    {
                        "text": "Library 2",
                        "value": "lib2"
                    }
                ]
            },
            {
                "name": "hour",
                "text": "Pick a time",
                "type": "select",
                "options": [
                    { "text": "12:00", "value": 12 },
                    { "text": "15:00", "value": 15 },
                    { "text": "18:00", "value": 18 }
                ],
                "selected_options": [
                    {
                        "text": "18:00",
                        "value": "18"
                    }
                ]
            },
            {
                "name": "setMeetup",
                "text": "Set meetup",
                "type": "button",
                "style": "primary",
                "value": "setMeetup"
            }
        ]
    }]
})

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
  bookFinished,
  createRSVP,
  createRatingItem
}