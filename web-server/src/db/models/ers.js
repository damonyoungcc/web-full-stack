const Sequelize = require('sequelize');
const sequelize = require('../dbConn');

const persons = sequelize.define(
  'ers',
  {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      allowNull: false,
    },
    pid: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'ers',
  },
);

module.exports = persons;
