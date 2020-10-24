const { DataTypes } = require('sequelize');
const connection = require('../connection');

const ChatMember = connection.sequelize.define('ChatMember', {
  chatId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  isChatAdministrator: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
});

module.exports = { ChatMember };
