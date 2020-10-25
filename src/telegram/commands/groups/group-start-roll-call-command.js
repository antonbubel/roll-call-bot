
const { Keyboard, Key } = require('telegram-keyboard');

const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

const trim = require('../../../utilities/trim');

const {
  buildChatChosenAction,
  chatSettingsAreValid,
  getChatInactivityReason,
  chatHasRollCallStartTime,
  chatHasRollCallEndTime
} = require('./utilities');

const {
  setRollCallStartTimeCommandName,
  setRollCallEndTimeCommandName
} = require('../custom-commands');

class GroupStartRollCallCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(ctx, chatId) {
    const userId = ctx.from.id;
    const chatMember = await ChatMemberRepository.getChatMember(chatId, userId);

    if (!chatMember || !chatMember.isChatAdministrator) {
      return;
    }

    const chat = await ChatRepository.getChatById(chatId);
    const chatMembers = await ChatMemberRepository.getChatMembers(chatId);
    const success = await this._validateChatSettingsAndSetActive(chat, chatMembers);

    await this._handleSetChatActiveResult(ctx, chat, chatMembers, success);
  }

  async _validateChatSettingsAndSetActive(chat, chatMembers) {
    if (chatSettingsAreValid(chat, chatMembers)) {
      await ChatRepository.setChatActive(chat, true);

      return true;
    }

    return false;
  }

  async _handleSetChatActiveResult(ctx, chat, chatMembers, success) {
    if (success) {
      await this._replySetChatActiveSuccess(ctx, chat);
    } else {
      await this._replySetChatActiveError(ctx, chat, chatMembers);
      await this._replySetChatActiveErrorActions(ctx, chat);
    }
  }

  async _replySetChatActiveSuccess(ctx, chat) {
    const successMessage = `Success! The roll call was enabled for the ${chat.chatName}.`;

    await ctx.reply(successMessage);
  }

  async _replySetChatActiveError(ctx, chat, chatMembers) {
    const failureMessage = trim(`
      Failed to start the roll call for ${chat.chatName}.
      ${getChatInactivityReason(chat, chatMembers)}
    `);

    await ctx.reply(failureMessage, { parse_mode: 'Markdown' });
  }

  async _replySetChatActiveErrorActions(ctx, chat) {
    const message = `Here's what you can do to get the roll call enabled for ${chat.chatName}:`;
    const keys = [];

    if (!chatHasRollCallStartTime(chat)) {
      keys.push(Key.callback(`Set roll call start time for ${chat.chatName}`, buildChatChosenAction(chat.chatId, setRollCallStartTimeCommandName)));
    }

    if (!chatHasRollCallEndTime(chat)) {
      keys.push(Key.callback(`Set roll call end time for ${chat.chatName}`, buildChatChosenAction(chat.chatId, setRollCallEndTimeCommandName))); 
    }

    if (keys.length) {
      await ctx.reply(message, Keyboard.make(keys).inline());
    }
  }
}

module.exports = { GroupStartRollCallCommand };
