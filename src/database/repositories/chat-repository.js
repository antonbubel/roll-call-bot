const { Chat } = require('../models');

class ChatRepository {
  async getChatById(chatId) {
    return await Chat.findOne({
      where: {
        chatId: chatId
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
