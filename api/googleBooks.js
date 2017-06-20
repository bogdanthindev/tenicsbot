const fetch = require('node-fetch')

const createGoogleFetchURL = (searchItem, lang = 'en') =>
  encodeURI(
    `https://www.googleapis.com/books/v1/volumes?q=${searchItem}&langRestrict=${lang}&orderBy=relevance&maxResults=3`
  )

const mapBookItem = book => ({
  bookId: book.id,
  title: book.volumeInfo.title,
  author: book.volumeInfo.authors[0],
  thumbnail: book.volumeInfo.imageLinks.thumbnail,
  description: book.volumeInfo.description,
  pages: book.volumeInfo.pageCount
})

const searchBook = (bookTitle, author) => {
  const fetchUrl = createGoogleFetchURL(`${bookTitle} ${author}`.trim())
  return fetch(createGoogleFetchURL(`${bookTitle} ${author}`.trim()))
    .then(r => r.json())
    .then(result => mapBookItem(result.items[0]))
}

module.exports = {
  searchBook
}
