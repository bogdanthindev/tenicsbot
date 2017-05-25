import * as db from './libs/dynamo-lib'
import { success, failure } from './libs/response-lib'

export const createRoom = async (event, context, callback) => {
  const { roomId } = JSON.parse(event.body)

  const item = {
    roomId,
    books: [],
    users: []
  }

  const params = {
    TableName: 'tenics-rooms',
    Item: item
  }

  try {
    await db.call(db.DYNAMO_ACTIONS.put, params)
    callback(null, success(item))
  } catch (e) {
    console.log('err', e)
    callback(null, failure({ status: false }))
  }
}

export const addBookToRoom = async (event, context, callback) => {
  const { bookId, roomId } = JSON.parse(event.body)

  const updateParams = {
    TableName: 'tenics-rooms',
    Key: { roomId },
    UpdateExpression: "SET #books = list_append(#books, :book)",
    ExpressionAttributeNames: { "#books": "books" },
    ExpressionAttributeValues: { ":book": [{ bookId: bookId, status: 'pending', users: [] }] },
    ReturnValues: 'ALL_NEW'
  }

  try {
    const result = await db.call(db.DYNAMO_ACTIONS.update, updateParams)
    callback(null, success(result))
  } catch (e) {
    callback(null, failure({ status: false }))
  }
}
