/**
 * @fileoverview This file defines the routes for user management operations such as registration, retrieval, and updating of user information.
 * It uses the controller functions to handle these operations.
 * @namespace routes
 * @memberof module:user-service
 */

const express = require('express');
const { create, get, update } = require('../controllers/userController');

const router = express.Router();

/**
 * Route for user registration.
 * 
 * @name POST /register
 * @function
 * @memberof user-service.routes
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing user data.
 * @param {Object} res - The response object.
 */
router.post('/register', create);

/**
 * Route for retrieving user information by email.
 * 
 * @name GET /user/:email
 * @function
 * @memberof user-service.routes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The URL parameters containing the email of the user.
 * @param {Object} res - The response object.
 */
router.get('/user/:email', get);

/**
 * Route for updating user information by email.
 * 
 * @name PUT /user/:email
 * @function
 * @memberof user-service.routes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The URL parameters containing the email of the user.
 * @param {Object} req.body - The body of the request containing updated user data.
 * @param {Object} res - The response object.
 */
router.put('/user/:email', update);

module.exports = router;
