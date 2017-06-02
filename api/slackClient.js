const { WebClient } = require('@slack/client')
const { SLACK_BOT_API_TOKEN } = require('../config')

class SlackClient {
  constructor (token) {
    this.client = new WebClient(token)
  }

  isPrivateChannel (channel) {
    return !this.channels.find(ch => ch.id === channel)
  }

  sendPrivateMessage (channel, { text, opts }) {
    this.isPrivateChannel(channel)
    return Promise.resolve(this.client.chat.postMessage(channel, text, opts))
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

module.exports = new SlackClient(SLACK_BOT_API_TOKEN)
