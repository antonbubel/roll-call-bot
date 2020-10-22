const { Telegraf } = require('telegraf');
const session = require('telegraf/session');
const { stage, setupWizardId } = require('./scenes');
const { rollCallHour, rollCallMinute } = require('./constants/roll-call');
const { User, Reply } = require('../database/models');

class Bot {
  static _botInstance;

  constructor() {
    const botToken = this._getBotToken();
    this._initializeBot(botToken);
  }

  async launch() {
    await this._botInstance.launch();
  }

  async sendReminder(userId) {
    await this._botInstance.telegram.sendMessage(userId, 'Good morning! Please enter /here to complete the roll call.');
  }

  async pingGroupChatUsers(users) {
    const groupChatId = this._getGroupChatId();
    const pingMessage = users.length
      ? this._buildPingMessage(users)
      : `Everyone replied, have a nice day!`;

    this._botInstance.telegram.sendMessage(groupChatId, pingMessage, { parse_mode: 'Markdown' });
  }

  _buildPingMessage(users) {
    const pings = users
      .map(user => `[${this._buildDisplayName(user.username, user.firstName, user.lastName)}](tg://user?id=${user.userId})`)
      .join(', ');

    return `${pings} have not replied in time :(`;
  }

  _initializeBot(botToken) {
    if (!this._botInstance) {
      this._botInstance = new Telegraf(botToken);
      this._botInstance.use(session());
      this._botInstance.use(stage.middleware());
      this._botInstance.start(this._handleStartCommand.bind(this));
      this._botInstance.command('edittime', this._handleEditTimeCommand.bind(this));
      this._botInstance.command('here', this._handleHereCommand.bind(this));
    }
  }

  _getBotToken() {
    return process.env.ROLL_BOT_TOKEN;
  }

  _getGroupChatId() {
    return process.env.ROLL_BOT_GROUP_CHAT_ID;
  }

  _buildDisplayName(username, firstName, lastName) {
    if (firstName) {
      return `${firstName} ${lastName}`.trim();
    }

    if (username) {
      return username;
    }

    return '';
  }

  async _handleStartCommand(ctx) {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;
    const user = await User.findOne({ where: { userId: userId } });

    if (userId !== chatId) {
      await this._handleStartFromGroupChat(user, userId);
    } else {
      await this._handleStartFromPrivateChat(ctx, user, userId);
    }
  }

  async _handleEditTimeCommand(ctx) {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;
    const user = await User.findOne({ where: { userId: userId } });

    if (!user && userId !== chatId) {
      await this._handleStartFromGroupChat(user, userId);
      return;
    }

    if (!user && userId === chatId) {
      await this._handleStartFromPrivateChat(ctx, user, userId);
      return;
    }
    
    await ctx.scene.enter(setupWizardId);
  }

  async _handleHereCommand(ctx) {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;
    const user = await User.findOne({ where: { userId: userId } });

    if (!user && userId !== chatId) {
      await this._handleStartFromGroupChat(user, userId);
      return;
    }

    if (!user && userId === chatId) {
      await this._handleStartFromPrivateChat(ctx, user, userId);
      return;
    }

    await this._checkTimeAndHandleSaveReply(ctx, userId);
  }

  async _handleStartFromGroupChat(user, userId) {
    if (user) {
      const displayName = this._buildDisplayName(user.username, user.firstName, user.lastName);
      await this._botInstance.telegram.sendMessage(userId, `Hi ${displayName}! If you want to edit your reminder time, please enter /edittime.`);
    } else {
      await this._botInstance.telegram.sendMessage(userId, 'Hi! Please enter /start to set up your reminder time.');
    }
  }

  async _handleStartFromPrivateChat(ctx, user, userId) {
    const { username, first_name, last_name } = await ctx.getChat();
    const displayName = this._buildDisplayName(username, first_name, last_name);

    if (!user) {
      const newUser = await User.build({ userId, username, firstName: first_name, lastName: last_name });
      await newUser.save();
      
      await ctx.reply(`Hi ${displayName}!`);
      await ctx.scene.enter(setupWizardId);
    } else {
      await ctx.reply(`Hi ${displayName}! If you want to edit your reminder time, please enter /edittime.`);
    }
  }

  async _checkTimeAndHandleSaveReply(ctx, userId) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    if (currentHour > rollCallHour || (currentHour == rollCallHour && currentMinute >= rollCallMinute)) {
      await this._handleLateReply(ctx);
    } else {
      await this._handleSaveReply(ctx, userId);
    }
  }

  async _handleLateReply(ctx) {
    await ctx.reply(`The roll call is over, see you tomorrow.`);
  }

  async _handleSaveReply(ctx, userId) {
    const reply = await Reply.findOne({ where: { userId: userId } });

    if (!reply) {
      const newReply = await Reply.build({ userId });
      await newReply.save();
      
      await ctx.reply('Thank you for the reply! Have a nice day!');
    } else {
      await ctx.reply('You have already replied to the bot today.');
    }
  }
}

module.exports = new Bot();
