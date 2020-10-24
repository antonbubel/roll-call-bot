const trim = require('../../../utilities/trim');

const {
  editGroupsCommandName,
  setRollCallStartTimeCommandName,
  setRollCallEndTimeCommandName,
  setRollCallDaysCommandName,
  startRollCallCommandName,
  stopRollCallCommandName
} = require('../custom-commands');

class HelpCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
  }

  async handle(ctx) {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    if (userId === chatId) {
      const helpMessage = this._getHelpMessage();
      ctx.reply(helpMessage, { parse_mode: 'Markdown' });
    }
  }

  _getHelpMessage() {
    return trim(`
      I can help you with creating and managing roll calls in the Group Chats.

      You can control me by sending these commands:

      /${editGroupsCommandName} - edit your groups

      *Roll call settings:*
      /${setRollCallStartTimeCommandName} - set the start time of your roll call
      /${setRollCallEndTimeCommandName} - set the end time of your roll call
      /${setRollCallDaysCommandName} - set roll call days of the week

      *Start/Stop roll calls:*
      /${startRollCallCommandName} - start roll call
      /${stopRollCallCommandName} - stop roll call
    `);
  }
}

module.exports = { HelpCommand };
