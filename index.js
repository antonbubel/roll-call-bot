const { initializeDatabase } = require('./src/database');
const Bot = require('./src/telegram/bot');
const Schedule = require('./src/telegram/schedule');

initializeDatabase()
  .then(async () => {
    await Bot.launch();
    await Schedule.launch();
  })
  .catch(console.error);
