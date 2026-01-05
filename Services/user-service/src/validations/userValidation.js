import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js';

const userValidation = {
  register: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
      }),

      password: Joi.string()
        .min(8)
        .max(50)
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required()
        .messages({
          'string.min': 'Password must be at least 8 characters long',
          'string.max': 'Password must not exceed 50 characters',
          'string.pattern.base':
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)',
          'any.required': 'Password is required',
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
          'any.only': 'Password confirmation does not match',
          'any.required': 'Password confirmation is required',
        }),
      fullName: Joi.string()
        .min(2)
        .max(100)
        // eslint-disable-next-line no-useless-escape
        .pattern(/^[\p{L}\s\-'\.]+$/u)
        .required()
        .messages({
          'string.min': 'Full name must be at least 2 characters long',
          'string.max': 'Full name must not exceed 100 characters',
          'string.pattern.base':
            'Full name may only contain letters, spaces, hyphens, apostrophes, and periods',
          'any.required': 'Full name is required',
        }),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
      }),
      password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required',
      }),
    }),
  },

  changePassword: {
    body: Joi.object({
      currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required',
      }),
      newPassword: Joi.string()
        .min(6)
        .max(50)
        .required()
        .invalid(Joi.ref('currentPassword'))
        .messages({
          'string.min': 'New password must be at least 6 characters long',
          'string.max': 'New password must not exceed 50 characters',
          'any.required': 'New password is required',
          'any.invalid':
            'New password must be different from the current password',
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
          'any.only': 'Password confirmation does not match',
          'any.required': 'Password confirmation is required',
        }),
    }),
  },

  getUserById: {
    params: Joi.object({
      id: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
        'string.pattern.base': OBJECT_ID_RULE_MESSAGE,
        'any.required': 'ID is required',
      }),
    }),
  },

  updateUser: {
    body: Joi.object({
      fullName: Joi.string().min(2).max(100).messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name must not exceed 100 characters',
      }),
      role: Joi.string().valid('admin', 'user').messages({
        'any.only': 'Role must be either admin or user',
      }),
      status: Joi.string().valid('active', 'inactive', 'blocked').messages({
        'any.only': 'Status must be active, inactive, or blocked',
      }),
    }),
    params: Joi.object({
      id: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
        'string.pattern.base': OBJECT_ID_RULE_MESSAGE,
        'any.required': 'ID is required',
      }),
    }),
  },

  getUsersList: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be greater than 0',
      }),
      limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be greater than 0',
        'number.max': 'Limit must not exceed 100',
      }),

      // Các field lọc riêng
      fullName: Joi.string().max(100).optional().messages({
        'string.max': 'Full name must not exceed 100 characters',
      }),
      email: Joi.string().email().optional().messages({
        'string.email': 'Email must be a valid email address',
      }),

      status: Joi.string()
        .valid('active', 'inactive', 'blocked')
        .optional()
        .messages({
          'any.only': 'Status must be active, inactive, or blocked',
        }),
      role: Joi.string().valid('admin', 'user').optional().messages({
        'any.only': 'Role must be either admin or user',
      }),

      // sort = "fullName:DESC,createdAt:ASC"
      sort: Joi.string()
        .pattern(/^[a-zA-Z0-9]+:(ASC|DESC)(,[a-zA-Z0-9]+:(ASC|DESC))*$/)
        .optional()
        .messages({
          'string.pattern.base':
            'Sort must be in format "field:ASC,field:DESC"',
        }),
    }),
  },

  createUser: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
      }),
      password: Joi.string().min(6).max(50).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must not exceed 50 characters',
        'any.required': 'Password is required',
      }),
      fullName: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name must not exceed 100 characters',
        'any.required': 'Full name is required',
      }),
      role: Joi.string().valid('admin', 'user').default('user').messages({
        'any.only': 'Role must be either admin or user',
      }),
      status: Joi.string()
        .valid('active', 'inactive', 'blocked')
        .default('active')
        .messages({
          'any.only': 'Status must be active, inactive, or blocked',
        }),
    }),
  },

  forgotPassword: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
      }),
    }),
  },

  resetPassword: {
    body: Joi.object({
      token: Joi.string().required().messages({
        'any.required': 'Token is required',
      }),
      newPassword: Joi.string()
        .min(8)
        .max(50)
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required()
        .messages({
          'string.min': 'Password must be at least 8 characters long',
          'string.max': 'Password must not exceed 50 characters',
          'string.pattern.base':
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)',
          'any.required': 'Password is required',
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
          'any.only': 'Password confirmation does not match',
          'any.required': 'Password confirmation is required',
        }),
    }),
  },

  refreshToken: {
    body: Joi.object({
      refreshToken: Joi.string().required().messages({
        'any.required': 'Refresh token is required',
        'string.empty': 'Refresh token cannot be empty',
        'string.base': 'Refresh token must be a string',
      }),
    }),
  },

  logout: {
    body: Joi.object({
      refreshToken: Joi.string().optional().allow('').messages({
        'string.base': 'Refresh token must be a string',
      }),
    }),
  },
};

export default userValidation;
