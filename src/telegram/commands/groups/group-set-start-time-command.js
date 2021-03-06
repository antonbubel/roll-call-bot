const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

const trim = require('../../../utilities/trim');

const { createSelectHourKeyboard } = require('./keyboards');
const { getRollCallScheduleInfo } = require('./utilities');

const { setRollCallStartHourCommandName } = require('../custom-commands');
const { groupRollCallMinStartHour, groupRollCallMaxStartHour } = require('./constants');

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
    const keyboard = createSelectHourKeyboard(
      chatId,
      setRollCallStartHourCommandName,
      groupRollCallMinStartHour,
      groupRollCallMaxStartHour);

    await ctx.reply(message, keyboard);
  }
}

module.exports = { GroupSetStartTimeCommand };
