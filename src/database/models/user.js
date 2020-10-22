const { DataTypes } = require('sequelize');
const connection = require('../connection');

const User = connection.sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  username: {
    type: DataTypes.STRING
  },
  reminderHour: {
    type: DataTypes.INTEGER
  },
  reminderMinute: {
    type: DataTypes.INTEGER
  }
}, {
});

module.exports = { User };
