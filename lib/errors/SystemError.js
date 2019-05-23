const BaseError = require('./BaseError');

module.exports = class SystemError extends BaseError {
  constructor() {
    super('系统错误');
  }
};
