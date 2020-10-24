const { UserRepository, ChatRepository, ChatMemberRepository } = require('../../../database/repositories');
const { mapUser, mapUsers, mapChat } = require('../../mappings');
const { Mutex } = require('async-mutex');

class MessageCommand {
  constructor(botInstance) {
    this._locks = new Map();
    this._botInstance = botInstance;
  }

  async handle(ctx) {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    if (userId !== chatId) {
      if (!this._locks.has(chatId)) {
        this._locks.set(chatId, new Mutex());
      }

      this._locks.get(chatId)
        .acquire()
        .then(async (release) => {
          try {
            await this._handleGroupChatMessage(ctx, userId, chatId);
          } catch (error) {
          } finally {
            release();
          }
        });
    }
  }

  async _handleGroupChatMessage(ctx, userId, chatId) {
    const chat = await ChatRepository.getChatById(chatId);

    if (!chat) {
      await this._createGroupChat(ctx, chatId);
    } else {
      await this._updateGroupChat(ctx, chat);
    }
    
    await this._updateChatUsers(ctx, userId, chatId);
  }

  async _createGroupChat(ctx, chatId) {
    const chatMembersCount = await this._botInstance.telegram.getChatMembersCount(chatId);
    const chat = mapChat(ctx.chat, chatMembersCount);

    await ChatRepository.createChat(chat);
  }

  async _updateGroupChat(ctx, chat) {
    const chatMembersCount = await this._botInstance.telegram.getChatMembersCount(chat.chatId);
    const telegramChat = mapChat(ctx.chat, chatMembersCount);
  
    if (chat.chatMembersCount !== chatMembersCount || chat.chatName !== telegramChat.chatName) {
      await ChatRepository.updateChat(chat, telegramChat);
    };
  }

  async _updateChatUsers(ctx, userId, chatId) {
    const chatAdministrators = await this._botInstance.telegram.getChatAdministrators(chatId);

    const user = mapUser(ctx.from, false);
    const administrators = mapUsers(chatAdministrators, true);
    
    const users = administrators.some(administrator => administrator.userId === userId)
      ? administrators
      : [...administrators, user];
      
    await UserRepository.createOrUpdateUsers(users);
    await ChatMemberRepository.createOrUpdateChatMembers(chatId, users);
  }
}

module.exports = { MessageCommand };
