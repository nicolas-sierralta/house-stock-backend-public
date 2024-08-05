/**
 * @fileoverview This file defines the routes for handling OCR requests, specifically for uploading and processing receipt images.
 * It uses the multer middleware to handle file uploads and connects to the OCR controller to process the receipts.
 * @namespace routes
 * @memberof module:ocr-service
 */

const express = require('express');
const multer = require('multer');
const ocrController = require('../controllers/ocrController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * Route handler for uploading and processing a receipt image.
 * This route uses multer to handle file uploads and then processes the uploaded receipt image using the OCR controller.
 * 
 * @name POST /upload
 * @function
 * @memberof ocr-service.routes
 * @param {Object} req - The request object containing the uploaded file.
 * @param {Object} req.file - The uploaded file object containing the receipt image.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.post('/upload', upload.single('ticket'), ocrController.processReceipt);

module.exports = router;
