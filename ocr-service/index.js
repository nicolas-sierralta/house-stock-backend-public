/**
 * @fileoverview This file sets up and starts the OCR service using Express.
 * It configures the routes related to OCR functionality and includes a health check endpoint.
 * The server listens on the port specified in the environment variables.
 * @namespace ocr-service
 * @module ocr-service
 */

const express = require('express');
require('dotenv').config();
const ocrRoutes = require('./routes/ocrRoutes');

const app = express();
const port = process.env.PORT;

/**
 * Routes for OCR-related operations.
 * @memberof ocr-service
 */
app.use('/api/ocr', ocrRoutes);

/**
 * Health check endpoint.
 * @memberof ocr-service
 */
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

/**
 * Starts the OCR service server.
 * @memberof ocr-service
 * @param {number} port - The port number the server will listen on.
 */
app.listen(port, () => {
    console.log(`OCR service running on port ${port}`);
});
