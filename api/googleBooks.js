const books = require('google-books-search')
const { API_KEY } = require('../config')

const options = {
  key: API_KEY,
  limit: 1,
  type: 'books',
  order: 'relevance',
  lang: 'en'
}

const mapBookResult = ({
  id, title, authors, description, pageCount, averageRating, thumbnail, link
}) => ({
  id, title, authors, description, pageCount, averageRating, thumbnail, link
})

const searchByTitle = (bookTitle, bookLimit = 3) => {
  let titleSearchPromise = new Promise((resolve, reject) => {
    books.search(bookTitle, Object.assign({}, options, { field: 'title' }), (err, result, apiResponse) => {
      if (err) return reject(err)
      resolve(result.slice(0, bookLimit).map(mapBookResult))
    })
  })
  return titleSearchPromise
}

const searchByAuthor = (author, bookLimit = 3) => {
  let authorSearchPromise = new Promise((resolve, reject) => {
    books.search(author, Object.assign({}, options, { field: 'author' }), (err, result, apiResponse) => {
      if (err) return reject(err)
      resolve(result.slice(0, bookLimit).map(mapBookResult))
    })
  })
  return authorSearchPromise
}

const searchByTitleAndAuthor = (bookTitle, author) => {
  let titleAndAuthorPromise = new Promise((resolve, reject) => {
    books.search(`${bookTitle} ${author}`, options, (err, result, apiResponse) => {
      if (err) return reject(err)
      resolve(result.slice(0, 1).map(mapBookResult))
    })
  })
  return titleAndAuthorPromise
}

module.exports = {
  searchByTitle,
  searchByAuthor,
  searchByTitleAndAuthor
}