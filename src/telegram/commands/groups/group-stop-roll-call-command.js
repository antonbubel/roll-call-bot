
const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

class GroupStopRollCallCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(ctx, chatId) {
    const userId = ctx.from.id;
    const chatMember = await ChatMemberRepository.getChatMember(chatId, userId);

    if (!chatMember || !chatMember.isChatAdministrator) {
      return;
    }

    const chat = await ChatRepository.getChatById(chatId);

    if (!chat.isActive) {
      await this._replyChatIsAlreadyInactive(ctx, chat);
      return;
    }
    
    await this._setChatInactiveAndHandleReply(ctx, chat);
  }

  async _replyChatIsAlreadyInactive(ctx, chat) {
    const message = `The roll call is already disabled for ${chat.chatName}.`;
    
    await ctx.reply(message);
  }

  async _setChatInactiveAndHandleReply(ctx, chat) {
    await ChatRepository.setChatActive(chat, false);

    const message = `The roll call was disabled for ${chat.chatName}`;
    ctx.reply(message);
  }
}

module.exports = { GroupStopRollCallCommand };
