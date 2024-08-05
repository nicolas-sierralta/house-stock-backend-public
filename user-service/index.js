/**
 * @fileoverview This file sets up and starts the User service using Express.
 * It configures the JSON body parsing middleware and includes the user-related routes.
 * The server listens on the port specified in the environment variables.
 * @namespace user-service
 * @module user-service
 */

const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT;

/**
 * Middleware to parse incoming JSON requests.
 * @memberof user-service
 */
app.use(express.json());

/**
 * Routes for user-related operations.
 * @memberof user-service
 */
app.use('/', userRoutes);

/**
 * Health check endpoint.
 * @memberof user-service
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * Starts the User service server.
 * @memberof user-service
 * @param {number} port - The port number the server will listen on.
 */
app.listen(port, async () => {
  console.log(`User service running on port ${port}`);
});