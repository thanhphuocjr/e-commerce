// src/models/userModel.js
import Joi from 'joi';
import bcrypt from 'bcryptjs';
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../../utils/

export const USER_COLLECTION_NAME = 'users';

export const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().min(6).max(100).required(),
  fullName: Joi.string().min(2).max(100).required().trim().strict(),
  role: Joi.string().valid('admin', 'user').default('user'),
  status: Joi.string()
    .valid('active', 'inactive', 'blocked')
    .default('inactive'),
  lastLogin: Joi.date().timestamp('javascript').default(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  resetPasswordToken: Joi.string().allow(null),
  resetPasswordExpires: Joi.date().allow(null),
  deletedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

// Validate trước khi tạo user
export const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

// Hash password
export const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

// Compare password
export const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};
