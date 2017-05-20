const getJoinedUsers = (book) => book.users.map(u => `<@${u.id}>`).join(', ') + ' joined'

const getFooter = (book) =>
  book.users.length === 0
    ? 'No users joined.'
    : `${book.users.length}: ${getJoinedUsers(book)}`

module.exports = {
  getFooter
}