const { User, ChatMember } = require('../models');
const { Op } = require('sequelize');

class UserRepository {
  async getUserById(userId) {
    return await User.findOne({
      where: {
        userId: userId
      }
    })
  }

  async getChatUsersExcept(chatId, userIds) {
    return await User.findAll({
      where: {
        [Op.and]: [
          { userId: { [Op.notIn]: userIds } },
          { '$chatMembers.chatId$': chatId }
        ]
      },
      include: [{
        as: 'chatMembers',
        model: ChatMember,
        required: false
      }]
    });
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
