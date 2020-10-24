const mapChat = (chat, chatMembersCount, isActive = false) => ({
  chatId: chat.id,
  chatName: chat.title,
  chatMembersCount: chatMembersCount,
  isActive
});

module.exports = { mapChat };
