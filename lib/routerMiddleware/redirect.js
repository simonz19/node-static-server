module.exports = ({ config } = {}) => {
  const { redirect, context = '' } = config;
  return next => async ctx => {
    const path = ctx.request.path;
    if (redirect && redirect.length > 0) {
      const to = redirect.reduce((prev, cur) => {
        if (prev) return prev;
        if (cur instanceof Array && cur[0] === path) {
          return cur[1] ? cur[1].to : context;
        }
        if (typeof cur === 'string' && cur === path) {
          return context;
        }
        return null;
      }, null);
      if (typeof to === 'string') {
        ctx.redirect(to);
        return;
      }
    }
    await next(ctx);
  };
};
