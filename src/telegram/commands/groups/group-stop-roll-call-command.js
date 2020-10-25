
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
  }
}

module.exports = { GroupStopRollCallCommand };
