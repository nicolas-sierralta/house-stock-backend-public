/**
 * @fileoverview This file defines the User model for the user service using Sequelize.
 * The User model includes fields for email, full name, and date of birth.
 * @namespace models
 * @memberof module:user-service
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

/**
 * Represents a user in the user service.
 * 
 * @typedef {Object} User
 * @property {string} email - The email of the user, which serves as the primary key.
 * @property {string} fullName - The full name of the user.
 * @property {Date} dateOfBirth - The date of birth of the user.
 * 
 * @memberof user-service.models
 */
const User = sequelize.define('User', {
  /**
   * The email of the user, serving as the primary key.
   * @type {string}
   * @memberof user-service.models.User
   */
  email: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  /**
   * The full name of the user.
   * @type {string}
   * @memberof user-service.models.User
   */
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  /**
   * The date of birth of the user.
   * @type {Date}
   * @memberof user-service.models.User
   */
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
