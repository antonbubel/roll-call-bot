const { Chat } = require('../models');
const { Op } = require('sequelize');

class ChatRepository {
  async getChatById(chatId) {
    return await Chat.findOne({
      where: {
        chatId: chatId
      }
    });
  }

  async getActiveChatsWhereRollCallShouldStart(hour, minute) {
    return await Chat.findAll({
      where: {
        [Op.and]: [
          { isActive: true },
          { rollCallStartHour: hour },
          { rollCallStartMinute: minute }
        ]
      }
    });
  }

  async getActiveChatsWhereRollCallShouldEnd(hour, minute) {
    return await Chat.findAll({
      where: {
        [Op.and]: [
          { isActive: true },
          { rollCallEndHour: hour },
          { rollCallEndMinute: minute }
        ]
      }
    });
  }

  async createChat({ chatId, chatName, chatMembersCount }) {
    return await Chat.create({
      chatId,
      chatName,
      chatMembersCount
    });
  }

  async updateChat(chat, { chatName, chatMembersCount }) {
    chat.chatName = chatName;
    chat.chatMembersCount = chatMembersCount;

    await chat.save();

    return chat;
  }
}

module.exports = new ChatRepository();
