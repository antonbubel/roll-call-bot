
const Stage = require('telegraf/stage');

const { setupWizard, setupWizardId } = require('./setup-wizard');

module.exports = {
  stage: new Stage([setupWizard]),
  setupWizardId
};
