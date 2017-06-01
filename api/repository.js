const md5 = require('md5')
const _ = require('lodash')

const joinBook = (originalMessage, user, cb) => {
    let book = initBook(originalMessage, user)
    let collection = mongo.collection('books')

    collection.find({id: book.id}).limit(1).toArray((err, foundBooks) => {
        if (err) {
            return cb(err)
        }

        if (foundBooks.length) {
            foundBook = foundBooks[0]
            let index = _.findIndex(foundBook.users, {id: user.id})
            if (index == -1) {
                collection.updateOne({id: book.id}, {$push: {users: user}}, (err) => {
                    if (err) {
                        return cb(err)
                    }

                    foundBook.users.push(user)
                    return cb(null, foundBook)
                })
            } else {
                return cb(null, foundBook)
            }
        } else {
            collection.insertOne(book, (err) => {
                if (err) {
                    return cb(err)
                }

                return cb(null, book)
            })
        }
    })
}

function initBook (originalMessage, user) {
    let msg = originalMessage.attachments[0]
    let book = {
        id: md5(msg.title_link),
        title: msg.title
    }
    book.users = [user]
    book.status = 'pending'

    return book;
}

const startBook = (originalMessage, user) => {
  const { author_name: author, title } = originalMessage.attachments[0]
  const { id: userId } = user
  return mongo.collection('books')
    .findOneAndUpdate(
        { title, author },
        { $set: { status: 'progress' }, $addToSet: { users: userId } },
        { upsert: true, returnOriginal: false }
    )
}

const getInProgressBooks = () =>
  new Promise((resolve, reject) => {
    mongo.collection('books').find({status: 'progress'}).toArray((err, books) => {
      if (err) return reject(err)
      return resolve(books)
    })
  })

const markBookAsFinished = (bookId) => {
  const collection = mongo.collection('books')
  return collection.updateOne({ id: bookId }, { $set: { status: 'finished' } })
    .then(() => {
      return collection.findOne({ id: bookId })
    })
}

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
