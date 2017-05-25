import AWS from 'aws-sdk'

AWS.config.update({ region: 'eu-west-1' })

export function call(action, params) {
  const db = new AWS.DynamoDB.DocumentClient()
  return db[action](params).promise()
}
