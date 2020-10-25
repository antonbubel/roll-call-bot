const groupChatActionPrefix = 'group-chat';
const groupChatActionRegEx = /^group-chat-(-?\d+)-(\w+)-?(\w+)?$/;
const groupRollCallMinStartHour = 8;
const groupRollCallMaxStartHour = 12;
const groupRollCallMinEndHour = 8;
const groupRollCallMaxEndHour = 12;
const rollCallMinMinute = 0;
const rollCallMaxMinute = 60;
const rollCallMinutesStep = 15;

module.exports = {
  groupChatActionPrefix,
  groupChatActionRegEx,
  groupRollCallMinStartHour,
  groupRollCallMaxStartHour,
  groupRollCallMinEndHour,
  groupRollCallMaxEndHour,
  rollCallMinMinute,
  rollCallMaxMinute,
  rollCallMinutesStep
};
