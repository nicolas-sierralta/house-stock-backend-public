const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoutes');
const sequelize = require('../../db/db');

const app = express();
app.use(express.json());
app.use('/', userRoutes);

jest.mock('../../models/user', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
}));

describe('User Routes', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4001);
    jest.useFakeTimers();
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
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        fullName: 'Test User',
        dateOfBirth: '2000-01-01',
      };

      const res = await request(app)
        .post('/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.text).toBe('User registered');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.text).toBe('All fields are required');
    });
  });

  describe('GET /user/:email', () => {
    it('should get a user by email', async () => {
      const user = {
        email: 'test@example.com',
        fullName: 'Test User',
        dateOfBirth: '2000-01-01',
      };

      require('../../models/user').findOne.mockResolvedValue(user);

      const res = await request(app)
        .get('/user/test@example.com');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(user);
    });

    it('should return 404 if user is not found', async () => {
      require('../../models/user').findOne.mockResolvedValue(null);

      const res = await request(app)
        .get('/user/nonexistent@example.com');

      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });
  });

  describe('PUT /user/:email', () => {
    it('should update an existing user', async () => {
      const user = {
        email: 'test@example.com',
        fullName: 'Test User',
        dateOfBirth: '2000-01-01',
        save: jest.fn().mockResolvedValue(true),
      };

      require('../../models/user').findOne.mockResolvedValue(user);

      const res = await request(app)
        .put('/user/test@example.com')
        .send({
          fullName: 'Updated User',
          dateOfBirth: '2001-01-01',
        });

      expect(res.status).toBe(200);
      expect(res.text).toBe('User updated');
    });

    it('should return 404 if user is not found', async () => {
      require('../../models/user').findOne.mockResolvedValue(null);

      const res = await request(app)
        .put('/user/nonexistent@example.com')
        .send({
          fullName: 'Updated User',
          dateOfBirth: '2001-01-01',
        });

      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });
  });
});

