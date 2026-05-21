const { validationResult } = require('express-validator');
const { verifyToken } = require('../utils/auth');
const db = require('../config/database');
const ApiResponse = require('../utils/response');

/**
 * Handle validation errors
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
    }));
    
    return ApiResponse.validationError(res, formattedErrors);
  }
  
  next();
}

/**
 * Authenticate user from JWT token
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'No token provided');
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return ApiResponse.unauthorized(res, 'Invalid or expired token');
    }
    
    // Get user from database
    const result = await db.query(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return ApiResponse.unauthorized(res, 'User not found');
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return ApiResponse.unauthorized(res, 'Authentication failed');
  }
}

/**
 * Check if user is admin
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return ApiResponse.forbidden(res, 'Admin access required');
  }
  next();
}

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.code === '23505') { // PostgreSQL unique violation
    return ApiResponse.error(res, 'Resource already exists', 409);
  }
  
  if (err.code === '23503') { // PostgreSQL foreign key violation
    return ApiResponse.error(res, 'Referenced resource not found', 400);
  }
  
  if (err.name === 'UnauthorizedError') {
    return ApiResponse.unauthorized(res);
  }
  
  return ApiResponse.error(res, 'Internal server error');
}

module.exports = {
  validateRequest,
  authenticate,
  requireAdmin,
  errorHandler,
};
