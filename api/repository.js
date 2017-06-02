const { dateFormatter } = require('./helpers')

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

const getBooksByStatus = (status = 'progress') =>
  mongo.collection('books').find({ status }).toArray()

const markBookAsFinished = (bookId) =>
  mongo.collection('books')
    .findOneAndUpdate(
      { bookId },
      { $set: { status: 'finished' } }
    )

const checkBookInDb = (book) =>
  mongo.collection('books')
    .findOne({bookId: book.bookId})
    .then(b => b)

const saveBook = (book) =>
  mongo.collection('books')
    .insertOne(Object.assign(book, { status: 'pending' }))
    .then(r => book)

// return book from db; if it's not there, add it
const checkAndAddBook = book => checkBookInDb(book).then(b => !!b ? b : saveBook(book))

const setMeetupLocation = (bookId, location) => {
  return mongo.collection('books')
    .findOneAndUpdate(
      { bookId },
      { $set: { 'meetup.location': location } },
      { upsert: true, returnOriginal: false }
    )
}

const setMeetupDay = (bookId, day) => {
  return mongo.collection('books')
    .findOneAndUpdate(
      { bookId },
      { $set: { 'meetup.day': dateFormatter(day) } },
      { upsert: true, returnOriginal: false }
    )
}

const setMeetupHour = (bookId, hour) => {
  return mongo.collection('books')
    .findOneAndUpdate(
      { bookId },
      { $set: { 'meetup.hour': hour, status: 'meetup' } },
      { upsert: true, returnOriginal: false }
    )
}

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
  getBooksByStatus,
  markBookAsFinished,
  checkBookInDb,
  saveBook,
  changeBookRating,
  checkAndAddBook,
  setMeetupLocation,
  setMeetupDay,
  setMeetupHour
}
