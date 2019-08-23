const Sequelize = require('sequelize');
const sequelize = require('../dbConn');

const events = sequelize.define(
  'events',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    createtime: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    content: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'events',
  },
);
module.exports = events;
