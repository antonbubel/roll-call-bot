const { Chat, ChatMember } = require('../models');
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

  async getChatsWhereUserIsAdministrator(userId) {
    return await Chat.findAll({
      where: {
        [Op.and]: [
          { '$chatMembers.userId$': userId },
          { '$chatMembers.isChatAdministrator$': true }
        ]
      },
      include: [{
        as: 'chatMembers',
        model: ChatMember,
        required: false
      }]
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

  async setChatRollCallStartHour(chat, rollCallStartHour) {
    chat.rollCallStartHour = rollCallStartHour;

    await chat.save();

    return chat;
  }
  
  async setChatRollCallStartMinute(chat, rollCallStartMinute) {
    chat.rollCallStartMinute = rollCallStartMinute;

    await chat.save();

    return chat;
  }

  async setChatRollCallEndHour(chat, rollCallEndHour) {
    chat.rollCallEndHour = rollCallEndHour;

    await chat.save();

    return chat;
  }

  async setChatRollCallEndMinute(chat, rollCallEndMinute) {
    chat.rollCallEndMinute = rollCallEndMinute;

    await chat.save();

    return chat;
  }

  async setChatActive(chat, isActive) {
    chat.isActive = isActive;

    await chat.save();

    return chat;
  }
}

module.exports = new ChatRepository();
