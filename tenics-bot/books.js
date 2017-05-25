import fetch from 'node-fetch'
import * as db from './libs/dynamo-lib'
import { success, failure } from './libs/response-lib'

const createFetchURL = (bookTitle, lang = 'en') =>
  encodeURI(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&langRestrict=${lang}&orderBy=relevance&maxResults=2`)

const mapBookItem = (book) => ({
  "bookId": book.id,
  "title": book.volumeInfo.title,
  "author": book.volumeInfo.authors[0],
  "thumbnail": book.volumeInfo.imageLinks.thumbnail,
  "description": book.volumeInfo.description,
  "pages": book.volumeInfo.pageCount
})

export const create = async (event, context, callback) => {
  const { bookTitle } = JSON.parse(event.data)

  const result = await fetch(createFetchURL(bookTitle))
  const json = await result.json()
  
  const book = mapBookItem(json.items[0])
  console.log('book', book)
  const params = {
    TableName: 'tenics-books',
    Item: book
  }

  try {
    await db.call('put', params)
    callback(null, success(book))
  } catch (e) {
    callback(null, failure({ status: false }))
  }
}

