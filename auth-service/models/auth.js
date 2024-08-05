/**
 * @fileoverview This file defines the User model for the authentication service using Sequelize.
 * The User model includes email and password fields.
 * 
 * @namespace models
 * @memberof module:auth-service
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

/**
 * Represents a user in the authentication service.
 * 
 * @typedef {Object} User
 * @property {string} email - The email of the user, which serves as the primary key.
 * @property {string} password - The password of the user.
 * 
 * @memberof auth-service.models
 */
const User = sequelize.define('User', {
  /**
   * The email of the user, serving as the primary key.
   * 
   * @type {DataTypes.STRING}
   * @memberof auth-service.models.User
   */
  email: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  /**
   * The password of the user.
   * 
   * @type {DataTypes.STRING}
   * @memberof auth-service.models.User
   */
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
