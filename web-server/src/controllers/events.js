const events = require('../db/models/events');
const eps = require('../db/models/eps');
const ers = require('../db/models/ers');
const persons = require('../db/models/persons');
const { SuccessModel, ErrorModel } = require('../model/resModel');
// 设置查询时的关系
events.belongsTo(ers, { foreignKey: 'id', as: 'pid' });
events.hasMany(eps, { foreignKey: 'eventId', as: 'personIds' });

class EventsCtl {
  // 创建事件
  async create(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      content: { type: 'string', required: true },
      createtime: { type: 'number', required: true },
      pid: { type: 'number', required: false },
      persons: { type: 'array', required: true },
      description: { type: 'string', required: true },
    });
    const { title, content, createtime, pid = -1, persons = [], description } = ctx.request.body;
    // 添加events表
    const step1 = await events.create({ title, content, createtime });
    const { id } = step1.dataValues;

    const ersData = { id, pid, description };
    // 添加事件关系表 ers
    await ers.create(ersData);

    let epsData = [];
    // 添加事件人员关系表 eps
    if (persons && persons.length) {
      persons.forEach((item) => {
        epsData.push({ eventId: id, personId: item });
      });
    }
    const finalResult = await eps.bulkCreate(epsData);
    if (finalResult) {
      ctx.body = new SuccessModel('新增事件成功');
    }
  }

  // 查询
  async findAll(ctx) {
    const eventsData = await events.findAll({
      where: {},
      include: [
        {
          model: eps,
          as: 'personIds',
          attributes: ['personId'],
        },
        {
          model: ers,
          attributes: [['pid', 'id'], 'description'],
          as: 'pid',
        },
      ],
    });
    ctx.body = new SuccessModel(eventsData);
  }

  // 编辑
  async update(ctx) {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      pid: { type: 'number', required: false },
      title: { type: 'string', required: true },
      content: { type: 'string', required: true },
      createtime: { type: 'number', required: true },
      persons: { type: 'array', required: true },
      description: { type: 'string', required: true },
    });
    const { pid, id, title, content, createtime, description, persons = [] } = ctx.request.body;
    // 更新events事件表
    const result0 = await events.update(
      { createtime, title, content },
      {
        where: { id },
      },
    );
    // 更新ers表
    const result1 = await ers.update(
      { pid, description },
      {
        where: { id },
      },
    );
    // 删除eps表
    const result2 = await eps.destroy({
      where: {
        eventId: id,
      },
    });
    // 新增eps表
    let epsData = [];
    // 添加事件人员关系表 eps
    if (persons && persons.length) {
      persons.forEach((item) => {
        epsData.push({ eventId: id, personId: item });
      });
    }
    const finalResult = await eps.bulkCreate(epsData);

    ctx.body = new SuccessModel('更新成功');
  }

  // 删除最深层层级的子事件
  async delete(ctx) {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { id } = ctx.request.body;
    const result0 = await events.destroy({
      where: {
        id,
      },
    });

    const result1 = await eps.destroy({
      where: {
        eventId: id,
      },
    });
    const result2 = await ers.destroy({
      where: {
        id,
      },
    });

    ctx.body = new SuccessModel('删除成功');
  }

  // 判断是否有权限（auth=1）
  async checkAuthUser(ctx, next) {
    if (ctx.state.user.auth !== 1) {
      ctx.body = new ErrorModel('没有权限');
      return;
    }
    await next();
  }

  // 判断事件title是否已经存在
  async isExistEventTitle(ctx, next) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
    });
    const { title } = ctx.request.body;
    const result = await events.findOne({
      where: {
        title,
      },
    });
    if (result) {
      ctx.body = new ErrorModel('事件title已存在');
      return;
    }
    await next();
  }
}

module.exports = new EventsCtl();
