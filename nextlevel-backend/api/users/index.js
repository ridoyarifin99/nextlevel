const express = require('express');
const cors = require('cors');
const register = require('./auth/register');
const login = require('./auth/login');
const me = require('./users/me');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/users/me', me);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;