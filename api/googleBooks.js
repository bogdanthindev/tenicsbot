const books = require('google-books-search')
const { API_KEY } = require('../config')

const options = {
  key: API_KEY,
  limit: 1,
  type: 'books',
  order: 'relevance',
  lang: 'en'
}

const mapBookResult = ({ id, title, authors, description, pageCount, averageRating  }) => ({
  id, title, authors, description, pageCount, averageRating
})

const searchByTitle = (bookTitle) => {
  let titleSearchPromise = new Promise((resolve, reject) => {
    books.search(bookTitle, Object.assign({}, options, { field: 'title' }), (err, result, apiResponse) => {
      if (err) reject(err)
      resolve(mapBookResult(result[0]))
    })
  })
  return titleSearchPromise
}

const searchByAuthor = (author) => {
  let authorSearchPromise = new Promise((resolve, reject) => {
    books.search(author, Object.assign({}, options, { field: 'author' }), (err, result, apiResponse) => {
      if (err) reject(err)
      resove(mapBookResult(result[0]))
    })
  })
  return authorSearchPromise
}

const searchByTitleAndAuthor = (bookTitle, author) => {
  let titleAndAuthorPromise = new Promise((resolve, reject) => {
    books.search(`${bookTitle} ${author}`, options, (err, result, apiResponse) => {
      if (err) reject(err)
      resolve(mapBookResult(result[0]))
    })
  })
  return titleAndAuthorPromise
}

module.exports = {
  searchByTitle,
  searchByAuthor,
  searchByTitleAndAuthor
}