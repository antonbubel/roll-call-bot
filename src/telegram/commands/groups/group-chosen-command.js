const { GroupInfoCommand } = require('./group-info-command');
const { GroupStartRollCallCommand } = require('./group-start-roll-call-command');
const { GroupStopRollCallCommand } = require('./group-stop-roll-call-command');
const { GroupSetStartTimeCommand } = require('./group-set-start-time-command');
const { GroupSetStartHourCommand } = require('./group-set-start-hour-command');
const { GroupSetStartMinuteCommand } = require('./group-set-start-minute-command');
const { GroupSetEndTimeCommand } = require('./group-set-end-time-command');
const { GroupSetEndHourCommand } = require('./group-set-end-hour-command');

const {
  groupInfoCommandName,
  setRollCallStartTimeCommandName,
  setRollCallStartHourCommandName,
  setRollCallStartMinuteCommandName,
  setRollCallEndTimeCommandName,
  setRollCallEndHourCommandName,
  setRollCallEndMinuteCommandName,
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
      [setRollCallStartTimeCommandName]: new GroupSetStartTimeCommand(botInstance),
      [setRollCallStartHourCommandName]: new GroupSetStartHourCommand(botInstance),
      [setRollCallStartMinuteCommandName]: new GroupSetStartMinuteCommand(botInstance),
      [setRollCallEndTimeCommandName]: new GroupSetEndTimeCommand(botInstance),
      [setRollCallEndHourCommandName]: new GroupSetEndHourCommand(botInstance),
      [setRollCallEndMinuteCommandName]: null,
      [startRollCallCommandName]: new GroupStartRollCallCommand(botInstance),
      [stopRollCallCommandName]: new GroupStopRollCallCommand(botInstance)
    };
  }

  async handle(ctx) {
    const [, chatId, command, extraParam] = ctx.match;

    if (!this._handlers[command]) {
      await ctx.reply('Command not found.');
      return;
    }
    
    await this._handlers[command].handle(ctx, chatId, extraParam);
  }
}

module.exports = { GroupChosenCommand };
