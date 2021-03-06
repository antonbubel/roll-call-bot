const { DataTypes } = require('sequelize');
const connection = require('../connection');

const Reply = connection.sequelize.define('Reply', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  replyYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  replyMonth: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  replyDay: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
});

module.exports = { Reply };
