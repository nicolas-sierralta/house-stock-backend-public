const axios = require('axios');
require('dotenv').config();

const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:3000';

const registerUser = async (userData) => {
    try {
        await axios.post(`${apiGatewayUrl}/auth/register`, {
            email: userData.email,
            password: userData.password,
            fullName: userData.fullName,
            dateOfBirth: userData.dateOfBirth
        });
        console.log('testuser registered successfully');
    } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : error.message);
    }
};

const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${apiGatewayUrl}/auth/login`, {
            email,
            password
        });
        console.log('testuser logged in successfully');
        return response.data.token;
    } catch (error) {
        console.error('Error logging in user:', error.response ? error.response.data : error.message);
    }
};

const injectInitialData = async (token) => {
    const initialProducts = [
        { name: 'Rollo de Cocina', quantity: 10, price: 15.00, purchaseDate: '2023-07-01', store: 'Mercadona', location: 'Pantry', userId: 'testuser@example.com' },
        { name: 'Jabón Líquido', quantity: 5, price: 8.50, purchaseDate: '2023-07-01', store: 'Mercadona', location: 'Bathroom', userId: 'testuser@example.com' },
        { name: 'Leche Entera', quantity: 12, price: 18.00, purchaseDate: '2023-07-01', store: 'Lidl', location: 'Fridge', userId: 'testuser@example.com' },
        { name: 'Cereal de Desayuno', quantity: 4, price: 16.00, purchaseDate: '2023-07-01', store: 'Carrefour', location: 'Pantry', userId: 'testuser@example.com' },
        { name: 'Aceite de Oliva', quantity: 2, price: 10.00, purchaseDate: '2023-07-01', store: 'Aldi', location: 'Pantry', userId: 'testuser@example.com' },
        { name: 'Tomates', quantity: 6, price: 9.00, purchaseDate: '2023-07-02', store: 'Lidl', location: 'Fridge', userId: 'testuser@example.com' },
        { name: 'Manzanas', quantity: 8, price: 12.00, purchaseDate: '2023-07-02', store: 'Mercadona', location: 'Fridge', userId: 'testuser@example.com' },
        { name: 'Detergente', quantity: 3, price: 20.00, purchaseDate: '2023-07-03', store: 'Carrefour', location: 'Laundry', userId: 'testuser@example.com' },
        { name: 'Papel Higiénico', quantity: 12, price: 24.00, purchaseDate: '2023-07-03', store: 'Aldi', location: 'Bathroom', userId: 'testuser@example.com' },
        { name: 'Huevos', quantity: 30, price: 15.00, purchaseDate: '2023-07-03', store: 'Mercadona', location: 'Fridge', userId: 'testuser@example.com' },
        { name: 'Pan de Molde', quantity: 4, price: 8.00, purchaseDate: '2023-07-04', store: 'Lidl', location: 'Pantry', userId: 'testuser@example.com' },
        { name: 'Queso', quantity: 10, price: 25.00, purchaseDate: '2023-07-04', store: 'Carrefour', location: 'Fridge', userId: 'testuser@example.com' },
        { name: 'Yogurt', quantity: 20, price: 30.00, purchaseDate: '2023-07-04', store: 'Aldi', location: 'Fridge', userId: 'testuser@example.com' },
        { name: 'Pollo', quantity: 5, price: 25.00, purchaseDate: '2023-07-05', store: 'Mercadona', location: 'Freezer', userId: 'testuser@example.com' },
        { name: 'Pescado', quantity: 3, price: 18.00, purchaseDate: '2023-07-05', store: 'Lidl', location: 'Freezer', userId: 'testuser@example.com' },
        { name: 'Arroz', quantity: 10, price: 20.00, purchaseDate: '2023-07-05', store: 'Carrefour', location: 'Pantry', userId: 'testuser@example.com' },
        { name: 'Azúcar', quantity: 5, price: 7.50, purchaseDate: '2023-07-06', store: 'Aldi', location: 'Pantry', userId: 'testuser@example.com' },
        { name: 'Sal', quantity: 3, price: 2.50, purchaseDate: '2023-07-06', store: 'Mercadona', location: 'Pantry', userId: 'testuser@example.com' },
        { name: 'Pasta', quantity: 8, price: 12.00, purchaseDate: '2023-07-06', store: 'Lidl', location: 'Pantry', userId: 'testuser@example.com' },
        { name: 'Jugo de Naranja', quantity: 6, price: 18.00, purchaseDate: '2023-07-07', store: 'Carrefour', location: 'Fridge', userId: 'testuser@example.com' }
    ];

    try {
        for (const product of initialProducts) {
            await axios.post(`${apiGatewayUrl}/products/addProduct`, product, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        console.log('Initial products injected successfully');
    } catch (error) {
        console.error('Error injecting initial data:', error.response ? error.response.data : error.message);
    }
};

const updateUser = async (token) => {
    try {
        const response = await axios.put(`${apiGatewayUrl}/user/testuser@example.com`, {
            fullName: 'Updated Test User',
            dateOfBirth: '1991-01-01'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('User updated successfully:', response.data);
    } catch (error) {
        console.error('Error updating user:', error.response ? error.response.data : error.message);
    }
};

const changePassword = async (token) => {
    try {
        const response = await axios.put(`${apiGatewayUrl}/user/changePassword`, {
            email: 'testuser@example.com',
            oldPassword: 'password123',
            newPassword: '123'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Password changed successfully:', response.data);
    } catch (error) {
        console.error('Error changing password:', error.response ? error.response.data : error.message);
    }
};



const runTests = async () => {
    const userData = {
        email: 'testuser@example.com',
        password: 'password123',
        fullName: 'Test User',
        dateOfBirth: '1990-01-01'
    };

    await registerUser(userData);
    const token = await loginUser(userData.email, userData.password);

    if (token) {
        await injectInitialData(token);
        await updateUser(token);
        await changePassword(token);
    } else {
        console.error('Failed to obtain token, skipping data injection');
    }
};

module.exports = { runTests };