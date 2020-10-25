const { GroupInfoCommand } = require('./group-info-command');

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
      [groupInfoCommandName]: new GroupInfoCommand(botInstance)
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
