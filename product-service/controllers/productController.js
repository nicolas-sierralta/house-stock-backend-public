/**
 * @fileoverview This file contains the controller functions for managing products,
 * including adding, retrieving, updating, deleting products, and synchronizing inventory.
 * @namespace controllers
 * @memberof module:product-service
 */

const Product = require('../models/product');

/**
 * Adds a new product to the database.
 * 
 * @function addProduct
 * @memberof product-service.controllers
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing product details.
 * @param {string} req.body.name - The name of the product.
 * @param {number} req.body.quantity - The quantity of the product.
 * @param {number} req.body.price - The price of the product.
 * @param {string} req.body.purchaseDate - The purchase date of the product.
 * @param {string} req.body.store - The store where the product was purchased.
 * @param {string} req.body.location - The location of the product in storage.
 * @param {string} req.body.userId - The ID of the user who owns the product.
 * @param {Object} res - The response object.
 */
const addProduct = async (req, res) => {
  const { name, quantity, price, purchaseDate, store, location, userId } = req.body;

  try {
    const product = await Product.create({
      name,
      quantity,
      price,
      purchaseDate,
      store,
      location,
      userId,
    });
    res.status(201).send('Product added');
  } catch (error) {
    console.error('Error during product addition:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

/**
 * Retrieves all products for a specific user.
 * 
 * @function getAllProducts
 * @memberof product-service.controllers
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.userId - The ID of the user whose products are to be retrieved.
 * @param {Object} res - The response object.
 */
const getAllProducts = async (req, res) => {
  const { userId } = req.query;

  try {
    const products = await Product.findAll({
      where: { userId },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

/**
 * Updates an existing product by its ID.
 * 
 * @function updateProduct
 * @memberof product-service.controllers
 * @param {Object} req - The request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the product to be updated.
 * @param {Object} req.body - The body of the request containing updated product details.
 * @param {string} req.body.name - The new name of the product.
 * @param {number} req.body.quantity - The new quantity of the product.
 * @param {number} req.body.price - The new price of the product.
 * @param {string} req.body.purchaseDate - The new purchase date of the product.
 * @param {string} req.body.store - The new store where the product was purchased.
 * @param {string} req.body.location - The new location of the product in storage.
 * @param {string} req.body.userId - The new user ID associated with the product.
 * @param {Object} res - The response object.
 */
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, purchaseDate, store, location, userId } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (product) {
      product.name = name;
      product.quantity = quantity;
      product.price = price;
      product.purchaseDate = purchaseDate;
      product.store = store;
      product.location = location;
      product.userId = userId;
      await product.save();
      res.status(200).send('Product updated');
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error during product update:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

/**
 * Deletes a product by its ID.
 * 
 * @function deleteProduct
 * @memberof product-service.controllers
 * @param {Object} req - The request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the product to be deleted.
 * @param {Object} res - The response object.
 */
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      res.status(200).send('Product deleted');
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error during product deletion:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

/**
 * Synchronizes the inventory based on changes.
 * 
 * @function syncInventory
 * @memberof product-service.controllers
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing changes and user ID.
 * @param {Array} req.body.changes - An array of change objects.
 * @param {string} req.body.userId - The ID of the user whose inventory is being synchronized.
 * @param {Object} res - The response object.
 */
const syncInventory = async (req, res) => {
  const { changes, userId } = req.body;

  try {
    for (const change of changes) {
      if (change.action === 'delete') {
        const product = await Product.findOne({
          where: { id: change.id, userId: userId },
        });
        if (product) {
          await product.destroy();
        }
      } else {
        const { action, ...productData } = change;

        const [product, created] = await Product.findOrCreate({
          where: { id: change.id, userId: userId },
          defaults: productData,
        });

        if (!created) {
          Object.assign(product, productData);
          await product.save();
        }
      }
    }
    res.status(200).send('Inventory synchronized');
  } catch (error) {
    console.error('Error during inventory synchronization:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  syncInventory,
};
