const getCurrentTimestamp = (): number =>
  Math.floor(new Date().getTime() / 1000);

export default getCurrentTimestamp;
