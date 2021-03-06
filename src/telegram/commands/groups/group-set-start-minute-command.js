const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

const trim = require('../../../utilities/trim');
const formatTime = require('../../../utilities/format-time');

const { chatHasRollCallEndTime, validateMinute, validateStartTimeOverEndTime } = require('./utilities');

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

    if (!validateMinute(minute)) {
      return;
    }

    await this._trySettingStartMinute(ctx, chatId, minute);
  }

  async _trySettingStartMinute(ctx, chatId, minute) {
    const chat = await ChatRepository.getChatById(chatId);

    if (chatHasRollCallEndTime(chat) && !validateStartTimeOverEndTime(chat.rollCallEndHour, chat.rollCallEndMinute, chat.rollCallStartHour, minute)) {
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
      *Reason*: the roll call start time cannot be greater than the roll call end time (${rollCallEndTime} >= ${rollCallStartTime})
    `);

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  async _replyWithSuccessMessage(ctx, chat, hour, minute) {
    const message = `The roll call start time for ${chat.chatName} is set to ${formatTime(hour, minute)}.`;
    await ctx.reply(message);
  }
}

module.exports = { GroupSetStartMinuteCommand };
