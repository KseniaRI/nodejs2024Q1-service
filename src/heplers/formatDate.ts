const pad = (n: number) => {
  if (n < 10) {
    return '0' + n;
  }
  return n;
};

export const formatDate = (currentTime: Date) => {
  return (
    currentTime.getUTCFullYear() +
    '-' +
    pad(currentTime.getUTCMonth() + 1) +
    '-' +
    pad(currentTime.getUTCDate()) +
    'T' +
    pad(currentTime.getUTCHours()) +
    ':' +
    pad(currentTime.getUTCMinutes()) +
    ':' +
    pad(currentTime.getUTCSeconds()) +
    '.' +
    (currentTime.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    'Z'
  );
};
