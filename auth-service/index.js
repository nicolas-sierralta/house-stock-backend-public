/**
 * @fileoverview This file sets up and starts the Auth service using Express.
 * It configures the JSON body parsing middleware and includes the authentication routes.
 * The server listens on the port specified in the environment variables.
 * 
 * @namespace auth-service
 * @module auth-service
 */

const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

/**
 * Routes for authentication-related operations.
 * 
 * This route includes all the endpoints related to user authentication.
 * 
 * @memberof auth-service
 */
app.use('/', authRoutes);

/**
 * Health check endpoint.
 * 
 * This endpoint provides a simple health check to ensure the service is running.
 * 
 * @function
 * @memberof auth-service
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * Starts the Auth service server.
 * 
 * This function starts the server and listens on the port specified in the environment variables.
 * 
 * @function
 * @memberof auth-service
 * @param {number} port - The port number the server will listen on.
 * @returns {void}
 */
app.listen(port, async () => {
  console.log(`Auth service running on port ${port}`);
});
