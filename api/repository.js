const md5 = require('md5');
const _ = require('lodash')

module.exports.saveData = (originalMessage, user, startBook, cb) => {
    let msg = originalMessage.attachments[0]
    let book = {
        id: md5(msg.title_link),
        title: msg.title
    }
    book.users = [user]
    book.status = startBook ? 'progress' : 'pending'

    if (startBook) {
        book.startDate = new Date().getTime()
    }

    let collection = mongo.collection('books');

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