const { User, Reply } = require('./models');

const initializeDatabase = async () => {
  Reply.belongsTo(User);

  await User.sync({ force: false });
  await Reply.sync({ force: false });
}

module.exports = { initializeDatabase };
