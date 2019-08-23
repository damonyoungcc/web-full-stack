const Sequelize = require('sequelize');
const sequelize = require('../dbConn');

const persons = sequelize.define(
  'persons',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    brief: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'persons',
  },
);

module.exports = persons;
