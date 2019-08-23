const Sequelize = require('sequelize');
const sequelize = require('../dbConn');

const users = sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(50),
      allowNull: false,
      select: false,
    },
    auth: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    tableName: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
  },
);

module.exports = users;
