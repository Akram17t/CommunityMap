const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateRequest, authenticate } = require('../middleware');
const { authValidators } = require('../validators');

const router = express.Router();

// Public routes
router.post('/register', authValidators.register, validateRequest, authController.register);
router.post('/login', authValidators.login, validateRequest, authController.login);

// Protected routes
router.get('/me', authenticate, authController.me);

module.exports = router;
