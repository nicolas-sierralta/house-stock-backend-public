/**
 * @fileoverview This file contains the route handlers for authentication functionalities such as login, registration, and password change.
 * It communicates with the authentication controller to handle user-related operations.
 * 
 * @namespace routes
 * @memberof module:auth-service
 */

const express = require('express');
const { register, login, changePassword } = require('../controllers/authController');

const router = express.Router();

/**
 * Route for user registration.
 * 
 * This route handles user registration by calling the `register` function from the authentication controller.
 * 
 * @name POST /register
 * @function
 * @memberof auth-service.authRoutes
 * @param {Object} req - The request object containing user registration details.
 * @param {Object} res - The response object to send the registration result.
 */
router.post('/register', register);

/**
 * Route for user login.
 * 
 * This route handles user login by calling the `login` function from the authentication controller.
 * 
 * @name POST /login
 * @function
 * @memberof auth-service.authRoutes
 * @param {Object} req - The request object containing user login credentials.
 * @param {Object} res - The response object to send the login result.
 */
router.post('/login', login);

/**
 * Route for changing user password.
 * 
 * This route handles changing a user's password by calling the `changePassword` function from the authentication controller.
 * 
 * @name PUT /changePassword
 * @function
 * @memberof auth-service.authRoutes
 * @param {Object} req - The request object containing user email, old password, and new password.
 * @param {Object} res - The response object to send the result of the password change operation.
 */
router.put('/changePassword', changePassword);

module.exports = router;
