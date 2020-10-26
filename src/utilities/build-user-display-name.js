const buildUserDisplayName = ({ username, firstName, lastName }) => {
  if (firstName) {
    return `${firstName} ${lastName || ''}`.trim();
  }

  if (username) {
    return username;
  }

  return '';
}

module.exports = buildUserDisplayName;
