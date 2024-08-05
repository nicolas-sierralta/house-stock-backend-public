const { addProduct, getAllProducts, updateProduct, deleteProduct, syncInventory } = require('../../controllers/productController');
const Product = require('../../models/product');
const sequelize = require('../../db/db');

jest.mock('../../models/product');

describe('Product Controller', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await sequelize.close();
    jest.clearAllMocks();
    jest.clearAllTimers();
    consoleSpy.mockRestore();
  });

  describe('addProduct', () => {
    it('should add a new product', async () => {
      const req = {
        body: {
          name: 'Test Product',
          quantity: 10,
          price: 99.99,
          purchaseDate: '2024-07-01',
          store: 'Test Store',
          location: 'Test Location',
          userId: 'user123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Product.create.mockResolvedValue({});

      await addProduct(req, res);

      expect(Product.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('Product added');
    });

    it('should return 500 on error', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Product.create.mockRejectedValue(new Error('Test error'));

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error. Please try again later.');
    });
  });

  describe('getAllProducts', () => {
    it('should get all products for a user', async () => {
      const req = { query: { userId: 'user123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      const products = [{ id: 1, name: 'Test Product' }];
      Product.findAll.mockResolvedValue(products);

      await getAllProducts(req, res);

      expect(Product.findAll).toHaveBeenCalledWith({ where: { userId: 'user123' } });
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should return 500 on error', async () => {
      const req = { query: { userId: 'user123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Product.findAll.mockRejectedValue(new Error('Test error'));

      await getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error. Please try again later.');
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const req = {
        params: { id: 'product123' },
        body: {
          name: 'Updated Product',
          quantity: 20,
          price: 49.99,
          purchaseDate: '2024-07-01',
          store: 'Updated Store',
          location: 'Updated Location',
          userId: 'user123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const product = {
        id: 'product123',
        save: jest.fn().mockResolvedValue(true),
      };
      Product.findByPk.mockResolvedValue(product);

      await updateProduct(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith('product123');
      expect(product.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Product updated');
    });

    it('should return 404 if product is not found', async () => {
      const req = {
        params: { id: 'nonexistent' },
        body: {
          name: 'Updated Product',
          quantity: 20,
          price: 49.99,
          purchaseDate: '2024-07-01',
          store: 'Updated Store',
          location: 'Updated Location',
          userId: 'user123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Product.findByPk.mockResolvedValue(null);

      await updateProduct(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith('nonexistent');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Product not found');
    });

    it('should return 500 on error', async () => {
      const req = {
        params: { id: 'product123' },
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Product.findByPk.mockRejectedValue(new Error('Test error'));

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error. Please try again later.');
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product', async () => {
      const req = { params: { id: 'product123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const product = {
        id: 'product123',
        destroy: jest.fn().mockResolvedValue(true),
      };
      Product.findByPk.mockResolvedValue(product);

      await deleteProduct(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith('product123');
      expect(product.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Product deleted');
    });

    it('should return 404 if product is not found', async () => {
      const req = { params: { id: 'nonexistent' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Product.findByPk.mockResolvedValue(null);

      await deleteProduct(req, res);

      expect(Product.findByPk).toHaveBeenCalledWith('nonexistent');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Product not found');
    });

    it('should return 500 on error', async () => {
      const req = { params: { id: 'product123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      Product.findByPk.mockRejectedValue(new Error('Test error'));

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error. Please try again later.');
    });
  });
});