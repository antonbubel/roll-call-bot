const { groupChatActionPrefix } = require('./constants');

const isNull = require('../../../utilities/is-null');
const trim = require('../../../utilities/trim');

const buildChatChosenAction = (chatId, command) =>
  `${groupChatActionPrefix}-${chatId}-${command}`;

const chatSettingsAreValid = (chat, chatMembers) => chatHasRollCallStartTime(chat)
  && chatHasRollCallEndTime(chat)
  && allChatMembersAvailabe(chat, chatMembers);

const chatHasRollCallStartTime = (chat) => !isNull(chat.rollCallStartHour)
  && !isNull(chat.rollCallStartMinute);

const chatHasRollCallEndTime = (chat) => !isNull(chat.rollCallEndHour)
  && !isNull(chat.rollCallEndMinute);

const allChatMembersAvailabe = (chat, chatMembers) =>
  chat.chatMembersCount - 1 === chatMembers.length;

const getChatInactivityReason = (chat, chatMembers) => {
  const errors = [];

  if (!chatHasRollCallStartTime(chat)) {
    errors.push('The roll call start time is mandatory.');
  }

  if (!chatHasRollCallEndTime(chat)) {
    errors.push('The roll call end time is mandatory.');
  }

  if (!allChatMembersAvailabe(chat, chatMembers)) {
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

module.exports = {
  buildChatChosenAction,
  chatSettingsAreValid,
  chatHasRollCallStartTime,
  chatHasRollCallEndTime,
  allChatMembersAvailabe,
  getChatInactivityReason
};
