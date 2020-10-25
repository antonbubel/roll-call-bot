const { Keyboard, Key } = require('telegram-keyboard');

const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

const trim = require('../../../utilities/trim');
const { getDisplayHour } = require('../../../utilities/time');

const { buildChatChosenAction, getRollCallScheduleInfo } = require('./utilities');
const { groupRollCallMinStartHour, groupRollCallMaxStartHour } = require('./constants');

const { setRollCallStartHourCommandName } = require('../custom-commands');

class GroupSetStartTimeCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(ctx, chatId) {
    const userId = ctx.from.id;
    const chatMember = await ChatMemberRepository.getChatMember(chatId, userId);

    if (!chatMember || !chatMember.isChatAdministrator) {
      return;
    }

    await this._replyWithRollCallScheduleInfo(ctx, chatId);
    await this._replyWithHourPicker(ctx, chatId);
  }

  async _replyWithRollCallScheduleInfo(ctx, chatId) {
    const chat = await ChatRepository.getChatById(chatId);
    const scheduleInfoMessage = trim(`
      The roll call schedule for ${chat.chatName}:
      ${getRollCallScheduleInfo(chat)}
    `)

    await ctx.reply(scheduleInfoMessage, { parse_mode: 'Markdown' });
  }

  async _replyWithHourPicker(ctx, chatId) {
    const message = 'Select roll call start hour:'
    const keys = [];

    for (let hour = groupRollCallMinStartHour; hour <= groupRollCallMaxStartHour; hour++) {
      const displayHour = getDisplayHour(hour);
      keys.push(Key.callback(displayHour, buildChatChosenAction(chatId, setRollCallStartHourCommandName, hour)));
    }

    await ctx.reply(message, Keyboard.make(keys).oneTime().inline());
  }
}

module.exports = { GroupSetStartTimeCommand };
