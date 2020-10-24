const schedule = require('node-schedule');

const Bot = require('../bot');

const { ChatRepository } = require('../../database/repositories');

const createStartRollCallJob = () => {
  return schedule
    .scheduleJob(`*/1 * * * 1-5`, async () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      const chats = await ChatRepository.getActiveChatsWhereRollCallShouldStart(currentHour, currentMinute);

      if (chats && chats.length) {
        await Promise.all(chats.map(Bot.startRollCall.bind(Bot)));
      }
    });
}

module.exports = { createStartRollCallJob };
