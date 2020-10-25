const formatTime = (hour, minute) => {
  const isPM = hour >= 12;
  const hours = hour % 12 || 12;
  const minutes = `${minute}`.length === 1
    ? `0${minute}`
    : minute;

  return `${hours}:${minutes} ${isPM ? 'PM' : 'AM'}`;
}

module.exports = formatTime;
