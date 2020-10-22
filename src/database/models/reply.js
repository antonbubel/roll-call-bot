const { DataTypes } = require('sequelize');
const connection = require('../connection');

const Reply = connection.sequelize.define('Reply', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
});

module.exports = { Reply };
