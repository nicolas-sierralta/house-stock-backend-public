/**
 * @fileoverview This file contains the route handler for uploading a ticket image to the OCR service.
 * It uses the multer middleware for handling file uploads and communicates with the OCR service
 * to process the uploaded ticket image.
 * 
 * @namespace routes
 * @memberof module:api-gateway
 */

const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const router = express.Router();

const ocrServiceUrl = process.env.OCR_SERVICE_URL;

const upload = multer({ dest: 'uploads/' });

/**
 * Route handler for uploading a ticket image.
 * 
 * This endpoint processes file uploads using multer, creates a form with the uploaded file,
 * and sends it to the OCR service for processing. It handles the response and errors accordingly.
 * 
 * @function
 * @memberof module:api-gateway/routes
 * @param {Object} req - The request object, which should include the file in the `ticket` field.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.post('/upload', upload.single('ticket'), async (req, res) => {
    try {
        const form = new FormData();
        form.append('ticket', fs.createReadStream(req.file.path));

        const response = await axios.post(`${ocrServiceUrl}/api/ocr/upload`, form, {
            headers: {
                Authorization: req.headers.authorization,
                ...form.getHeaders()
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

module.exports = router;