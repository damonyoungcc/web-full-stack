const persons = require('../db/models/persons');
const jsonwebtoken = require('jsonwebtoken');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { tokenSecret } = require('../config');

class PersonCtl {
  // 新增
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      brief: { type: 'string', required: true },
    });
    const result = await persons.create(ctx.request.body);
    ctx.body = new SuccessModel(result);
  }

  // 查询
  async findAll(ctx) {
    const result = await persons.findAll();
    ctx.body = new SuccessModel(result);
  }

  // 删除
  async delete(ctx) {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { id } = ctx.request.body;
    const result = await persons.destroy({
      where: {
        id,
      },
    });
    ctx.body = new SuccessModel({ delRow: result });
  }

  // 更新
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      brief: { type: 'string', required: false },
      id: { type: 'number', required: true },
    });
    const { name, id, brief } = ctx.request.body || {};
    const result = await persons.update(
      { name, brief },
      {
        where: { id },
      },
    );
    ctx.body = new SuccessModel(ctx.request.body);
  }

  // 判断是否有权限（auth=1）
  async checkAuthUser(ctx, next) {
    if (ctx.state.user.auth !== 1) {
      ctx.body = new ErrorModel('没有权限');
      return;
    }
    await next();
  }

  // 判断person是否存在
  async checkPersonExist(ctx, next) {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { id } = ctx.request.body;
    const person = await persons.findOne({
      where: {
        id,
      },
    });
    if (!person) {
      ctx.body = new ErrorModel('用户不存在！');
      return;
    }
    await next();
  }
}

module.exports = new PersonCtl();
