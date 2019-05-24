const { existsSync } = require('fs');
const { resolve } = require('path');

module.exports = cwd => {
  const config = {
    port: 8081,
    context: ''
  };
  const appConfigPath = resolve(cwd, '.serverrc.js');
  if (existsSync(appConfigPath)) {
    return {
      ...config,
      ...require(appConfigPath)
    };
  }
  return {
    ...config
  };
};
