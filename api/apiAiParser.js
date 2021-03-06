const _ = require('lodash')

module.exports.parseBody = (body) => {
    return {
        action: _.get(body.result, 'action', ''),
        parameters: _.get(body.result, 'parameters', {}),
        fulfillment: _.get(body.results, 'fulfillment', {}),
        user: _.get(body.originalRequest.data.event, 'user', ''),
        channel: _.get(body.originalRequest.data.event, 'channel', ''),
    }
}