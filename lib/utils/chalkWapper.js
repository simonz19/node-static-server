module.exports = fn => {
  return msg => console.log(typeof fn === 'function' ? fn(msg) : msg);
};
