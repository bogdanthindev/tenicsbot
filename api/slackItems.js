const createTextItem = (text) => ({ text })

const createAttachmentItem = (item) => ({
  attachments: [
    {
      fallback: "Book information.",
      color: "#ffeeff",
      author_name: item.author,
      author_link: item.link,
      title: item.title,
      title_link: item.link,
      text: item.description,
      thumb_url: item.thumbnail
    }
  ]
})

/*
[
    {
        "name": "game",
        "text": "Chess",
        "type": "button",
        "value": "chess"
    },
    {
        "name": "game",
        "text": "Falken's Maze",
        "type": "button",
        "value": "maze"
    },
    {
        "name": "game",
        "text": "Thermonuclear War",
        "style": "danger",
        "type": "button",
        "value": "war",
        "confirm": {
            "title": "Are you sure?",
            "text": "Wouldn't you prefer a good game of chess?",
            "ok_text": "Yes",
            "dismiss_text": "No"
        }
    }
]
*/

const createButtonItem = ({ text, label, callbackId }, actions) => ({
  text,
  attachments: [
    {
      text: label,
      callback_id: callbackId,
      color: "#ffeeff",
      actions
    }
  ]
})


module.exports = {
  createTextItem,
  createAttachmentItem,
  createButtonItem
}