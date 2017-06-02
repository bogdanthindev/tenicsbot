const { WebClient } = require('@slack/client')
const { SLACK_BOT_API_TOKEN } = require('../config')

class SlackClient {
  constructor (token) {
    this.client = new WebClient(token)
  }

  sendPrivateMessage (channel, { text, opts }) {
    return Promise.resolve(this.client.chat.postMessage(channel, text, opts))
  }
}

module.exports = new SlackClient(SLACK_BOT_API_TOKEN)
