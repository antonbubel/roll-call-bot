const { User } = require('../models');

class UserRepository {
  async getUserById(userId) {
    return await User.findOne({
      where: {
        userId: userId
      }
    })
  }

  async createUser({ userId, username, firstName, lastName }) {
    return await User.create({
      userId,
      username,
      firstName,
      lastName
    });
  }

  async createOrUpdateUser(user) {
    const existingUser = await this.getUserById(user.userId);

    if (!existingUser) {
      return await this.createUser(user);
    }

    return existingUser;
  }

  async createOrUpdateUsers(users) {
    const users$ = users.map(this.createOrUpdateUser.bind(this));

    return await Promise.all(users$);
  }
}

module.exports = new UserRepository();
