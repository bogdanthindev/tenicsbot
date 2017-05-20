const createTextItem = (text) => ({ text })

const standardActions = [
    {
        "name": "buy",
        "text": "Buy",
        "type": "button",
        "value": "buy"
    },
    {
        "name": "start",
        "text": "Start",
        "type": "button",
        "value": "start"
    }
]

const createAttachmentItem = (item) => (
    {
      fallback: "Book information.",
      color: "#ffeeff",
      author_name: item.author,
      author_link: item.link,
      title: item.title,
      title_link: item.link,
      text: item.description,
      thumb_url: item.thumbnail,
      callback_id: 'test',
      actions: standardActions
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