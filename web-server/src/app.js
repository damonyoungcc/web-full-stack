const Koa = require('koa');
const koabodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const cors = require('koa2-cors');
const routing = require('./routes');
const app = new Koa();
// 错误处理插件，只是为了让接口报错时，可以过滤掉大多数无用的堆栈错误信息
let errOptions = {
  preFormat: null,
  format: (err) => {
    return {
      stack: err.stack,
      status: err.status,
      message: err.message,
      success: false,
    };
  },
  postFormat: (e, { stack, ...rest }) =>
    process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
};

// 设置cors，允许前端跨域，前后端服务地址和端口不同，因为需要设置如此
app.use(
  cors({
    origin: 'http://localhost:3000',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }),
);
// koa框架的使用错误信息
app.use(error(errOptions));
// koa框架处理post请求body数据的插件
app.use(koabodyparser());
// koa校验接口入参的插件
app.use(parameter(app));
routing(app);

app.listen(8080, () => console.log('server running on port 8080...'));
