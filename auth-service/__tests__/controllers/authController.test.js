const { register, login, changePassword } = require('../../controllers/authController');
const User = require('../../models/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../models/auth');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');



describe('Auth Controller', () => {
  beforeAll(() => {
    // Espiar console.error antes de todas las pruebas
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restaurar console.error después de todas las pruebas
    consoleErrorSpy.mockRestore();
  });


  describe('register', () => {
    it('should return 400 if email or password is missing', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Email and password are required');
    });

    it('should create a new user and return 201', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockResolvedValue({ email: 'test@example.com' });

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.create).toHaveBeenCalledWith({ email: 'test@example.com', password: 'hashedPassword' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('User registered');
    });

    it('should handle errors and return 500', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      bcrypt.hash.mockRejectedValue(new Error('Test error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error. Please try again later.');
    });
  });

  describe('login', () => {
    it('should return 401 if credentials are invalid', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Invalid credentials');
    });

    it('should return a token if credentials are valid', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = {
        json: jest.fn()
      };

      const user = { email: 'test@example.com', password: 'hashedPassword' };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith({ email: 'test@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(res.json).toHaveBeenCalledWith({ token: 'fake-jwt-token' });
    });

    it('should handle errors and return 500', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      User.findOne.mockRejectedValue(new Error('Test error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Test error');
    });
  });

  describe('changePassword', () => {
    it('should return 400 if email, oldPassword, or newPassword is missing', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Email, old password, and new password are required');
    });

    it('should return 404 if user is not found', async () => {
      const req = { body: { email: 'test@example.com', oldPassword: 'oldpassword', newPassword: 'newpassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      User.findOne.mockResolvedValue(null);

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });

    it('should return 401 if old password is incorrect', async () => {
      const req = { body: { email: 'test@example.com', oldPassword: 'wrongpassword', newPassword: 'newpassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      const user = { email: 'test@example.com', password: 'hashedPassword' };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await changePassword(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Old password is incorrect');
    });

    it('should change the password and return 200', async () => {
      const req = { body: { email: 'test@example.com', oldPassword: 'oldpassword', newPassword: 'newpassword' } };
      const res = {
        send: jest.fn()
      };

      const user = { email: 'test@example.com', password: 'hashedPassword', save: jest.fn() };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newHashedPassword');

      await changePassword(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('oldpassword', 'hashedPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(user.password).toBe('newHashedPassword');
      expect(user.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith('Password changed successfully');
    });

    it('should handle errors and return 500', async () => {
      const req = { body: { email: 'test@example.com', oldPassword: 'oldpassword', newPassword: 'newpassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      User.findOne.mockRejectedValue(new Error('Test error'));

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error. Please try again later.');
    });
  });
});
