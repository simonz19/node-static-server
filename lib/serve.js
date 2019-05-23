const Koa = require('koa');
const http = require('http');
const chalk = require('chalk');
const bodyparser = require('koa-bodyparser');
const cors = require('koa-cors');
const logger = require('koa-logger');
const converter = require('koa-convert');
const config = require('./config')(process.cwd());
const errorHandler = require('./middleware/errorHandler');
const chalkWapper = require('./utils/chalkWapper');
const routeHandler = require('./middleware/routeHandler');

const app = new Koa();

app.use(errorHandler());
app.use(
  converter(
    cors({
      headers: [
        'Content-Type',
        'Authorization',
        'Access-Control-Request-Origin',
        'X-Requested-With',
        'Cache-Control'
      ],
      credentials: true
    })
  )
);
app.use(bodyparser());
app.use(logger());
app.use(routeHandler());

const httpServer = http.createServer(app.callback());
httpServer.listen(config.port, () => {
  chalkWapper(chalk.cyan)(`front server started sucessfully on http://localhost:${config.port}`);
});
