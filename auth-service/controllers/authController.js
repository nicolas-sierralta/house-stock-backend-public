/**
 * @fileoverview This file contains the controller functions for authentication operations such as registering, logging in users, and changing passwords.
 * @namespace controllers
 * @memberof module:auth-service
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/auth');
require('dotenv').config();

/**
 * Registers a new user.
 * 
 * @function register
 * @memberof auth-service.authController
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

/**
 * Logs in a user.
 * 
 * @function login
 * @memberof auth-service.authController
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send(error.message);
  }
};

/**
 * Changes a user's password.
 * 
 * @function changePassword
 * @memberof auth-service.authController
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.oldPassword - The old password of the user.
 * @param {string} req.body.newPassword - The new password of the user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).send('Email, old password, and new password are required');
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).send('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.send('Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

module.exports = {
  register,
  login,
  changePassword,
};
