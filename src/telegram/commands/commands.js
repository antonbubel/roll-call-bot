const { StartCommand } = require('./start/start-command');
const { HelpCommand } = require('./help/help-command');
const { MessageCommand } = require('./message/message-command');

module.exports = [
  {
    method: 'start',
    handler: StartCommand
  },
  {
    method: 'help',
    handler: HelpCommand
  },
  {
    method: 'on',
    updateType: 'message',
    handler: MessageCommand
  }
];
