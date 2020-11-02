const { HelpCommand } = require('./help/help-command');
const { MessageCommand } = require('./reply/message-command');
const { ReplyCommand } = require('./reply/reply-command');
const { GroupsCommand } = require('./groups/groups-command');
const { GroupChosenCommand } = require('./groups/group-chosen-command');
const { groupChatActionRegEx } = require('./groups/constants');

const {
  replyCommandName,
  editGroupsCommandName,
  groupInfoCommandName,
  setRollCallStartTimeCommandName,
  setRollCallEndTimeCommandName,
  startRollCallCommandName,
  stopRollCallCommandName
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
    method: 'action',
    updateType: replyCommandName,
    handler: ReplyCommand
  },
  {
    method: 'action',
    updateType: groupChatActionRegEx,
    handler: GroupChosenCommand
  },
  {
    method: 'command',
    updateType: editGroupsCommandName,
    handler: GroupsCommand,
    extra: [groupInfoCommandName]
  },
  {
    method: 'command',
    updateType: setRollCallStartTimeCommandName,
    handler: GroupsCommand,
    extra: [setRollCallStartTimeCommandName]
  },
  {
    method: 'command',
    updateType: setRollCallEndTimeCommandName,
    handler: GroupsCommand,
    extra: [setRollCallEndTimeCommandName]
  },
  {
    method: 'command',
    updateType: startRollCallCommandName,
    handler: GroupsCommand,
    extra: [startRollCallCommandName]
  },
  {
    method: 'command',
    updateType: stopRollCallCommandName,
    handler: GroupsCommand,
    extra: [stopRollCallCommandName]
  },
  {
    method: 'on',
    updateType: 'message',
    handler: MessageCommand
  }
];
