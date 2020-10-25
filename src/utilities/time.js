const isPostMeridiemHour = (hour) =>
  hour >= 12;

const getTwelveHourPeriod = (hour) => isPostMeridiemHour(hour)
  ? 'PM'
  : 'AM';

const formatHour = (hour) =>
  hour % 12 || 12;

const getDisplayHour = (hour) =>
  `${formatHour(hour)} ${getTwelveHourPeriod(hour)}`;

module.exports = { isPostMeridiemHour, getTwelveHourPeriod, formatHour, getDisplayHour };
