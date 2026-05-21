const db = require('../config/database');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

class AuthService {
  /**
   * Register a new user
   */
  async register(fullName, email, password) {
    // Check if email already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      throw new Error('Email already registered');
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Insert user
    const result = await db.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, 'citizen')
       RETURNING id, full_name, email, role, created_at`,
      [fullName, email, passwordHash]
    );
    
    const user = result.rows[0];
    
    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    return { user, token };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Get user
    const result = await db.query(
      'SELECT id, full_name, email, password_hash, role, created_at FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }
    
    const user = result.rows[0];
    
    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    // Remove password_hash from response
    delete user.password_hash;
    
    return { user, token };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const result = await db.query(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }
}

module.exports = new AuthService();
