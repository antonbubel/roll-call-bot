const { HelpCommand } = require('./help/help-command');
const { MessageCommand } = require('./message/message-command');
const { ReplyCommand } = require('./reply/reply-command');

const {
  replyCommandName
} = require('./custom-commands');

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
  },
  {
    method: 'action',
    updateType: replyCommandName,
    handler: ReplyCommand
  }
];
