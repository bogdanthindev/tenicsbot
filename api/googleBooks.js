const books = require('google-books-search')
const { API_KEY } = require('../config')

const options = {
  key: API_KEY,
  limit: 10,
  type: 'books',
  order: 'relevance',
  lang: 'en'
}

const mapBookResult = ({
  id, title, authors, description, pageCount, averageRating, thumbnail, link
}) => ({
  id, title, authors, description, pageCount, averageRating, thumbnail, link
})

const searchByTitle = (bookTitle) => {
  books.search(bookTitle, Object.assign({}, options, { field: 'title' }), (err, result, apiResponse) => {
    if (err) return
    return mapBookResult(result[0])
  })
}

const searchByAuthor = (author) => {
  books.search(author, Object.assign({}, options, { field: 'author' }), (err, result, apiResponse) => {
    if (err) return
    return mapBookResult(result[0])
  })
}

const searchByTitleAndAuthor = (bookTitle, author) => {
  books.search(`${bookTitle} ${author}`, options, (err, result, apiResponse) => {
    if (err) return
    return mapBookResult(result[0])
  })
}

module.exports = {
  searchByTitle,
  searchByAuthor,
  searchByTitleAndAuthor
}