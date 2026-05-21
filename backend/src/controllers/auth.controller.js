const authService = require('../services/auth.service');
const ApiResponse = require('../utils/response');

class AuthController {
  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      const { full_name, email, password } = req.body;
      
      const result = await authService.register(full_name, email, password);
      
      return ApiResponse.success(res, result, 'User registered successfully', 201);
    } catch (error) {
      console.error('Register error:', error);
      
      if (error.message === 'Email already registered') {
        return ApiResponse.error(res, error.message, 409);
      }
      
      return ApiResponse.error(res, 'Failed to register user');
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const result = await authService.login(email, password);
      
      return ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid email or password') {
        return ApiResponse.error(res, error.message, 401);
      }
      
      return ApiResponse.error(res, 'Failed to login');
    }
  }

  /**
   * Get current user
   */
  async me(req, res) {
    try {
      const user = await authService.getUserById(req.user.id);
      
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }
      
      return ApiResponse.success(res, { user });
    } catch (error) {
      console.error('Get user error:', error);
      return ApiResponse.error(res, 'Failed to get user');
    }
  }
}

module.exports = new AuthController();
