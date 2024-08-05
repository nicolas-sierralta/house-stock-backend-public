/**
 * @fileoverview This file contains the route handlers for user registration and login.
 * It communicates with the authentication service and user service to handle user-related operations.
 * The routes defined here are `/register` for user registration and `/login` for user login.
 * 
 * @namespace routes
 * @memberof module:api-gateway
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

const authServiceUrl = process.env.AUTH_SERVICE_URL;
const userServiceUrl = process.env.USER_SERVICE_URL;

/**
 * Route handler for user registration.
 * 
 * This endpoint processes registration data by sending it to both the authentication service and the user service.
 * 
 * @function
 * @memberof module:api-gateway/routes
 * @param {Object} req - The request object, which should include `email`, `password`, `fullName`, and `dateOfBirth` in the body.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName, dateOfBirth } = req.body;

        const authData = { email, password };
        const userData = { email, fullName, dateOfBirth };

        const authResponse = await axios.post(`${authServiceUrl}/register`, authData);
        const userResponse = await axios.post(`${userServiceUrl}/register`, userData);

        res.status(201).json({
            authService: authResponse.data,
            userService: userResponse.data
        });
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data : error.message;
        res.status(status).json({ error: message });
    }
});

/**
 * Route handler for user login.
 * 
 * This endpoint processes login data by sending it to the authentication service.
 * 
 * @function
 * @memberof module:api-gateway/routes
 * @param {Object} req - The request object, which should include `email` and `password` in the body.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${authServiceUrl}/login`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

module.exports = router;




