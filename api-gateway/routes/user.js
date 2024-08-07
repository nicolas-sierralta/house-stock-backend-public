/**
 * @fileoverview This file contains the route handlers for user management operations such as changing passwords and updating user information.
 * It communicates with the authentication service and user service to handle these operations.
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
 * Route handler for changing a user's password.
 * 
 * This endpoint sends the old and new password data to the authentication service to update a user's password.
 * 
 * @function
 * @memberof module:api-gateway/routes/user
 * @param {Object} req - The request object, which should include the email, oldPassword, and newPassword in the body.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.put('/changePassword', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        const response = await axios.put(`${authServiceUrl}/changePassword`, {
            email,
            oldPassword,
            newPassword
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error changing password:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

/**
 * Route handler for retrieving a user's information by email.
 * 
 * This endpoint fetches user data from the user service using the email provided in the request parameters.
 * 
 * @function
 * @memberof module:api-gateway/routes/user
 * @param {Object} req - The request object, which should include the email as a URL parameter.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.get('/:email', async (req, res) => {
    try {
        const response = await axios.get(`${userServiceUrl}/user/${req.params.email}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

/**
 * Route handler for updating a user's information by email.
 * 
 * This endpoint sends the updated user data to the user service to modify a user's information.
 * 
 * @function
 * @memberof module:api-gateway/routes/user
 * @param {Object} req - The request object, which should include the email as a URL parameter and updated user data in the body.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.put('/:email', async (req, res) => {
    const { fullName, dateOfBirth } = req.body;
    try {
        const response = await axios.put(`${userServiceUrl}/user/${req.params.email}`, {
            fullName,
            dateOfBirth
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

module.exports = router;
