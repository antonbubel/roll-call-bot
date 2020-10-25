
const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

const trim = require('../../../utilities/trim');

const { createSelectMinuteKeyboard } = require('./keyboards');
const { chatHasRollCallStartTime } = require('./utilities');
const { getDisplayHour } = require('../../../utilities/time');

const { setRollCallEndMinuteCommandName } = require('../custom-commands');
const { groupRollCallMinEndHour, groupRollCallMaxEndHour } = require('./constants');

class GroupSetEndHourCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(ctx, chatId, hour) {
    const userId = ctx.from.id;
    const chatMember = await ChatMemberRepository.getChatMember(chatId, userId);

    if (!chatMember || !chatMember.isChatAdministrator) {
      return;
    }

    if (!this._validateStartHour(hour)) {
      return;
    }

    await this._trySettingStartHour(ctx, chatId, hour);
  }

  async _trySettingStartHour(ctx, chatId, hour) {
    const chat = await ChatRepository.getChatById(chatId);

    if (chatHasRollCallStartTime(chat) && !this._validateEndHourOverStartHour(chat, hour)) {
      await this._replyEndHourIsLessThanStartHourError(ctx, chat, hour)
      return;
    }

    await ChatRepository.setChatRollCallEndHour(chat, hour);
    await this._replyWithSuccessMessage(ctx, chat, hour);
    await this._replyWithMinutePicker(ctx, chat.chatId);
  }

  async _replyEndHourIsLessThanStartHourError(ctx, chat, hour) {
    const message = trim(`
      Failed to set the roll call end hour to ${chat.chatName}.
      *Reason*: the roll call end hour cannot be less than the roll call start hour (${getDisplayHour(hour)} < ${getDisplayHour(chat.rollCallStartHour)})
    `);

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  async _replyWithSuccessMessage(ctx, chat, hour) {
    const message = `The roll call end hour for ${chat.chatName} is set to ${getDisplayHour(hour)}.`;
    await ctx.reply(message);
  }

  async _replyWithMinutePicker(ctx, chatId) {
    const message = 'Select roll call end minute:'
    const keyboard = createSelectMinuteKeyboard(chatId, setRollCallEndMinuteCommandName);

    await ctx.reply(message, keyboard);
  }

  _validateEndHourOverStartHour(chat, hour) {
    return chat.rollCallStartHour <= hour;
  }

  _validateStartHour(hour) {
    return hour >= groupRollCallMinEndHour
      && hour <= groupRollCallMaxEndHour;
  }
}

module.exports = { GroupSetEndHourCommand };
