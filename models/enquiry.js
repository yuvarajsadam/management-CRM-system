const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enquiry = sequelize.define(
  'Enquiry',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    courseInterest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    claimedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    claimedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'enquiries',
    indexes: [{ fields: ['claimedBy'] }],
  }
);

module.exports = Enquiry;



