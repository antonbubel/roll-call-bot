const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const Composer = require('telegraf/composer')
const { User } = require('../../database/models');
const reminders = require('../constants/reminders');

const setupWizardId = 'setup-wizard';

const createReminderId = (reminder) =>
  `reminder-${reminder.hours}:${reminder.minutes}`;

const getReminderDisplayTime = (reminder) =>
  `${reminder.hours}:${reminder.minutes || '00'}`;

const createReminderButton = (reminder) =>
  Markup.callbackButton(getReminderDisplayTime(reminder), createReminderId(reminder));

const handleReminderAction = async (reminder, ctx) => {
  ctx.reply(`Ok, I'll be reminding you at ${getReminderDisplayTime(reminder)} on weekdays. Have a nice day!`);

  const userId = ctx.from.id;
  const user = await User.findOne({ where: { userId: userId } });

  user.reminderHour = reminder.hours;
  user.reminderMinute = reminder.minutes;

  await user.save();
  
  return ctx.scene.leave()
}

const reminderTimeSelectedHandler = new Composer()

reminders.forEach(reminder => {
  reminderTimeSelectedHandler.action(createReminderId(reminder), (ctx) => handleReminderAction(reminder, ctx));
})

const setupWizard = new WizardScene(
  setupWizardId,
  ctx => {
    ctx.reply(
      'In what time I should remind you?',
      Markup.inlineKeyboard([...reminders.map(createReminderButton)]
    ).extra())

    return ctx.wizard.next();
  },
  reminderTimeSelectedHandler
);

module.exports = { setupWizardId, setupWizard };
