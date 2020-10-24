const { User, Reply, Chat, ChatMember } = require('./models');

const initializeDatabase = async () => {
  User.hasMany(ChatMember, { as: 'chatMembers', foreignKey: 'userId' });
  ChatMember.belongsTo(User, { foreignKey: 'userId' });

  Chat.hasMany(ChatMember, { as: 'chatMembers', foreignKey: 'chatId' })
  ChatMember.belongsTo(Chat, { foreignKey: 'chatId' });

  User.hasMany(Reply, { as: 'replies', foreignKey: 'userId' });
  Reply.belongsTo(User, { foreignKey: 'userId' });

  Chat.hasMany(Reply, { as: 'replies', foreignKey: 'chatId' });
  Reply.belongsTo(Chat, { foreignKey: 'chatId' });

  await Chat.sync({ force: false });
  await User.sync({ force: false });
  await ChatMember.sync({ force: false });
  await Reply.sync({ force: false });
}

module.exports = { initializeDatabase };
