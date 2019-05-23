module.exports = class BaseError {
  constructor(message) {
    this.success = false;
    this.message = message || '未知错误';
  }
};
