const users = require('../db/models/users');
const jsonwebtoken = require('jsonwebtoken');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { tokenSecret } = require('../config');
class UsersCtl {
  // 登录
  async login(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });
    const user = await users.findOne({
      where: ctx.request.body,
    });
    if (!user) {
      ctx.body = new ErrorModel('用户名或者密码不正确！');
      return;
    }
    const { username, id, auth } = user;
    const token = jsonwebtoken.sign({ id, username, auth }, tokenSecret, { expiresIn: '10d' });
    ctx.body = new SuccessModel({ token }, '登录成功');
  }

  // 注册
  async register(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
      auth: { type: 'number', required: false },
    });
    await users.create(ctx.request.body);
    ctx.body = new SuccessModel('注册成功');
  }

  // 查询所有用户列表
  async findAll(ctx) {
    const result = await users.findAll();
    ctx.body = new SuccessModel(result);
  }

  // 删除某个特定用户
  async delete(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      id: { type: 'number', required: true },
    });
    const { username } = ctx.request.body;
    if (username === ctx.state.user.username) {
      ctx.body = new ErrorModel('不能删除自己');
      return;
    }
    const result = await users.destroy({
      where: ctx.request.body,
    });
    ctx.body = new SuccessModel({ delRow: result });
  }

  // 更新用户权限
  async update(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      id: { type: 'number', required: true },
      auth: { type: 'number', required: true },
    });
    const { username, id, auth } = ctx.request.body;
    if (username === ctx.state.user.username) {
      ctx.body = new ErrorModel('不能修改自己的权限');
      return;
    }
    const result = await users.update(
      { auth },
      {
        where: { id, username },
      },
    );
    ctx.body = new SuccessModel(ctx.request.body);
  }

  // 检查是否是admin用户登录
  async checkAdmin(ctx, next) {
    if (ctx.state.user.username !== 'admin') {
      ctx.body = new ErrorModel('没有权限');
      return;
    }
    await next();
  }

  // 拿到当前登录信息
  async getUserInfo(ctx) {
    const { username, auth } = ctx.state.user;
    ctx.body = new SuccessModel({ username, auth });
  }

  // 查询是否存在
  async checkUserExist(ctx, next) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      id: { type: 'number', required: true },
    });
    const { username, id } = ctx.request.body;
    const user = await users.findOne({
      where: {
        username,
        id,
      },
    });
    if (!user) {
      ctx.body = new ErrorModel('用户不存在！');
      return;
    }
    await next();
  }

  // 查询特定username的用户
  async findByUserName(ctx, next) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
    });
    const username = ctx.request.body.username;
    const user = await users.findOne({
      where: {
        username,
      },
    });
    if (user) {
      ctx.body = new ErrorModel('用户名已存在');
      return;
    } else {
      ctx.body = new SuccessModel('用户名可注册');
    }
    await next();
  }
}

module.exports = new UsersCtl();
