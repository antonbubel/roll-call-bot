const { UserRepository, ReplyRepository } = require('../../../database/repositories');
const buildUserDisplayName = require('../../../utilities/build-user-display-name');

class EndRollCallCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(chat) {
    const users = await this._getNotRepliedUsers(chat.chatId);
    const message = this._getRollCallEndMessage(users);
    
    await this._botInstance.telegram.sendMessage(chat.chatId, message, { parse_mode: 'Markdown' });
  }

  async _getNotRepliedUsers(chatId) {
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth();
    const currentDay = currentTime.getDate();
    
    const replies = await ReplyRepository.getRepliesByDate(chatId, currentYear, currentMonth, currentDay);
    const repliedUserIds = replies.map(reply => reply.userId);

    return await UserRepository.getChatUsersExcept(chatId, repliedUserIds);
  }

  _getRollCallEndMessage(users) {
    if (users.length) {
      return this._buildPingNotRepliedUsersMessage(users);
    }

    return this._getEveryoneRepliedMessage();
  }

  _getEveryoneRepliedMessage() {
    return `Everyone replied, have a nice day!`;
  }

  _buildPingNotRepliedUsersMessage(users) {
    const pings = users
      .map(user => `[${buildUserDisplayName(user)}](tg://user?id=${user.userId})`)
      .join(', ');

    return `${pings} have not replied in time :(`;
  }
}

module.exports = { EndRollCallCommand };
