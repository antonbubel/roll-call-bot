const { Sequelize } = require('sequelize');

class Connection {
  constructor() {
    const options = this._getSequelizeOptions();
    this._initializeSequelize(options);
  }

  get sequelize() {
    return this._sequelize;
  }

  _initializeSequelize(options) {
    if (!this._sequelize) {
      this._sequelize = new Sequelize(options);
    }
  }

  _getSequelizeOptions() {
    return {
      dialect: 'sqlite',
      storage: process.env.ROLL_CALL_BOT_CONNECTION_STRING
    };
  }
}

module.exports = new Connection();
