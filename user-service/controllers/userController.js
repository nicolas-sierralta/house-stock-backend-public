/**
 * @fileoverview This file contains the controller functions for user operations such as creating, retrieving, and updating user information.
 * @namespace controllers
 * @memberof module:user-service
 */

const User = require('../models/user');
require('dotenv').config();

/**
 * Registers a new user.
 * 
 * @async
 * @function create
 * @memberof user-service.controllers
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.fullName - The full name of the user.
 * @param {Date} req.body.dateOfBirth - The date of birth of the user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const create = async (req, res) => {
  const { email, fullName, dateOfBirth } = req.body;

  try {
    if (!email || !fullName || !dateOfBirth) {
      return res.status(400).send('All fields are required');
    }

    await User.create({ email, fullName, dateOfBirth });
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

/**
 * Retrieves a user's information by email.
 * 
 * @async
 * @function get
 * @memberof user-service.controllers
 * @param {Object} req - The request object.
 * @param {Object} req.params - The URL parameters.
 * @param {string} req.params.email - The email of the user to retrieve.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const get = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

/**
 * Updates a user's information by email.
 * 
 * @async
 * @function update
 * @memberof user-service.controllers
 * @param {Object} req - The request object.
 * @param {Object} req.params - The URL parameters.
 * @param {string} req.params.email - The email of the user to update.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.fullName - The new full name of the user.
 * @param {Date} req.body.dateOfBirth - The new date of birth of the user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const update = async (req, res) => {
  const { email } = req.params;
  const { fullName, dateOfBirth } = req.body;

  try {
    if (!fullName || !dateOfBirth) {
      return res.status(400).send('All fields are required');
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      user.fullName = fullName;
      user.dateOfBirth = dateOfBirth;
      await user.save();
      res.status(200).send('User updated');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

module.exports = {
  create,
  get,
  update,
};
