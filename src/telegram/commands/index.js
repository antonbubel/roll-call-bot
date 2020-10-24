const commands = require('./commands');

const bindHandler = (botInstance, command, handlerInstance) => {
  if (command.updateType) {
    botInstance[command.method](command.updateType, handlerInstance.handle.bind(handlerInstance));
  } else {
    botInstance[command.method](handlerInstance.handle.bind(handlerInstance));
  }
};

const initialzeCommandHandler = (botInstance, command) => {
  const handlerInstance = new command.handler(botInstance);

  if (!handlerInstance.handle || typeof handlerInstance.handle !== 'function') {
    throw new Error(`Error while trying to initialize the command handler: commandHandler.handle is not a function.`);
  }

  if (!botInstance[command.method] || typeof botInstance[command.method] !== 'function') {
    throw new Error(`Error while trying to bind a command handler method: botInstance.${command.method} is not a function.`);
  }

  bindHandler(botInstance, command, handlerInstance);
};

const initializeCommandHandlers = (botInstance) => {
  commands.forEach(command => initialzeCommandHandler(botInstance, command));
};

module.exports = { initializeCommandHandlers };
