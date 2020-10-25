const { Telegraf } = require('telegraf');
const session = require('telegraf/session');
const { stage } = require('./scenes');

const { initializeCommandHandlers } = require('./commands');

const { StartRollCallCommand } = require('./commands/roll-call/start-roll-call-command');
const { EndRollCallCommand } = require('./commands/roll-call/end-roll-call-command');

class Bot {
  constructor() {
    const botToken = this._getBotToken();
    this._initializeBot(botToken);
  }

  async launch() {
    await this._botInstance.launch();
  }

  async startRollCall(chat) {
    this._startRollCallCommand.handle(chat);
  }

  async endRollCall(chat) {
    this._endRollCallCommand.handle(chat);
  }

  async _initializeBot(botToken) {
    if (!this._botInstance) {
      this._botInstance = new Telegraf(botToken);
      this._startRollCallCommand = new StartRollCallCommand(this._botInstance);
      this._endRollCallCommand = new EndRollCallCommand(this._botInstance);

      this._botInstance.use(session());
      this._botInstance.use(stage.middleware());

      initializeCommandHandlers(this._botInstance);
    }
  }

  _getBotToken() {
    return process.env.ROLL_BOT_TOKEN;
  }
}

module.exports = new Bot();
