const { ChatMember } = require('../models');
const { Op } = require('sequelize');

class ChatMemberRepository {
  async getChatMembers(chatId) {
    return await ChatMember.findAll({
      where: {
        chatId: chatId
      }
    });
  }

  async getChatMembersExcept(chatId, userIds) {
    return await ChatMember.findAll({
      where: {
        [Op.and]: [
          { chatId: chatId },
          { userId: { [Op.notIn]: userIds } }
        ]
      }
    })
  }

  async createChatMember(chatId, userId, isChatAdministrator) {
    return await ChatMember.create({
      userId,
      chatId,
      isChatAdministrator
    })
  }

  async createOrUpdateChatMember(chatId, { userId, isChatAdministrator }) {
    const chatMember = await ChatMember.findOne({
      where: {
        [Op.and]: [
          { chatId: chatId },
          { userId: userId }
        ]
      }
    });

    if (chatMember) {
      return await this._updateChatMember(chatMember, isChatAdministrator);
    }

    return await this.createChatMember(chatId, userId, isChatAdministrator);
  }

  async createOrUpdateChatMembers(chatId, users) {
    const chatMembers$ = users.map(user => this.createOrUpdateChatMember(chatId, user));

    return await Promise.all(chatMembers$);
  }

  async _updateChatMember(chatMember, isChatAdministrator) {
    if (chatMember.isChatAdministrator !== isChatAdministrator) {
      chatMember.isChatAdministrator = isChatAdministrator;
      await chatMember.save();
    }

    return chatMember;
  }
}

module.exports = new ChatMemberRepository();
