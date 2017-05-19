const createTextItem = (text) => ({ text })

const createAttachmentItem = (item) => (
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
)

const createNoBookFound = (item) => ({
    text: 'I couldn\'t find this book. Sorry'
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
  createButtonItem,
  createNoBookFound
}