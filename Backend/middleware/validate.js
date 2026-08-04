const AppError = require('../utils/AppError');

module.exports = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();

    // Support Zod schemas (safeParse)
    if (typeof schema.safeParse === 'function') {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = result.error.issues.map((issue) => issue.message).join(', ');
        return next(new AppError(errorMessage, 400));
      }
      req.body = result.data;
      return next();
    }

    // Support Joi schemas (validate)
    if (typeof schema.validate === 'function') {
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return next(new AppError(errorMessage, 400));
      }
      req.body = value;
      return next();
    }

    next();
  };
};
