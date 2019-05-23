module.exports = (path, context) => path.replace(new RegExp(`^${context}`), '');
