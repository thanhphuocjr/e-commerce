import AppError from '../utils/AppError.js';

// Middleware validation với Joi
const validate = (schema) => {
  return (req, res, next) => {
    const validationErrors = {};

    if (schema.body) {
      const { error, value } = schema.body.validate(req.body);
      if (error) {
        validationErrors.body = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));
      } else {
        req.body = value;
      }
    }

    if (schema.params) {
      const { error, value } = schema.params.validate(req.params);
      if (error) {
        validationErrors.params = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));
      } else {
        req.params = value;
      }
    }

    if (schema.query) {
      const { error, value } = schema.query.validate(req.query);
      if (error) {
        validationErrors.query = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));
      } else {
        req.query = value;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstError = validationErrors[firstErrorKey][0];
      const newMessage = `Field: ${firstError.field}, ${firstError.message}`;
      throw new AppError(newMessage, 400, validationErrors);
    }

    next();
  };
};

export default validate;
