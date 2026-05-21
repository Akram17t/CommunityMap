const { body, param, query } = require('express-validator');

const authValidators = {
  register: [
    body('full_name')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('confirm_password')
      .notEmpty()
      .withMessage('Confirm password is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
  ],
  
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
};

const reportValidators = {
  create: [
    body('category_id')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .isUUID()
      .withMessage('Invalid category ID'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('latitude')
      .notEmpty()
      .withMessage('Latitude is required')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('longitude')
      .notEmpty()
      .withMessage('Longitude is required')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Address must be less than 500 characters'),
  ],
  
  updateStatus: [
    param('id')
      .isUUID()
      .withMessage('Invalid report ID'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['new', 'verified', 'in_progress', 'resolved'])
      .withMessage('Invalid status value'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must be less than 1000 characters'),
  ],
  
  verify: [
    param('id')
      .isUUID()
      .withMessage('Invalid report ID'),
    body('is_verified')
      .notEmpty()
      .withMessage('Verification status is required')
      .isBoolean()
      .withMessage('Verification status must be a boolean'),
  ],
  
  list: [
    query('category')
      .optional()
      .isUUID()
      .withMessage('Invalid category ID'),
    query('status')
      .optional()
      .isIn(['new', 'verified', 'in_progress', 'resolved'])
      .withMessage('Invalid status'),
    query('date_from')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
    query('date_to')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
    query('sort_by')
      .optional()
      .isIn(['newest', 'oldest', 'upvotes'])
      .withMessage('Invalid sort option'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be at least 1'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
};

module.exports = {
  authValidators,
  reportValidators,
};
