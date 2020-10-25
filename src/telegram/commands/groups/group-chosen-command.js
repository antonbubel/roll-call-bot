const { GroupInfoCommand } = require('./group-info-command');
const { GroupStartRollCallCommand } = require('./group-start-roll-call-command');
const { GroupStopRollCallCommand } = require('./group-stop-roll-call-command');

const {
  groupInfoCommandName,
  setRollCallStartTimeCommandName,
  setRollCallEndTimeCommandName,
  startRollCallCommandName,
  stopRollCallCommandName
} = require('../custom-commands');

class GroupChosenCommand {
  constructor(botInstance) {
    this._botInstance = botInstance;
    this._initializeHandlers(botInstance);
  }

  _initializeHandlers(botInstance) {
    this._handlers = {
      [groupInfoCommandName]: new GroupInfoCommand(botInstance),
      [setRollCallStartTimeCommandName]: null,
      [setRollCallEndTimeCommandName]: null,
      [startRollCallCommandName]: new GroupStartRollCallCommand(botInstance),
      [stopRollCallCommandName]: new GroupStopRollCallCommand(botInstance)
    };
  }

  async handle(ctx) {
    const [, chatId, command] = ctx.match;

    if (!this._handlers[command]) {
      await ctx.reply('Command not found.');
      return;
    }
    
    await this._handlers[command].handle(ctx, chatId);
  }
}

module.exports = { GroupChosenCommand };
