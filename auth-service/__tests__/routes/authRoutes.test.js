const request = require('supertest');
const express = require('express');
const { register, login, changePassword } = require('../../controllers/authController');
const authRoutes = require('../../routes/authRoutes');

jest.mock('../../controllers/authController');

const app = express();
app.use(express.json());
app.use('/', authRoutes);

describe('Auth Routes', () => {
  beforeAll(() => {
    // Espiar console.error antes de todas las pruebas
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restaurar console.error después de todas las pruebas
    consoleErrorSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call register controller on POST /register', async () => {
    register.mockImplementation((req, res) => {
      res.status(201).send('User registered');
    });

    const res = await request(app)
      .post('/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.text).toBe('User registered');
    expect(register).toHaveBeenCalledTimes(1);
  });

  it('should call login controller on POST /login', async () => {
    login.mockImplementation((req, res) => {
      res.status(200).json({ token: 'fake-jwt-token' });
    });

    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('fake-jwt-token');
    expect(login).toHaveBeenCalledTimes(1);
  });

  it('should call changePassword controller on PUT /changePassword', async () => {
    changePassword.mockImplementation((req, res) => {
      res.status(200).send('Password changed successfully');
    });

    const res = await request(app)
      .put('/changePassword')
      .send({ email: 'test@example.com', oldPassword: 'oldpassword', newPassword: 'newpassword' });

    expect(res.status).toBe(200);
    expect(res.text).toBe('Password changed successfully');
    expect(changePassword).toHaveBeenCalledTimes(1);
  });

  it('should handle errors in register controller', async () => {
    register.mockImplementation((req, res) => {
      res.status(500).send('Server error. Please try again later.');
    });

    const res = await request(app)
      .post('/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(500);
    expect(res.text).toBe('Server error. Please try again later.');
    expect(register).toHaveBeenCalledTimes(1);
  });

  it('should handle errors in login controller', async () => {
    login.mockImplementation((req, res) => {
      res.status(500).send('Server error. Please try again later.');
    });

    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(500);
    expect(res.text).toBe('Server error. Please try again later.');
    expect(login).toHaveBeenCalledTimes(1);
  });

  it('should handle errors in changePassword controller', async () => {
    changePassword.mockImplementation((req, res) => {
      res.status(500).send('Server error. Please try again later.');
    });

    const res = await request(app)
      .put('/changePassword')
      .send({ email: 'test@example.com', oldPassword: 'oldpassword', newPassword: 'newpassword' });

    expect(res.status).toBe(500);
    expect(res.text).toBe('Server error. Please try again later.');
    expect(changePassword).toHaveBeenCalledTimes(1);
  });
});




