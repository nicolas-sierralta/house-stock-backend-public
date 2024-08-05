/**
 * @fileoverview This file sets up the Sequelize connection to the MySQL database for the Product service.
 * It handles the database connection configuration and includes retry logic in case of connection failure.
 * @namespace db
 * @memberof module:product-service
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Initializes a new Sequelize instance for connecting to the MySQL database.
 * 
 * @memberof product-service.db
 * @type {Sequelize}
 */
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true,
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
});

if (process.env.NODE_ENV !== 'test') {
  /**
   * Connects to the database with retry logic in case of connection failure.
   * 
   * @async
   * @function connectWithRetry
   * @param {number} [retries=5] - Number of retries before giving up.
   * @param {number} [delay=5000] - Delay in milliseconds between retries.
   * @memberof product-service.db
   */
  const connectWithRetry = async (retries = 5, delay = 5000) => {
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log('Connected to the database server.');
        return;
      } catch (err) {
        console.error(`Error connecting to the database: ${err.message}`);
        retries -= 1;
        console.log(`Retries left: ${retries}`);
        if (retries === 0) {
          console.error('Could not connect to the database. Exiting...');
          process.exit(1);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  connectWithRetry();
}

module.exports = sequelize;

