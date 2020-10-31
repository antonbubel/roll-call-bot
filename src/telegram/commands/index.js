const commands = require('./commands');

const wrapHandler = (commandMethod, handlerInstance) => {
  return async (...params) => {
    let isError = false;
    const [ctx] = params;

    try {
      await handlerInstance.handle.bind(handlerInstance)(...params);
    } catch (error) {
      isError = true;
      console.error(error);
    }

    await answerCallbackQuery(commandMethod, isError, ctx);
  }
};

const answerCallbackQuery = async (commandMehtod, isError, ctx) => {
  if (commandMehtod === 'action') {
    try {
      if (isError) {
        await ctx.answerCbQuery('Sorry, the error has occurred while trying to process your request.')
      } else {
        await ctx.answerCbQuery();
      }
    } catch (error) {
      console.error(error);
    }
  }
}

const bindHandler = (botInstance, command, handlerInstance) => {
  const handleMethod = wrapHandler(command.method, handlerInstance);

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
