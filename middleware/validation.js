const { body, validationResult } = require('express-validator');

// Example validation for user registration
const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('pass').isLength({ min: 6 }),
  body('facorstudent').isIn(['student', 'faculty', 'admin']),
  // Add more validation rules
];

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateUser,
  validate
}; 