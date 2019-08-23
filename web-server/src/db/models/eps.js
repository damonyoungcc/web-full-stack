const Sequelize = require('sequelize');
const sequelize = require('../dbConn');

const persons = sequelize.define(
  'eps',
  {
    eventId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    personId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'eps',
  },
);

module.exports = persons;
