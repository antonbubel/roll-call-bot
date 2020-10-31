const { ChatRepository, ReplyRepository } = require('../../../database/repositories');

const dayOfWeek = require('../../../utilities/day-of-week');

class ReplyCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(ctx) {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    if (userId !== chatId) {
      const chat = await ChatRepository.getChatById(chatId);
      const isReplyValid = await this._checkIfReplyIsValidAndHandleErrors(ctx, chat);

      if (chat && isReplyValid) {
        await this._handleUserReply(ctx, userId, chat);
      }
    }
  }

  async _handleUserReply(ctx, userId, chat) {
    const reply = this._createReply(userId, chat.chatId);
    const userReply = await ReplyRepository.getUserReplyByDate(reply);

    if (!userReply) {
      await ReplyRepository.createReply(reply);
      await ctx.answerCbQuery('Thanks for the reply, have a nice day!', false);
    } else {
      await ctx.answerCbQuery(`You've already replied today.`, false);
    }
  }

  async _checkIfReplyIsValidAndHandleErrors(ctx, chat) {
    const isWeekend = this._isWeekend();
    const isStartTimeValid = this._isStartTimeValid(chat);
    const isEndTimeValid = this._isEndTimeValid(chat);

    if (isWeekend) {
      await ctx.answerCbQuery('Sorry, the roll call is off for a weekend.', false);
      return false;
    }

    if (!isStartTimeValid) {
      await ctx.answerCbQuery('Sorry, the roll call has not started yet.', false);
      return false;
    }

    if (!isEndTimeValid) {
      await ctx.answerCbQuery('Sorry, the roll call is already over.', false);
      return false;
    }

    return true;
  }

  _isWeekend() {
    const currentTime = new Date();
    const day = currentTime.getDay();

    return day === dayOfWeek.saturday
      || day === dayOfWeek.sunday;
  }

  _isStartTimeValid(chat) {
    const { currentHour, currentMinute } = this._getCurrentTime();

    return chat.rollCallStartHour < currentHour
      || chat.rollCallStartHour === currentHour && chat.rollCallStartMinute <= currentMinute;
  }

  _isEndTimeValid(chat) {
    const { currentHour, currentMinute } = this._getCurrentTime();

    return chat.rollCallEndHour > currentHour
      || chat.rollCallEndHour === currentHour && chat.rollCallEndMinute > currentMinute;
  }

  _getCurrentTime() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    return { currentHour, currentMinute };
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
