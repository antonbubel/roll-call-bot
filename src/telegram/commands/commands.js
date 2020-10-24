const { HelpCommand } = require('./help/help-command');
const { MessageCommand } = require('./message/message-command');

module.exports = [
  {
    method: 'start',
    handler: HelpCommand
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
