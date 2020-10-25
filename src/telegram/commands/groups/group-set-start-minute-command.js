const { Keyboard, Key } = require('telegram-keyboard');

const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

const trim = require('../../../utilities/trim');
const formatTime = require('../../../utilities/format-time');

const { chatHasRollCallEndTime } = require('./utilities');
const { rollCallMinMinute, rollCallMaxMinute } = require('./constants');

class GroupSetStartMinuteCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(ctx, chatId, minute) {
    const userId = ctx.from.id;
    const chatMember = await ChatMemberRepository.getChatMember(chatId, userId);

    if (!chatMember || !chatMember.isChatAdministrator) {
      return;
    }

    if (!this._validateStartMinute(minute)) {
      return;
    }

    await this._trySettingStartMinute(ctx, chatId, minute);
  }

  async _trySettingStartMinute(ctx, chatId, minute) {
    const chat = await ChatRepository.getChatById(chatId);

    if (chatHasRollCallEndTime(chat) && !this._validateStartTimeOverEndTime(chat, chat.rollCallStartHour, minute)) {
      await this._replyStartTimeIsGreaterThanEndTimeError(ctx, chat, chat.rollCallStartHour, minute)
      return;
    }

    await ChatRepository.setChatRollCallStartMinute(chat, minute);
    await this._replyWithSuccessMessage(ctx, chat, chat.rollCallStartHour, minute);
  }

  async _replyStartTimeIsGreaterThanEndTimeError(ctx, chat, hour, minute) {
    const rollCallEndTime = formatTime(chat.rollCallEndHour, chat.rollCallEndMinute);
    const rollCallStartTime = formatTime(hour, minute);
    const message = trim(`
      Failed to set the roll call start minute to ${chat.chatName}.
      *Reason*: the roll call start time cannot be greater than the roll call end time (${rollCallEndTime} > ${rollCallStartTime})
    `);

    await ctx.reply(message);
  }

  async _replyWithSuccessMessage(ctx, chat, hour, minute) {
    const message = `The roll call start time for ${chat.chatName} is set to ${formatTime(hour, minute)}.`;
    await ctx.reply(message);
  }

  _validateStartTimeOverEndTime(chat, hour, minute) {
    return chat.rollCallEndHour > hour
      || (chat.rollCallEndHour === hour && chat.rollCallEndMinute > minute);
  }
  
  _validateStartMinute(minute) {
    return minute >= rollCallMinMinute
      && minute <= rollCallMaxMinute;
  }
}

module.exports = { GroupSetStartMinuteCommand };
