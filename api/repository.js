const md5 = require('md5')
const _ = require('lodash')
const Promise = require('bluebird')

module.exports.joinBook = (originalMessage, user, cb) => {
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

module.exports.startBook = (originalMessage, user, cb) => {
    let book = initBook(originalMessage, user)
    let collection = mongo.collection('books')

    collection.find({id: book.id}).limit(1).toArray((err, foundBooks) => {
        if (err) {
            return cb(err)
        }

        if (!foundBooks.length) {
            return cb()
        }

        let foundBook = foundBooks[0]

        let updater = {
            $set: {status: 'progress'}
        }

        let index = _.findIndex(foundBook.users, {id: user.id})
        if (index == -1) {
            updater["$push"] = {users: user}
        }

        collection.updateOne({id: book.id}, updater, (err) => {
            if (err) {
                return cb(err)
            }

            if (updater["$push"]) {
                foundBook.users.push(user)
            }

            return cb(null, foundBook)
        })
    })
}

module.exports.getInProgressBooks = () => {
    const collection = mongo.collection('books')
    return new Promise((resolve, reject) => {
        collection.find({status: 'progress'}).toArray((err, books) => {
            if (err) return reject(err)
            return resolve(books)
        })
    })
}
