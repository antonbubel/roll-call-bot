const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

const trim = require('../../../utilities/trim');
const formatTime = require('../../../utilities/format-time');

const { chatHasRollCallStartTime, validateMinute, validateStartTimeOverEndTime } = require('./utilities');

class GroupSetEndMinuteCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(ctx, chatId, minute) {
    const userId = ctx.from.id;
    const chatMember = await ChatMemberRepository.getChatMember(chatId, userId);

    if (!chatMember || !chatMember.isChatAdministrator) {
      return;
    }

    if (!validateMinute(minute)) {
      return;
    }

    await this._trySettingEndMinute(ctx, chatId, minute);
  }

  async _trySettingEndMinute(ctx, chatId, minute) {
    const chat = await ChatRepository.getChatById(chatId);

    if (chatHasRollCallStartTime(chat) && !validateStartTimeOverEndTime(chat.rollCallEndHour, minute, chat.rollCallStartHour, chat.rollCallStartMinute)) {
      await this._replyStartTimeIsGreaterThanEndTimeError(ctx, chat, chat.rollCallStartHour, minute)
      return;
    }

    await ChatRepository.setChatRollCallEndMinute(chat, minute);
    await this._replyWithSuccessMessage(ctx, chat, chat.rollCallEndHour, minute);
  }

  async _replyStartTimeIsGreaterThanEndTimeError(ctx, chat, hour, minute) {
    const rollCallEndTime = formatTime(hour, minute);
    const rollCallStartTime = formatTime(chat.rollCallStartHour, chat.rollCallStartMinute);
    const message = trim(`
      Failed to set the roll call end minute to ${chat.chatName}.
      *Reason*: the roll call start time cannot be greater than the roll call end time (${rollCallEndTime} >= ${rollCallStartTime})
    `);

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  async _replyWithSuccessMessage(ctx, chat, hour, minute) {
    const message = `The roll call end time for ${chat.chatName} is set to ${formatTime(hour, minute)}.`;
    await ctx.reply(message);
  }
}

module.exports = { GroupSetEndMinuteCommand };
