const mapChat = (chat, chatMembersCount) => ({
  chatId: chat.id,
  chatName: chat.title,
  chatMembersCount: chatMembersCount || 0
});

module.exports = { mapChat };
