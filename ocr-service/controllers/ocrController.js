/**
 * @fileoverview This file contains the function to process a receipt using Azure Form Recognizer.
 * It includes functionality to read the receipt file, analyze it using Azure's Form Recognizer, and return the parsed receipt information.
 * @namespace controllers
 * @memberof module:ocr-service
 */

const fs = require('fs');
const path = require('path');
const { DocumentAnalysisClient, AzureKeyCredential } = require('@azure/ai-form-recognizer');
require('dotenv').config();
const { makeRequestWithRetry } = require('../utils/retry');

const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
const apiKey = process.env.FORM_RECOGNIZER_API_KEY;
const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

/**
 * Processes a receipt uploaded by the user.
 * This function reads the receipt file, sends it to Azure Form Recognizer for analysis, and returns the extracted receipt details.
 * 
 * @function
 * @memberof ocr-service.controllers
 * @param {Object} req - The request object.
 * @param {Object} req.file - The uploaded file object containing the receipt.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.processReceipt = async (req, res) => {
    const filePath = path.join(__dirname, '../', req.file.path);
    try {
        const readStream = fs.createReadStream(filePath);

        const poller = await makeRequestWithRetry(() => client.beginAnalyzeDocument("prebuilt-receipt", readStream, {
            onProgress: ({ status }) => {
                console.log(`status: ${status}`);
            },
        }));

        const { documents } = await poller.pollUntilDone();

        if (!documents || documents.length <= 0) {
            res.status(500).send("No se pudo reconocer el recibo.");
            return;
        }

        const receipt = documents[0].fields;
        const date = receipt["TransactionDate"] ? receipt["TransactionDate"].value : "No disponible";
        const merchantName = receipt["MerchantName"] ? receipt["MerchantName"].value : "No disponible";

        const items = receipt["Items"] ? receipt["Items"].values.map(item => ({
            name: item.properties["Description"] ? item.properties["Description"].value : "No disponible",
            quantity: item.properties["Quantity"] ? item.properties["Quantity"].value : "No disponible",
            price: item.properties["TotalPrice"] ? item.properties["TotalPrice"].value : "No disponible"
        })) : [];

        res.json({
            date,
            merchantName,
            items
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error al procesar el ticket.");
    } finally {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error al eliminar el archivo: ${filePath}`, err);
            } else {
                console.log(`Archivo eliminado: ${filePath}`);
            }
        });
    }
};
