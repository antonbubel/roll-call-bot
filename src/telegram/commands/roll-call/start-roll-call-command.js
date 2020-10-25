const Markup = require('telegraf/markup');
const trim = require('../../../utilities/trim');

const { replyCommandName } = require('../custom-commands');

class StartRollCallCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(chat) {
    const rollCallStartMessage = this._getRollCallStartMessage(chat);
    const inlineKeyboard = this._getInlineKeyboardForReply();

    await this._botInstance.telegram.sendMessage(chat.chatId, rollCallStartMessage, inlineKeyboard);
  }

  _getRollCallStartMessage(chat) {
    return trim(`
      Hi ${chat.chatName}! The roll call is starting.
    `);
  }

  _getInlineKeyboardForReply() {
    const replyButton = Markup.callbackButton(`I'm here!`, replyCommandName);

    return Markup
      .inlineKeyboard([replyButton])
      .extra();
  }
}

module.exports = { StartRollCallCommand };
