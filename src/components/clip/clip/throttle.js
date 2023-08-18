const throttle = (func, mustRun) => {
  let timeout = null;
  return (...args) => {
    if (timeout) {
      return;
    }
    timeout = setTimeout(() => {
      func.apply(this, args);
      timeout = null;
    }, mustRun);
  }
}

export default throttle;