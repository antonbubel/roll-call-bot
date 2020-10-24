const { Reply } = require('../models');
const { Op } = require('sequelize');

class ReplyRepository {
  async createReply({ chatId, userId, replyYear, replyMonth, replyDay }) {
    return await Reply.create({
      userId,
      chatId,
      replyYear,
      replyMonth,
      replyDay
    });
  }

  async getUserReplyByDate({ chatId, userId, replyYear, replyMonth, replyDay }) {
    return await Reply.findOne({
      where: {
        [Op.and]: [
          { chatId: chatId },
          { userId: userId },
          { replyYear: replyYear },
          { replyMonth: replyMonth },
          { replyDay: replyDay }
        ]
      }
    });
  }

  async getRepliesByDate(chatId, replyYear, replyMonth, replyDay) {
    return await Reply.findAll({
      where: {
        [Op.and]: [
          { chatId: chatId },
          { replyYear: replyYear },
          { replyMonth: replyMonth },
          { replyDay: replyDay }
        ]
      }
    });
  }
}

module.exports = new ReplyRepository();
