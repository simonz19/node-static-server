const { readFile, statSync, existsSync } = require('fs');
const { join, isAbsolute } = require('path');
const promisify = require('util.promisify');
const resolveFilePath = require('../utils/resolveFilePath');
const url = require('url');
const readFilePromise = promisify(readFile);

const QUERY_STRING_UNESCAPED = '$QUERY_STRING_UNESCAPED';

module.exports = ({ config, cwd } = {}) => {
  const { src, context = '' } = config;

  const calcIncludeFilePath = (filePath, includePath, querystring) => {
    let includeFilePath;
    if (includePath === QUERY_STRING_UNESCAPED) {
      const includeUrl = url.parse(querystring);
      const { pathname } = includeUrl;
      includeFilePath = join(cwd, src, pathname);
    } else {
      const includeUrl = url.parse(includePath);
      const { pathname } = includeUrl;
      if (isAbsolute(pathname)) {
        includeFilePath = join(cwd, src, resolveFilePath(pathname, context));
      } else {
        includeFilePath = join(filePath, '..', pathname);
      }
    }
    return includeFilePath;
  };

  const recursiveIncludeFile = async (filePath, querystring) => {
    const pattern = /<!--\s*#include\s+(file|virtual)\s*=\s*['"]\s*(.+?)\s*['"]\s*-->/g;
    if (existsSync(filePath) && !statSync(filePath).isDirectory()) {
      const content = await readFilePromise(filePath);
      let contentStr = content.toString();
      const execLoop = async () => {
        const matcher = pattern.exec(contentStr);
        if (!matcher) {
          return;
        }
        const [total, , includePath] = matcher;
        const includeFilePath = calcIncludeFilePath(filePath, includePath, querystring);
        const includeContentStr = await recursiveIncludeFile(includeFilePath);
        contentStr = contentStr.replace(total, includeContentStr);
        await execLoop();
      };
      await execLoop();
      return contentStr;
    }
    return '';
  };

  return next => async ctx => {
    const path = ctx.request.path;
    const querystring = ctx.request.querystring;
    if (!/.+(\.shtml)$/.test(path)) {
      await next(ctx);
      return;
    }
    const filePath = join(cwd, src, resolveFilePath(path, context));
    ctx.body = await recursiveIncludeFile(filePath, querystring);
  };
};
