const moment = require('moment')

const getJoinedUsers = (book) => book.users.map(u => `<@${u}>`).join(', ') + ' joined'

const getFooter = (book) =>
  book.users.length === 0
    ? 'No users joined.'
    : `${book.users.length}: ${getJoinedUsers(book)}`

const dateFormatter = (day, format = 'YYYY-MM-DD') => {
  switch (day) {
    case 'tomorrow':
      return moment().add(1, 'd').format(format)
    case 'nextSaturday':
      return moment().day(6).format(format)
    case 'nextSunday':
      return moment().day(7).format(format)
  }
}

module.exports = {
  getFooter,
  dateFormatter
}