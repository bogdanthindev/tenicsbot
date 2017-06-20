const { WebClient } = require('@slack/client')

class SlackClient {
  constructor (token) {
    this.client = new WebClient(token)
  }

  isPrivateChannel (channel) {
    return !this.channels.find(ch => ch.id === channel)
  }

  sendPrivateMessage (channelId, { text, opts }) {
    return Promise.resolve(this.client.chat.postMessage(channelId, text, opts))
  }

  sendInteractiveMessage (channelId, message) {
    return Promise.resolve(this.client.chat.postMessage(channelId, message.text, {
      attachments: message.attachments
    }))
  }

  updateMessage (channelId, ts, message) {
    return Promise.resolve(this.client.chat.update(ts, channelId, message.text, {
      attachments: message.attachments
    }))
  }

  getAllChannels () {
    return new Promise((resolve, reject) => {
      this.client.channels.list((err, data) => {
        if (err) reject(err)

        const mappedChannels = data.channels.map(({ id, name, members }) => ({ id, name, members }))
        this.channels = mappedChannels

        resolve(mappedChannels)
      })
    })
  }
}

module.exports = new SlackClient(process.env.SLACK_BOT_API_TOKEN)
