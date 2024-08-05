/**
 * @fileoverview This file contains utility functions for handling retries with exponential backoff for HTTP requests.
 * The `makeRequestWithRetry` function attempts to execute a request function with retry logic in case of failure.
 * @namespace utils
 * @memberof module:ocr-service
 */

const fs = require('fs');
const path = require('path');

/**
 * Makes a request with retry logic and exponential backoff.
 * 
 * @function
 * @memberof ocr-service.utils
 * @param {Function} requestFunction - The function that performs the request and returns a promise.
 * @param {number} [retries=3] - The number of retries to attempt before failing. Defaults to 3.
 * @param {number} [backoff=300] - The initial delay in milliseconds between retries. Defaults to 300ms.
 * @returns {Promise<Object>} - The response from the request function.
 * @throws {Error} - Throws an error if all retry attempts fail.
 *
 * @example
 * const result = await makeRequestWithRetry(() => someApiRequest(), 5, 500);
 * // Makes up to 5 retries with an initial backoff of 500ms, doubling the backoff each retry.
 */
exports.makeRequestWithRetry = async (requestFunction, retries = 3, backoff = 300) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await requestFunction();
            return response;
        } catch (error) {
            if (i < retries - 1) {
                console.log(`Retrying in ${backoff}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                backoff *= 2; // Exponential backoff
            } else {
                throw error;
            }
        }
    }
};
