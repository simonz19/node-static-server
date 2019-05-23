const router = require('koa-router')();
const send = require('koa-send');
const cwd = process.cwd();
const paths = require('../config/paths')(cwd);
const config = require('../config')(cwd);
const { resolveApp } = paths;
const { context = '', src, middlewares: configMiddlewares } = config;
const compose = require('../utils/compose');
const resolveFilePath = require('../utils/resolveFilePath');
const redirectMiddleware = require('../routerMiddleware/redirect');

module.exports = () => {
  const middlewares = [redirectMiddleware, ...(configMiddlewares || [])];
  const chain = compose(...middlewares.map(mw => mw({ config, cwd })))(async ctx => {
    await send(ctx, resolveFilePath(ctx.request.path, context), {
      root: resolveApp(src)
    });
  });

  router.prefix(context);
  router.get('*', async ctx => {
    await chain(ctx);
  });
  return router.routes();
};
