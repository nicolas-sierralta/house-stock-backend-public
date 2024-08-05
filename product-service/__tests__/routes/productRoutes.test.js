const request = require('supertest');
const express = require('express');
const productRoutes = require('../../routes/productRoutes');
const Product = require('../../models/product');
const sequelize = require('../../db/db');

const app = express();
app.use(express.json());
app.use('/', productRoutes);

jest.mock('../../models/product', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOrCreate: jest.fn(),
  save: jest.fn(),
}));

describe('Product Routes', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4003);
    jest.useFakeTimers();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await sequelize.close();
    server.close();
    jest.clearAllMocks();
    jest.clearAllTimers();
    consoleSpy.mockRestore();
  });

  describe('POST /product', () => {
    it('should add a new product', async () => {
      const productData = {
        name: 'Test Product',
        quantity: 10,
        price: 99.99,
        purchaseDate: '2024-07-01',
        store: 'Test Store',
        location: 'Test Location',
        userId: 'user123',
      };

      Product.create.mockResolvedValue({});

      const res = await request(app)
        .post('/product')
        .send(productData);

      expect(res.status).toBe(201);
      expect(res.text).toBe('Product added');
    });

    it('should return 500 on error', async () => {
      const productData = {};

      Product.create.mockRejectedValue(new Error('Test error'));

      const res = await request(app)
        .post('/product')
        .send(productData);

      expect(res.status).toBe(500);
      expect(res.text).toBe('Server error. Please try again later.');
    });
  });

  describe('GET /products', () => {
    it('should get all products for a user', async () => {
      const products = [{ id: 1, name: 'Test Product' }];

      Product.findAll.mockResolvedValue(products);

      const res = await request(app)
        .get('/products')
        .query({ userId: 'user123' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(products);
    });

    it('should return 500 on error', async () => {
      Product.findAll.mockRejectedValue(new Error('Test error'));

      const res = await request(app)
        .get('/products')
        .query({ userId: 'user123' });

      expect(res.status).toBe(500);
      expect(res.text).toBe('Server error. Please try again later.');
    });
  });

  describe('PUT /product/:id', () => {
    it('should update an existing product', async () => {
      const productData = {
        name: 'Updated Product',
        quantity: 20,
        price: 49.99,
        purchaseDate: '2024-07-01',
        store: 'Updated Store',
        location: 'Updated Location',
        userId: 'user123',
      };

      const product = {
        id: 'product123',
        save: jest.fn().mockResolvedValue(true),
      };

      Product.findByPk.mockResolvedValue(product);

      const res = await request(app)
        .put('/product/product123')
        .send(productData);

      expect(res.status).toBe(200);
      expect(res.text).toBe('Product updated');
    });

    it('should return 404 if product is not found', async () => {
      Product.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put('/product/nonexistent')
        .send({
          name: 'Updated Product',
          quantity: 20,
          price: 49.99,
          purchaseDate: '2024-07-01',
          store: 'Updated Store',
          location: 'Updated Location',
          userId: 'user123',
        });

      expect(res.status).toBe(404);
      expect(res.text).toBe('Product not found');
    });

    it('should return 500 on error', async () => {
      Product.findByPk.mockRejectedValue(new Error('Test error'));

      const res = await request(app)
        .put('/product/product123')
        .send({
          name: 'Updated Product',
          quantity: 20,
          price: 49.99,
          purchaseDate: '2024-07-01',
          store: 'Updated Store',
          location: 'Updated Location',
          userId: 'user123',
        });

      expect(res.status).toBe(500);
      expect(res.text).toBe('Server error. Please try again later.');
    });
  });

  describe('DELETE /product/:id', () => {
    it('should delete an existing product', async () => {
      const product = {
        id: 'product123',
        destroy: jest.fn().mockResolvedValue(true),
      };

      Product.findByPk.mockResolvedValue(product);

      const res = await request(app)
        .delete('/product/product123');

      expect(res.status).toBe(200);
      expect(res.text).toBe('Product deleted');
    });

    it('should return 404 if product is not found', async () => {
      Product.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .delete('/product/nonexistent');

      expect(res.status).toBe(404);
      expect(res.text).toBe('Product not found');
    });

    it('should return 500 on error', async () => {
      Product.findByPk.mockRejectedValue(new Error('Test error'));

      const res = await request(app)
        .delete('/product/product123');

      expect(res.status).toBe(500);
      expect(res.text).toBe('Server error. Please try again later.');
    });
  });


});



