const schedule = require('node-schedule');

const { Op } = require("sequelize");
const { User, Reply } = require('../../database/models');

const Bot = require('../bot');
const { rollCallHour, rollCallMinute } = require('../constants/roll-call');

const createRollCallJob = () => {
  return schedule
    .scheduleJob(`${rollCallMinute} ${rollCallHour} * * 1-5`, async () => {
      const replies = await Reply.findAll({ attributes: ['userId'] });
      const userIds = replies.map(reply => reply.userId);
      
      const users = await User.findAll({ where: { userId: { [Op.notIn]: userIds } } })

      Bot.pingGroupChatUsers(users);

      await Reply.destroy({ where: { userId: { [Op.in]: userIds } } });
    });
}

module.exports = { createRollCallJob };
