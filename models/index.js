const { sequelize } = require('../config/database');
const Employee = require('./employee');
const Enquiry = require('./enquiry');

// Associations
Enquiry.belongsTo(Employee, {
  as: 'claimer',
  foreignKey: 'claimedBy',
});

Employee.hasMany(Enquiry, {
  as: 'claimedEnquiries',
  foreignKey: 'claimedBy',
});

module.exports = {
  sequelize,
  Employee,
  Enquiry,
};



