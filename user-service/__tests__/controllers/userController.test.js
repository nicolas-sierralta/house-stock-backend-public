const { create, get, update } = require('../../controllers/userController');
const User = require('../../models/user');
const sequelize = require('../../db/db');

jest.mock('../../models/user');

describe('User Controller', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await sequelize.close();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          fullName: 'Test User',
          dateOfBirth: '2000-01-01',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      User.create.mockResolvedValue({});

      await create(req, res);

      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        fullName: 'Test User',
        dateOfBirth: '2000-01-01',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('User registered');
    });

    it('should return 400 if required fields are missing', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('All fields are required');
    });
  });

  describe('get', () => {
    it('should get a user by email', async () => {
      const req = { params: { email: 'test@example.com' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      User.findOne.mockResolvedValue({
        email: 'test@example.com',
        fullName: 'Test User',
        dateOfBirth: '2000-01-01',
      });

      await get(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        email: 'test@example.com',
        fullName: 'Test User',
        dateOfBirth: '2000-01-01',
      });
    });

    it('should return 404 if user is not found', async () => {
      const req = { params: { email: 'nonexistent@example.com' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);

      await get(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const req = {
        params: { email: 'test@example.com' },
        body: {
          fullName: 'Updated User',
          dateOfBirth: '2001-01-01',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      User.findOne.mockResolvedValue({
        email: 'test@example.com',
        fullName: 'Test User',
        dateOfBirth: '2000-01-01',
        save: jest.fn().mockResolvedValue(true),
      });

      await update(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('User updated');
    });

    it('should return 404 if user is not found', async () => {
      const req = {
        params: { email: 'nonexistent@example.com' },
        body: {
          fullName: 'Updated User',
          dateOfBirth: '2001-01-01',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);

      await update(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });
  });
});

