const groupChatActionPrefix = 'group-chat';
const groupChatActionRegEx = /^group-chat-(-?\d+)-(\w+)-?(\w+)?$/;
const groupRollCallMinStartHour = 8;
const groupRollCallMaxStartHour = 12;
const groupRollCallMinEndHour = 8;
const groupRollCallMaxEndHour = 12;

module.exports = {
  groupChatActionPrefix,
  groupChatActionRegEx,
  groupRollCallMinStartHour,
  groupRollCallMaxStartHour,
  groupRollCallMinEndHour,
  groupRollCallMaxEndHour
};
