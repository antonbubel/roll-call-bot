const { ChatRepository, ReplyRepository } = require('../../../database/repositories');

const dayOfWeek = require('../../../utilities/day-of-week');

const { replyCommandHandlerMode } = require('./constants');

class ReplyCommand {
  constructor(botInstance, mode) {
    this._botInstance = botInstance;
    this._mode = mode || replyCommandHandlerMode.callback;
  }

  async handle(ctx) {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    if (userId !== chatId) {
      const chat = await ChatRepository.getChatById(chatId);
      const isReplyValid = await this._checkIfReplyIsValidAndHandleErrors(ctx, chat);

      if (chat && isReplyValid) {
        await this._trySavingUserReply(ctx, userId, chat);
      }
    }
  }

  async _trySavingUserReply(ctx, userId, chat) {
    const reply = this._createReply(userId, chat.chatId);
    const userReply = await ReplyRepository.getUserReplyByDate(reply);

    if (!userReply) {
      await ReplyRepository.createReply(reply);
      await this._answerCallbackQuery(ctx, 'Thanks for the reply, have a nice day!');
    } else {
      await this._answerCallbackQuery(ctx, `You've already replied today.`);
    }
  }

  async _checkIfReplyIsValidAndHandleErrors(ctx, chat) {
    const isWeekend = this._isWeekend();
    const isStartTimeValid = this._isStartTimeValid(chat);
    const isEndTimeValid = this._isEndTimeValid(chat);

    if (isWeekend) {
      await this._answerCallbackQuery(ctx, 'Sorry, the roll call is off for a weekend.');
      return false;
    }

    if (!isStartTimeValid) {
      await this._answerCallbackQuery(ctx, 'Sorry, the roll call has not started yet.');
      return false;
    }

    if (!isEndTimeValid) {
      await this._answerCallbackQuery(ctx, 'Sorry, the roll call is already over.');
      return false;
    }

    return true;
  }

  async _answerCallbackQuery(ctx, message) {
    if (this._mode === replyCommandHandlerMode.callback) {
      await ctx.answerCbQuery(message, false);
    }
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
