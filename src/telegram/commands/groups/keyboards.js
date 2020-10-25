
const { Keyboard, Key } = require('telegram-keyboard');

const { getDisplayHour } = require('../../../utilities/time');
const { buildChatChosenAction } = require('./utilities');

const { rollCallMinMinute, rollCallMaxMinute, rollCallMinutesStep } = require('./constants');

const createSelectHourKeyboard = (chatId, command, minHour, maxHour) => {
  const keys = [];

  for (let hour = minHour; hour <= maxHour; hour++) {
    const displayHour = getDisplayHour(hour);
    const keyboardKey = Key.callback(displayHour, buildChatChosenAction(chatId, command, hour));
  
    keys.push(keyboardKey);
  }

  return Keyboard.make(keys)
    .oneTime()
    .inline();
};

const createSelectMinuteKeyboard = (chatId, command) => {
  const keys = [];
  const minIndex = Math.floor(rollCallMinMinute / rollCallMinutesStep);
  const maxIndex = Math.floor(rollCallMaxMinute / rollCallMinutesStep);

  for (let index = minIndex; index < maxIndex; index++) {
    const displayMinute = index * rollCallMinutesStep;
    const keyboardKey = Key.callback(displayMinute || '00', buildChatChosenAction(chatId, command, displayMinute));

    keys.push(keyboardKey);
  }

  return Keyboard.make(keys)
    .oneTime()
    .inline();
}

module.exports = { createSelectHourKeyboard, createSelectMinuteKeyboard };
