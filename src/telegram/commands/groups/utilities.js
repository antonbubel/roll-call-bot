const { groupChatActionPrefix } = require('./constants');

const buildChatChosenAction = (chatId, command) =>
  `${groupChatActionPrefix}-${chatId}-${command}`;

module.exports = { buildChatChosenAction };
