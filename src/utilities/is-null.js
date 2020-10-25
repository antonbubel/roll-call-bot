const isNull = (object) => !object
  && (typeof object === 'object' || typeof object === 'undefined');

module.exports = isNull;
