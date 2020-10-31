const { groupChatActionPrefix, rollCallMinMinute, rollCallMaxMinute } = require('./constants');

const isNull = require('../../../utilities/is-null');
const trim = require('../../../utilities/trim');
const formatTime = require('../../../utilities/format-time');

const buildChatChosenAction = (chatId, command, param) =>
  `${groupChatActionPrefix}-${chatId}-${command}${!isNull(param) ? `-${param}` : ''}`;

const chatSettingsAreValid = (chat, chatMembers) => chatHasRollCallStartTime(chat)
  && chatHasRollCallEndTime(chat)
  && allChatMembersAvailabe(chat, chatMembers);

const chatHasRollCallStartTime = (chat) => !isNull(chat.rollCallStartHour)
  && !isNull(chat.rollCallStartMinute);

const chatHasRollCallEndTime = (chat) => !isNull(chat.rollCallEndHour)
  && !isNull(chat.rollCallEndMinute);

const getUnknownUsersCount = (chat, chatMembers) =>
  chat.chatMembersCount - chatMembers.length - 1;

const allChatMembersAvailabe = (chat, chatMembers) =>
  getUnknownUsersCount(chat, chatMembers) === 0;

const getRollCallStartTime = (chat) =>
  formatTime(chat.rollCallStartHour, chat.rollCallStartMinute); 

const getRollCallEndTime = (chat) =>
  formatTime(chat.rollCallEndHour, chat.rollCallEndMinute);

const validateMinute = (minute) => minute >= rollCallMinMinute
  && minute < rollCallMaxMinute;

const validateStartTimeOverEndTime = (endHour, endMinute, startHour, startMinute) => endHour > startHour
  || (endHour === startHour && endMinute > startMinute);

const getRollCallScheduleInfo = (chat) => trim(`
  *Roll call start time*: ${chatHasRollCallStartTime(chat) ? getRollCallStartTime(chat) : '_Undefined_'}
  *Roll call end time*: ${chatHasRollCallEndTime(chat) ? getRollCallEndTime(chat) : '_Undefined_'}
`);

const getChatInactivityReason = (chat, chatMembers) => {
  const errors = [];

  if (!chatHasRollCallStartTime(chat)) {
    errors.push('The roll call start time is mandatory.');
  }

  if (!chatHasRollCallEndTime(chat)) {
    errors.push('The roll call end time is mandatory.');
  }

  if (!allChatMembersAvailabe(chat, chatMembers)) {
    const unknownUsersCount = getUnknownUsersCount(chat, chatMembers);
    const errorMessage = unknownUsersCount > 1
      ? `Bot is still learning about the group chat members: there're ${unknownUsersCount} users bot doesn't know about.`
      : `Bot is still learning about the group chat members: there's ${unknownUsersCount} user bot doesn't know about.`

    errors.push(errorMessage);
  }

  if (errors.length === 0) {
    return 'Inactivity reason: the roll call is turned off.';
  }

  if (errors.length === 1) {
    return `Inactivity reason: ${errors[0]}`;
  }

  return trim(`
    Inactivity reasons:
    ${errors.map(error => `- ${error}`).join('\n')}
  `);
}

module.exports = {
  buildChatChosenAction,
  chatSettingsAreValid,
  chatHasRollCallStartTime,
  chatHasRollCallEndTime,
  allChatMembersAvailabe,
  getUnknownUsersCount,
  getRollCallStartTime,
  getRollCallEndTime,
  getRollCallScheduleInfo,
  getChatInactivityReason,
  validateMinute,
  validateStartTimeOverEndTime
};
