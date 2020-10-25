

const { Keyboard, Key } = require('telegram-keyboard');

const { ChatRepository, ChatMemberRepository } = require('../../../database/repositories');

const trim = require('../../../utilities/trim');
const isNull = require('../../../utilities/is-null');
const formatTime = require('../../../utilities/format-time');

const { buildChatChosenAction } = require('./utilities');

const {
  setRollCallStartTimeCommandName,
  setRollCallEndTimeCommandName,
  startRollCallCommandName,
  stopRollCallCommandName
} = require('../custom-commands');

class GroupInfoCommand {
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

    await this._replyWithChatInfo(ctx, chat);
    await this._replyWithActions(ctx, chat);
  }

  async _replyWithChatInfo(ctx, chat) {
    const chatMembers = await ChatMemberRepository.getChatMembers(chat.chatId);
    const chatInfoMessage = this._getChatInfoMessage(chat, chatMembers);

    await ctx.reply(chatInfoMessage, { parse_mode: 'Markdown' });
  }

  async _replyWithActions(ctx, chat) {
    const message = `You can edit the roll call settings for ${chat.chatName} using these shortcuts:`;
    const keys = [
      Key.callback(`Set roll call start time for ${chat.chatName}`, buildChatChosenAction(chat.chatId, setRollCallStartTimeCommandName)),
      Key.callback(`Set roll call end time for ${chat.chatName}`, buildChatChosenAction(chat.chatId, setRollCallEndTimeCommandName))
    ];

    if (chat.isActive) {
      keys.push(Key.callback(`Stop roll call in ${chat.chatName}`, buildChatChosenAction(chat.chatId, stopRollCallCommandName)));
    } else {
      keys.push(Key.callback(`Start roll call in ${chat.chatName}`, buildChatChosenAction(chat.chatId, startRollCallCommandName)));
    }
  
    await ctx.reply(message, Keyboard.make(keys).inline());
  }
  
  _getChatInfoMessage(chat, chatMembers) {
    const rollCallStatus = chat.isActive
      ? 'Active'
      : 'Inactive';

    const rollCallInactivityReason = chat.isActive
      ? ''
      : this._getChatInactivityReason(chat, chatMembers);

    return trim(`
      *Group chat name*: ${chat.chatName}
      *Group chat number of members*: ${chat.chatMembersCount}

      *Roll call start time*: ${this._hasRollCallStartTime(chat) ? this._getRollCallStartTime(chat) : '_Unavailable_'}
      *Roll call end time*: ${this._hasRollCallEndTime(chat) ? this._getRollCallEndTime(chat) : '_Unavailable_'}

      *Roll call status*: ${rollCallStatus}

      ${rollCallInactivityReason}
    `);
  }

  _getChatInactivityReason(chat, chatMembers) {
    const errors = [];

    if (!this._hasRollCallStartTime(chat)) {
      errors.push('The roll call start time is mandatory.');
    }

    if (!this._hasRollCallEndTime(chat)) {
      errors.push('The roll call end time is mandatory.');
    }

    if (chat.chatMembersCount - 1 > chatMembers.length) {
      errors.push('Bot is still learning about the group chat members.');
    }

    if (errors.length === 0) {
      return 'Inactivity reason: the roll call is turned off.';
    }

    if (errors.length === 1) {
      return `Inactivity reason: ${errors[0]}`;
    }

    return trim(`
      Inactivity reasons:
      ${errors.map(error => `+ ${error}`)}
    `);
  }

  _getRollCallStartTime(chat) {
    return formatTime(chat.rollCallStartHour, chat.rollCallStartMinute);
  }

  _getRollCallEndTime(chat) {
    return formatTime(chat.rollCallEndHour, chat.rollCallEndMinute);
  }

  _hasRollCallStartTime(chat) {
    return !isNull(chat.rollCallStartHour)
      && !isNull(chat.rollCallStartMinute);
  }

  _hasRollCallEndTime(chat) {
    return !isNull(chat.rollCallEndHour)
      && !isNull(chat.rollCallEndMinute);
  }
}

module.exports = { GroupInfoCommand };
