const { formatHour, getTwelveHourPeriod } = require('./time');

const formatTime = (hour, minute) => {
  const hours = formatHour(hour);
  const minutes = `${minute}`.length === 1
    ? `0${minute}`
    : minute;

  return `${hours}:${minutes} ${getTwelveHourPeriod(hour)}`;
}

module.exports = formatTime;
