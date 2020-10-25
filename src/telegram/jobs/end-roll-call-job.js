const schedule = require('node-schedule');

const Bot = require('../bot');

const { ChatRepository } = require('../../database/repositories');

const createEndRollCallJob = () => {
  return schedule
    .scheduleJob(`*/1 * * * 1-5`, async () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      const chats = await ChatRepository.getActiveChatsWhereRollCallShouldEnd(currentHour, currentMinute);

      if (chats && chats.length) {
        await Promise.all(chats.map(Bot.endRollCall.bind(Bot)));
      }
    });
}

module.exports = { createEndRollCallJob };