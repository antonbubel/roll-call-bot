const { ChatRepository, ReplyRepository } = require('../../../database/repositories');

class ReplyCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(ctx) {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    if (userId !== chatId) {
      const chat = await ChatRepository.getChatById(chatId);

      if (chat && this._isReplyValid(chat)) {
        await this._handleUserReply(userId, chat)
      }
    }
  }

  async _handleUserReply(userId, chat) {
    const reply = this._createReply(userId, chat.chatId);
    const userReply = await ReplyRepository.getUserReplyByDate(reply);

    if (!userReply) {
      await ReplyRepository.createReply(reply);
    }
  }

  _isReplyValid(chat) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const startTimeIsValid = chat.rollCallStartHour < currentHour
      || chat.rollCallStartHour === currentHour && chat.rollCallStartMinute <= currentMinute;

    const endTimeIsValid = chat.rollCallEndHour > currentHour
      || chat.rollCallEndHour === currentHour && chat.rollCallEndMinute >= currentMinute;
    
    return startTimeIsValid && endTimeIsValid;
  }

  _createReply(userId, chatId) {
    const currentTime = new Date();
    
    return {
      userId,
      chatId,
      replyYear: currentTime.getFullYear(),
      replyMonth: currentTime.getMonth(),
      replyDay: currentTime.getDate()
    };
  }
}

module.exports = { ReplyCommand };
