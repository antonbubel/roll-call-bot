const commands = require('./commands');

const wrapHandler = (handlerInstance) => {
  return (...params) => {
    try {
      handlerInstance.handle.bind(handlerInstance)(...params);
    } catch (error) {
      console.error(error);
    }
  }
};

const bindHandler = (botInstance, command, handlerInstance) => {
  const handleMethod = wrapHandler(handlerInstance);

  if (command.updateType) {
    botInstance[command.method](command.updateType, handleMethod);
  } else {
    botInstance[command.method](handleMethod);
  }
};

const initialzeCommandHandler = (botInstance, command) => {
  const handlerInstance = command.extra && command.extra.length
    ? new command.handler(botInstance, ...command.extra)
    : new command.handler(botInstance);

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
