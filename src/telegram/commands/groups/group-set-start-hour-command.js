const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

const trim = require('../../../utilities/trim');

const { createSelectMinuteKeyboard } = require('./keyboards');
const { chatHasRollCallEndTime } = require('./utilities');
const { getDisplayHour } = require('../../../utilities/time');

const { setRollCallStartMinuteCommandName } = require('../custom-commands');
const { groupRollCallMinStartHour, groupRollCallMaxStartHour } = require('./constants');

class GroupSetStartHourCommand {
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

    if (chatHasRollCallEndTime(chat) && !this._validateStartHourOverEndHour(chat, hour)) {
      await this._replyStartHourIsGreaterThanEndHourError(ctx, chat, hour)
      return;
    }

    await ChatRepository.setChatRollCallStartHour(chat, hour);
    await this._replyWithSuccessMessage(ctx, chat, hour);
    await this._replyWithMinutePicker(ctx, chat.chatId);
  }

  async _replyStartHourIsGreaterThanEndHourError(ctx, chat, hour) {
    const message = trim(`
      Failed to set the roll call start hour to ${chat.chatName}.
      *Reason*: the roll call start hour cannot be greater than the roll call end hour (${getDisplayHour(hour)} > ${getDisplayHour(chat.rollCallEndHour)})
    `);

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  async _replyWithSuccessMessage(ctx, chat, hour) {
    const message = `The roll call start hour for ${chat.chatName} is set to ${getDisplayHour(hour)}.`;
    await ctx.reply(message);
  }

  async _replyWithMinutePicker(ctx, chatId) {
    const message = 'Select roll call start minute:'
    const keyboard = createSelectMinuteKeyboard(chatId, setRollCallStartMinuteCommandName);

    await ctx.reply(message, keyboard);
  }

  _validateStartHourOverEndHour(chat, hour) {
    return chat.rollCallEndHour >= hour;
  }

  _validateStartHour(hour) {
    return hour >= groupRollCallMinStartHour
      && hour <= groupRollCallMaxStartHour;
  }
}

module.exports = { GroupSetStartHourCommand }
