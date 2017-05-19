const googleBooks = require('./googleBooks')

module.exports = (data) => {
    return getBook(data.parameters)
}

function getBook (parameters) {
    if (parameters.book && !parameters.author) {
        return googleBooks.searchByTitle(parameters.book)
    } else if (!parameters.book && parameters.author) {
        return googleBooks.searchByAuthor(parameters.author)
    } else {
        return googleBooks.searchByTitleAndAuthor(parameters.book, parameters.author)
    }
}