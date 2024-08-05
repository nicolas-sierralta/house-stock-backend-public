/**
 * @fileoverview This file sets up and starts the Product service using Express.
 * It configures middleware for JSON and URL-encoded body parsing, sets default response headers,
 * and includes the product routes. The server listens on the port specified in the environment variables.
 * @namespace product-service
 * @module product-service
 */

const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT;

/**
 * Middleware for parsing URL-encoded bodies.
 * 
 * @memberof product-service
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware for parsing JSON bodies.
 * 
 * @memberof product-service
 */
app.use(express.json());

/**
 * Middleware for setting default response headers.
 * 
 * @memberof product-service
 */
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

/**
 * Routes for product-related operations.
 * @memberof product-service
 */
app.use('/', productRoutes);

/**
 * Health check endpoint.
 * @memberof product-service
 */
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

/**
 * Starts the Product service server.
 * @memberof product-service
 * @param {number} port - The port number the server will listen on.
 */
app.listen(port, () => {
    console.log(`Product service running on port ${port}`);
});
