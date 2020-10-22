const schedule = require('node-schedule');

const { Op } = require("sequelize");
const { User } = require('../../database/models');

const Bot = require('../bot');

const createReminderJob = () => {
  return schedule
    .scheduleJob(`*/1 * * * 1-5`, async () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      const users = await User.findAll({
        where: {
          [Op.and]: [
            { reminderHour: currentHour },
            { reminderMinute: currentMinute }
          ]
        }
      })

      await Promise.all(users.map(async user => await Bot.sendReminder(user.userId)))
    });
}

module.exports = { createReminderJob };
