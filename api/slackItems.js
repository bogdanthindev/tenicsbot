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

const createAttachmentItem = (item) => (
    {
      fallback: "Book information.",
      color: "#2D2522",
      author_name: item.author,
      author_link: item.link,
      title: item.title,
      title_link: item.link,
      text: item.description,
      thumb_url: item.thumbnail,
      callback_id: 'bookCard',
      actions: standardActions
    }
)

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

module.exports = {
  createTextItem,
  createAttachmentItem,
  createButtonItem,
  createNoBookFound
}