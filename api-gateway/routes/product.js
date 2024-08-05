/**
 * @fileoverview This file contains the route handlers for product management.
 * It communicates with the product service to handle various product-related operations such as adding, retrieving, updating, and deleting products, as well as syncing inventory.
 * 
 * @namespace routes
 * @memberof module:api-gateway
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

const productServiceUrl = process.env.PRODUCT_SERVICE_URL;

/**
 * Route handler for adding a product.
 * 
 * This endpoint sends the product data to the product service to add a new product.
 * 
 * @function
 * @memberof module:api-gateway/routes/product
 * @param {Object} req - The request object, which should include the product data in the body.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.post('/addProduct', async (req, res) => {
    try {
        const response = await axios.post(`${productServiceUrl}/product`, req.body, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

/**
 * Route handler for retrieving all products.
 * 
 * This endpoint fetches product data from the product service based on the user's email.
 * 
 * @function
 * @memberof module:api-gateway/routes/product
 * @param {Object} req - The request object, which should include user authentication details.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.get('/getAllProducts', async (req, res) => {
    try {
        const userId = req.user.email; 
        const response = await axios.get(`${productServiceUrl}/products?userId=${userId}`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

/**
 * Route handler for updating a product.
 * 
 * This endpoint sends updated product data to the product service to modify an existing product.
 * 
 * @function
 * @memberof module:api-gateway/routes/product
 * @param {Object} req - The request object, which should include the product ID in the URL and the updated data in the body.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.put('/updateProduct/:id', async (req, res) => {
    try {
        const response = await axios.put(`${productServiceUrl}/product/${req.params.id}`, req.body, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

/**
 * Route handler for deleting a product.
 * 
 * This endpoint sends a delete request to the product service to remove a product based on the specified ID.
 * 
 * @function
 * @memberof module:api-gateway/routes/product
 * @param {Object} req - The request object, which should include the product ID in the URL.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const response = await axios.delete(`${productServiceUrl}/product/${req.params.id}`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

/**
 * Route handler for syncing inventory.
 * 
 * This endpoint sends inventory data to the product service for synchronization.
 * 
 * @function
 * @memberof module:api-gateway/routes/product
 * @param {Object} req - The request object, which should include the inventory data in the body.
 * @param {Object} res - The response object used to send the status and response data.
 * @returns {void}
 */
router.post('/syncInventory', async (req, res) => {
    try {
        const response = await axios.post(`${productServiceUrl}/syncInventory`, req.body, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

module.exports = router;
