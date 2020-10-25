const { Keyboard, Key } = require('telegram-keyboard');

const { ChatRepository } = require('../../../database/repositories');

const { buildChatChosenAction } = require('./utilities');

class GroupsCommand {
  constructor(botInstance, nextCommand) {
    this._botInstance = botInstance;
    this._nextCommand = nextCommand;
  }

  async handle(ctx) {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    if (userId === chatId) {
      const chats = await ChatRepository.getChatsWhereUserIsAdministrator(userId);

      if (chats && chats.length) {
        await this._replyWithChatPicker(ctx, chats);
      } else {
        await this._replyNoChatsAvailable(ctx);
      }
    }
  }

  async _replyWithChatPicker(ctx, chats) {
    const message = 'Choose a group chat to edit.';
    const keyboard = Keyboard.make([
      ...chats.map(chat => Key.callback(chat.chatName, buildChatChosenAction(chat.chatId, this._nextCommand)))
    ]);

    await ctx.reply(message, keyboard.oneTime().inline());
  }

  async _replyNoChatsAvailable(ctx) {
    const message = 'No chats available.';
    await ctx.reply(message);
  }
}

module.exports = { GroupsCommand };
