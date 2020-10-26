const { initializeDatabase } = require('./database');
const Bot = require('./telegram/bot');
const Schedule = require('./telegram/schedule');

const initializeRollCallBot = () => {
  if (!process.env.TZ) {
    const warningMessage = `NODE TZ environment variable is not set, the bot will consume server timezone instead.`;
    console.warn(warningMessage);
  } else {
    const infoMessage = `The bot will use the timezone defined in the NODE TZ environement variable. TZ=${process.env.TZ}`;
    console.info(infoMessage);
  }

  if (!process.env.ROLL_CALL_BOT_CONNECTION_STRING) {
    const errorMessage = 'The connection string cannot be found, please specify the connection string in the environment variables, environment variable key: ROLL_CALL_BOT_CONNECTION_STRING';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!process.env.ROLL_CALL_BOT_TOKEN) {
    const errorMessage = 'Telegram bot token cannot be found, please specify the token in the environment variables, environment variable key: ROLL_CALL_BOT_TOKEN';
    console.error(errorMessage);
    throw new Error(errorMessage);    
  }

  initializeDatabase()
    .then(async () => {
      await Bot.launch();
      await Schedule.launch();
    })
    .catch(console.error);
};

module.exports = { initializeRollCallBot };
