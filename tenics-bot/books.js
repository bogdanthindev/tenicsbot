import fetch from 'node-fetch'
import * as db from './libs/dynamo-lib'
import { success, failure } from './libs/response-lib'

const createGoogleFetchURL = (bookTitle, lang = 'en') =>
  encodeURI(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&langRestrict=${lang}&orderBy=relevance&maxResults=2`)

const mapBookItem = (book) => ({
  "bookId": book.id,
  "title": book.volumeInfo.title,
  "author": book.volumeInfo.authors[0],
  "thumbnail": book.volumeInfo.imageLinks.thumbnail,
  "description": book.volumeInfo.description,
  "pages": book.volumeInfo.pageCount
})

export const findBook = async (event, context, callback) => {
  const { bookTitle, roomId } = JSON.parse(event.body)

  const result = await fetch(createGoogleFetchURL(bookTitle))
  const json = await result.json()
  const book = mapBookItem(json.items[0])

  const queryParams = {
    TableName: 'tenics-books',
    KeyConditionExpression: "bookId = :bookId",
    ExpressionAttributeValues: {
      ":bookId": book.bookId
    }
  }

  try {
    const { Count } = await db.call(db.DYNAMO_ACTIONS.query, queryParams)
    console.log('db book', Count)
    if (!Count) {
      console.log('no book found, need to create it')
    }
  } catch (e) {
    console.log('err', e)
    callback(null, failure({ status: false }))
  }
}

export const create = async (event, context, callback) => {
  const { bookTitle } = JSON.parse(event.body)

  const result = await fetch(createGoogleFetchURL(bookTitle))
  const json = await result.json()
  
  const book = mapBookItem(json.items[0])
  const params = {
    TableName: 'tenics-books',
    Item: book
  }

  try {
    await db.call(db.DYNAMO_ACTIONS.put, params)
    callback(null, success(book))
  } catch (e) {
    callback(null, failure({ status: false }))
  }
}

export const getBook = async (event, context, callback) => {
  const { bookId } = JSON.parse(event.body)

  const params = {
    TableName: 'tenics-books',
    Key: { bookId }
  }

  try {
    const book = await db.call('get', params)
    callback(null, success(book))
  } catch (e) {
    callback(null, failure({ status: false }))
  }
}

