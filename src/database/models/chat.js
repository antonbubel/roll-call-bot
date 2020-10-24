const { DataTypes } = require('sequelize');
const connection = require('../connection');

const Chat = connection.sequelize.define('Chat', {
  chatId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  chatName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chatMembersCount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
});

module.exports = { Chat };
