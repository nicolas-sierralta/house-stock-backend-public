/**
 * @fileoverview This file defines the Product model for the Product service using Sequelize.
 * The Product model includes various fields related to the product's details.
 * @namespace models
 * @memberof module:product-service
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

/**
 * Represents a product in the product service.
 * 
 * @typedef {Object} Product
 * @property {string} id - The unique identifier for the product, automatically generated as a UUID.
 * @property {string} name - The name of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {number} price - The price of the product.
 * @property {string} purchaseDate - The purchase date of the product.
 * @property {string} store - The store where the product was purchased.
 * @property {string} location - The location where the product is stored.
 * @property {string} userId - The ID of the user associated with the product.
 * 
 * @memberof product-service.models
 */
const Product = sequelize.define('product', {
  /**
   * The unique identifier for the product, automatically generated as a UUID.
   * @type {string}
   * @memberof product-service.models.Product
   */
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  /**
   * The name of the product.
   * @type {string}
   * @memberof product-service.models.Product
   */
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /**
   * The quantity of the product.
   * @type {number}
   * @memberof product-service.models.Product
   */
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  /**
   * The price of the product.
   * @type {number}
   * @memberof product-service.models.Product
   */
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  /**
   * The purchase date of the product.
   * @type {string}
   * @memberof product-service.models.Product
   */
  purchaseDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /**
   * The store where the product was purchased.
   * @type {string}
   * @memberof product-service.models.Product
   */
  store: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /**
   * The location where the product is stored.
   * @type {string}
   * @memberof product-service.models.Product
   */
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /**
   * The ID of the user associated with the product.
   * @type {string}
   * @memberof product-service.models.Product
   */
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'products',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: false
});

module.exports = Product;
