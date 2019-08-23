const { mysqlConfig } = require('../config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, {
  host: mysqlConfig.host,
  dialect: 'mysql',
  pool: {
    max: 100,
    min: 0,
    idle: 10000,
  },
});
module.exports = sequelize;
