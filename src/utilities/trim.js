const trim = (string) => string
  .split('\n')
  .map(substring => substring.replace(/\s+/g, ' ').trim())
  .join('\n');

module.exports = trim;
