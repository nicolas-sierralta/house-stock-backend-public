/**
 * @fileoverview This file sets up the routes for managing products in the Product service.
 * It includes routes for adding, retrieving, updating, deleting products, and synchronizing inventory.
 * @namespace routes
 * @memberof module:product-service
 */

const express = require('express');
const { addProduct, getAllProducts, updateProduct, deleteProduct, syncInventory } = require('../controllers/productController');

const router = express.Router();

/**
 * Route for adding a new product.
 * 
 * @name POST /product
 * @function
 * @memberof product-service.routes
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.name - The name of the product.
 * @param {number} req.body.quantity - The quantity of the product.
 * @param {number} req.body.price - The price of the product.
 * @param {string} req.body.purchaseDate - The purchase date of the product.
 * @param {string} req.body.store - The store where the product was purchased.
 * @param {string} req.body.location - The location where the product is stored.
 * @param {string} req.body.userId - The ID of the user associated with the product.
 * @param {Object} res - The response object.
 */
router.post('/product', addProduct);

/**
 * Route for retrieving all products associated with a user.
 * 
 * @name GET /products
 * @function
 * @memberof product-service.routes
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.userId - The ID of the user whose products are being retrieved.
 * @param {Object} res - The response object.
 */
router.get('/products', getAllProducts);

/**
 * Route for updating an existing product.
 * 
 * @name PUT /product/:id
 * @function
 * @memberof product-service.routes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the product to be updated.
 * @param {Object} req.body - The body of the request containing the updated product data.
 * @param {string} req.body.name - The name of the product.
 * @param {number} req.body.quantity - The quantity of the product.
 * @param {number} req.body.price - The price of the product.
 * @param {string} req.body.purchaseDate - The purchase date of the product.
 * @param {string} req.body.store - The store where the product was purchased.
 * @param {string} req.body.location - The location where the product is stored.
 * @param {string} req.body.userId - The ID of the user associated with the product.
 * @param {Object} res - The response object.
 */
router.put('/product/:id', updateProduct);

/**
 * Route for deleting a product by ID.
 * 
 * @name DELETE /product/:id
 * @function
 * @memberof product-service.routes
 * @param {Object} req - The request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the product to be deleted.
 * @param {Object} res - The response object.
 */
router.delete('/product/:id', deleteProduct);

/**
 * Route for synchronizing the inventory.
 * 
 * @name POST /syncInventory
 * @function
 * @memberof product-service.routes
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing inventory changes.
 * @param {Array.<Object>} req.body.changes - List of changes to synchronize.
 * @param {string} req.body.userId - The ID of the user associated with the inventory changes.
 * @param {Object} res - The response object.
 */
router.post('/syncInventory', syncInventory);

module.exports = router;
