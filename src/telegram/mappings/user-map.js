const mapUser = (user, isChatAdministrator = false) => ({
  userId: user.id,
  username: user.username || null,
  firstName: user.first_name || null,
  lastName: user.last_name || null,
  isChatAdministrator
});

const mapUsers = (users, isChatAdministrators) =>
  users.map(({ user }) => mapUser(user, isChatAdministrators));

module.exports = { mapUser, mapUsers };
