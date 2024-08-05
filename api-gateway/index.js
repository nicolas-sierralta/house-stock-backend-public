/**
 * @fileoverview This file sets up and starts the API Gateway server using Express.
 * It configures various middleware such as CORS, JSON body parsing, and URL-encoded body parsing.
 * It also includes and configures routes for authentication, products, OCR, and users.
 * Each group of routes is protected by a JWT authentication middleware, except for the authentication routes.
 * Finally, it starts the server on the port specified in the environment variables.
 * 
 * @namespace api-gateway
 * @module api-gateway
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const ocrRoutes = require('./routes/ocr');
const userRoutes = require('./routes/user');
const { runTests } = require('./utils/test');
const authenticateJWT = require('./middleware/authenticateJWT');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * Middleware for handling authentication routes.
 * This sets up the route handler for all `/auth` endpoints.
 * 
 * @memberof api-gateway
 * @type {Function}
 */
app.use('/auth', authRoutes);

/**
 * Middleware for handling product routes with JWT authentication.
 * This sets up the route handler for all `/products` endpoints and applies JWT authentication.
 * 
 * @memberof api-gateway
 * @type {Function}
 */
app.use('/products', authenticateJWT, productRoutes);

/**
 * Middleware for handling OCR routes with JWT authentication.
 * This sets up the route handler for all `/ocr` endpoints and applies JWT authentication.
 * 
 * @memberof api-gateway
 * @type {Function}
 */
app.use('/ocr', authenticateJWT, ocrRoutes);

/**
 * Middleware for handling user routes with JWT authentication.
 * This sets up the route handler for all `/user` endpoints and applies JWT authentication.
 * 
 * @memberof api-gateway
 * @type {Function}
 */
app.use('/user', authenticateJWT, userRoutes);

/**
 * Starts the API Gateway server.
 * This function initializes the server and starts listening on the specified port.
 * It also runs tests after the server starts.
 * 
 * @memberof api-gateway
 * @param {number} port - The port number the server will listen on.
 * @returns {void}
 */
app.listen(port, '0.0.0.0', async () => {
  console.log(`API Gateway running on port ${port}`);
  await runTests();
});
