const { Sequelize } = require('sequelize');

class Connection {
  constructor() {
    const connectionString = this._getConnectionString();
    this._initializeSequelize(connectionString);
  }

  get sequelize() {
    return this._sequelize;
  }

  _initializeSequelize(connectionString) {
    if (!this._sequelize) {
      this._sequelize = new Sequelize(connectionString);
    }
  }

  _getConnectionString() {
    return process.env.ROLL_CALL_BOT_CONNECTION_STRING;
  }
}

module.exports = new Connection();
