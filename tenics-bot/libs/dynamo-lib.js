import AWS from 'aws-sdk'

AWS.config.update({ region: 'eu-west-1' })

export function call(action, params) {
  const db = new AWS.DynamoDB.DocumentClient()
  return db[action](params).promise()
}

export function createSet(item) {
  const db = new AWS.DynamoDB.DocumentClient()
  return db.createSet([JSON.stringify(item)])
}

export const DYNAMO_ACTIONS = {
  get: 'get',
  put: 'put',
  query: 'query',
  update: 'update'
}
