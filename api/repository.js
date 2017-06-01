const md5 = require('md5')
const _ = require('lodash')

const joinBook = ({ author, title, userId }) =>
  mongo.collection('books')
    .findOneAndUpdate(
      { title, author },
      { $addToSet: { users: userId } },
      { returnOriginal: false }
    )

const startBook = ({ author, title, userId }) =>
  mongo.collection('books')
    .findOneAndUpdate(
        { title, author },
        { $set: { status: 'progress' }, $addToSet: { users: userId } },
        { upsert: true, returnOriginal: false }
    )

const getInProgressBooks = () => mongo.collection('books').find({status: 'progress'}).toArray()

const markBookAsFinished = (bookId) => mongo.collection('books').findOneAndUpdate({ bookId }, { $set: { status: 'finished' } })

const checkBookInDb = (book) => mongo.collection('books').findOne({bookId: book.bookId}).then(b => b)

const saveBook = (book) => mongo.collection('books').insertOne(Object.assign(book, { status: 'pending' })).then(r => book)

const checkAndAddBook = book => checkBookInDb(book).then(b => !!b ? b : saveBook(book))

const changeBookRating = (bookId, userId, rating) => {
    const collection = mongo.collection('books')
    const query = { id: bookId, 'users.id': userId }
    const object = { $set: { 'users.$.rating': {[new Date().getTime()]: rating} } }
    const options = { new: true }
    return collection
        .updateOne(query, object, options)
        .exec()
}

module.exports = {
  joinBook,
  startBook,
  getInProgressBooks,
  markBookAsFinished,
  checkBookInDb,
  saveBook,
  changeBookRating,
  checkAndAddBook
}
