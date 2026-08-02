const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      const errorMessages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(`Validation error: ${errorMessages}`, 400));
    }
    next(err);
  }
};

module.exports = validate;
